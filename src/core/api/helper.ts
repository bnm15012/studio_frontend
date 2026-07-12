/** Utility functions: getHeader (auth header builder), getApiMessage (error extraction), withLoading (loading wrapper), isCacheValid (cache TTL checker). */
export const getHeader = (token: string | null | undefined) => ({
    headers: { Authorization: token ?? "" },
});

/**
 * Extract a human-readable error message from an Axios error response,
 * falling back to `fallback` when the server provides no message.
 */
export const getApiMessage = (
    err: { response?: { data?: { status?: { statusMessage?: string } } } },
    fallback: string,
): string => err?.response?.data?.status?.statusMessage ?? fallback;

/**
 * Wrap an async `fn` with setLoading(true) / setLoading(false) lifecycle.
 * Always calls setLoading(false) even if `fn` throws.
 */
export const withLoading = async <T>(
    setLoading: (loading: boolean) => void,
    fn: () => Promise<T>,
): Promise<T> => {
    setLoading(true);
    try {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        return await fn();
    } finally {
        setLoading(false);
    }
};

interface CacheState {
    rootId: unknown;
    currentPage: unknown;
    searchTerm: unknown;
    filterKeys: Record<string, unknown>;
}

interface CacheParams {
    page?: unknown;
    searchTerm?: string;
    [key: string]: unknown;
}

/**
 * Returns true when the slice state already contains the data being requested,
 * meaning the thunk can safely skip a network call.
 */
export const isCacheValid = (state: CacheState, rootId: unknown, params: CacheParams): boolean =>
    state.rootId === rootId &&
    state.currentPage === params?.page &&
    params?.searchTerm === state.searchTerm &&
    JSON.stringify(params) === JSON.stringify(state.filterKeys);
