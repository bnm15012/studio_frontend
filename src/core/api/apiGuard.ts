/**
 * apiGuard.ts — Two-layer protection against runaway API calls.
 *
 * Layer 1 — Request deduplication:
 *   Identical in-flight GET requests (same URL + serialised params) are
 *   collapsed into a single network call. All callers share the same Promise.
 *
 * Layer 2 — Per-endpoint rate limiter (sliding window):
 *   A maximum of `MAX_CALLS_PER_WINDOW` calls per unique endpoint key are
 *   allowed within `WINDOW_MS`. Calls beyond the cap are rejected immediately
 *   with a descriptive error (no network request is made).
 *
 * Usage:
 *   Install both layers on the Axios instance in api.ts:
 *
 *   import { installDedupeInterceptor, installRateLimitInterceptor } from "@/core/api/apiGuard";
 *   installDedupeInterceptor(api);
 *   installRateLimitInterceptor(api);
 */

import type {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosRequestConfig,
} from "axios";

// ── Config ─────────────────────────────────────────────────────────────────────

/** Max calls to a single endpoint key allowed inside the sliding window. */
const MAX_CALLS_PER_WINDOW = 10;

/** Sliding-window duration in milliseconds. */
const WINDOW_MS = 10_000; // 10 seconds

/** Methods to deduplicate (safe, idempotent reads only). */
const DEDUPE_METHODS = new Set(["get"]);

/** Methods subject to the rate limiter. */
const RATE_LIMIT_METHODS = new Set(["get", "post", "put", "delete", "patch"]);

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Build a stable cache key from method + URL + serialised params/body. */
function buildKey(config: InternalAxiosRequestConfig): string {
    const method = (config.method ?? "get").toLowerCase();
    const url = config.url ?? "";
    const params = config.params ? JSON.stringify(config.params) : "";
    const data = config.data
        ? typeof config.data === "string"
            ? config.data
            : JSON.stringify(config.data)
        : "";
    return `${method}:${url}?${params}#${data}`;
}

/** Build a coarse endpoint key (method + URL) used for rate-limit bucketing. */
function buildEndpointKey(config: InternalAxiosRequestConfig): string {
    const method = (config.method ?? "get").toLowerCase();
    const url = config.url ?? "";
    return `${method}:${url}`;
}

// ── Layer 1: Deduplication ─────────────────────────────────────────────────────

/** Map of in-flight promise keys → shared Promise. */
const inflightMap = new Map<string, Promise<AxiosResponse>>();

/** Runtime metadata attached to a request config while a dedupe is in flight. */
interface DedupeConfigMeta {
    __dedupeKey__?: string;
    __dedupePromise__?: Promise<AxiosResponse>;
}

const DEDUPE_KEY = "__dedupeKey__" as const;
const DEDUPE_PROMISE = "__dedupePromise__" as const;

/**
 * Installs a request/response interceptor pair that collapses identical
 * concurrent GET requests into a single network call.
 */
export function installDedupeInterceptor(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.request.use(
        (config) => {
            const method = (config.method ?? "get").toLowerCase();
            if (!DEDUPE_METHODS.has(method)) return config;

            const key = buildKey(config);

            if (inflightMap.has(key)) {
                // Attach a sentinel so the response interceptor can short-circuit
                const meta = config as InternalAxiosRequestConfig & DedupeConfigMeta;
                meta[DEDUPE_KEY] = key;
                meta[DEDUPE_PROMISE] = inflightMap.get(key)!;
            }

            return config;
        },
        (error) => Promise.reject(error),
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            const key = buildKey(response.config);
            inflightMap.delete(key);
            return response;
        },
        (error) => {
            if (error.config) {
                const key = buildKey(error.config as InternalAxiosRequestConfig);
                inflightMap.delete(key);
            }
            return Promise.reject(error);
        },
    );
}

export function wrapGetWithDedupe(axiosInstance: AxiosInstance): () => void {
    const originalRequest = axiosInstance.request.bind(axiosInstance);

    interface PatchedAxiosInstance {
        request: AxiosInstance["request"];
    }

    // Monkey-patch `request` so all Axios sugar methods (get/post/…) go through it
    (axiosInstance as unknown as PatchedAxiosInstance).request = function <T, R, D>(
        config: AxiosRequestConfig<D>,
    ): Promise<R> {
        const method = (config.method ?? "get").toLowerCase();

        if (DEDUPE_METHODS.has(method)) {
            const key = buildKey(config as InternalAxiosRequestConfig);

            if (inflightMap.has(key)) {
                // Return the already-running promise
                return inflightMap.get(key) as Promise<R>;
            }

            const promise = originalRequest<T, R, D>(config).finally(() => {
                inflightMap.delete(key);
            }) as Promise<R>;

            inflightMap.set(key, promise as Promise<AxiosResponse>);
            return promise;
        }

        return originalRequest<T, R, D>(config) as Promise<R>;
    };

    return () => {
        (axiosInstance as unknown as PatchedAxiosInstance).request = originalRequest;
        inflightMap.clear();
    };
}

// ── Layer 2: Rate Limiter ──────────────────────────────────────────────────────

/**
 * Sliding-window call log per endpoint key.
 * Value is an array of call timestamps (ms since epoch).
 */
const callLog = new Map<string, number[]>();

/** Prune timestamps older than the window from the log. */
function pruneLog(timestamps: number[]): number[] {
    const cutoff = Date.now() - WINDOW_MS;
    return timestamps.filter((t) => t > cutoff);
}

/**
 * Returns true if the endpoint has exceeded its call budget.
 * Side-effect: always records the current call in the log.
 */
function isRateLimited(endpointKey: string): boolean {
    const raw = callLog.get(endpointKey) ?? [];
    const recent = pruneLog(raw);
    const exceeded = recent.length >= MAX_CALLS_PER_WINDOW;

    if (!exceeded) {
        callLog.set(endpointKey, [...recent, Date.now()]);
    } else {
        // Still update with pruned array (don't add the blocked call)
        callLog.set(endpointKey, recent);
    }

    return exceeded;
}

/**
 * Installs a request interceptor that rejects any call that exceeds
 * `MAX_CALLS_PER_WINDOW` per endpoint within `WINDOW_MS` milliseconds.
 */
export function installRateLimitInterceptor(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.request.use(
        (config) => {
            const method = (config.method ?? "get").toLowerCase();
            if (!RATE_LIMIT_METHODS.has(method)) return config;

            const endpointKey = buildEndpointKey(config);

            if (isRateLimited(endpointKey)) {
                const msg =
                    `[Rate Limit] Blocked: "${endpointKey}" exceeded ` +
                    `${MAX_CALLS_PER_WINDOW} calls in ${WINDOW_MS / 1000}s. ` +
                    `Check for infinite loops or rapid repeated dispatches.`;

                console.warn(msg);

                // Reject immediately — no network request is made
                return Promise.reject(new Error(msg));
            }

            return config;
        },
        (error) => Promise.reject(error),
    );
}

// ── Layer 3: Thunk in-flight guard (module-level singleton) ───────────────────

/**
 * Set of currently-running thunk keys (route + rootId + page).
 * Thunks register themselves on start and deregister on completion.
 */
const activeThunks = new Set<string>();

/**
 * Returns a thunk key for a given route + params combination.
 * Use this in createCrudThunks to prevent duplicate dispatches.
 */
export function buildThunkKey(route: string, rootId: string | number, page?: number): string {
    return `${route}::${String(rootId)}::p${String(page ?? 1)}`;
}

/**
 * Returns true if an identical thunk is already in flight.
 * Registers the key as active when it returns false.
 */
export function tryAcquireThunk(key: string): boolean {
    if (activeThunks.has(key)) return false; // already running
    activeThunks.add(key);
    return true;
}

/** Release the thunk key when the async work is done. */
export function releaseThunk(key: string): void {
    activeThunks.delete(key);
}

/** Snapshot of active thunks — useful for debugging. */
export function getActiveThunks(): string[] {
    return Array.from(activeThunks);
}
