/** Creates Redux async thunks for CRUD operations (fetch list, fetch one, create, update, delete) with caching, loading states, and error handling. */
import api from "@/core/utils/api";
import { getApiMessage, getHeader, isCacheValid, withLoading } from "@/core/api/helper";
import { CrudThunks, AppDispatch, RequestParams } from "@/core/types";
import { FilterKeys, GenericState, getSliceState } from "@/core/state/stateTypes";
import type { CrudRecord } from "@/api/types";
import { buildThunkKey, tryAcquireThunk, releaseThunk } from "@/core/api/apiGuard";
import { RootState } from "@/state";

type GetState = () => RootState;

/** Shape of the paginated `status` block returned alongside list payloads. */
export interface ListStatus {
    totalCount: number;
    statusMessage: string;
}

export interface CrudThunksOptions<T extends CrudRecord> {
    actions: {
        setRecord: (record: T) => { type: string; payload: T };
        addItem: (item: T) => { type: string; payload: T };
        prependItem: (item: T) => { type: string; payload: T };
        updateItem: (item: T | { predicate: (item: T) => boolean; data: Partial<T> }) => {
            type: string;
            payload: T | { predicate: (item: T) => boolean; data: Partial<T> };
        };
        removeItem: (id: string | number) => { type: string; payload: string | number };
        appendItems: (payload: { data: T[]; rootId: string | number }) => {
            type: string;
            payload: { data: T[]; rootId: string | number };
        };
        setItems: (payload: { data: T[]; rootId: string | number }) => {
            type: string;
            payload: { data: T[]; rootId: string | number };
        };
        setInfo: (info: {
            totalCount: number;
            currentPage: number;
            searchTerm?: string;
            filterKeys?: FilterKeys;
            pageSize: number;
        }) => {
            type: string;
            payload: {
                totalCount: number;
                currentPage: number;
                searchTerm?: string;
                filterKeys?: FilterKeys;
                pageSize: number;
            };
        };
        clearData: () => { type: string };
    };
    idKey: string;
    route: string;
}

export function createCrudThunks<T extends CrudRecord>({ actions, route }: CrudThunksOptions<T>) {
    const getSlice = (getState: GetState) => getSliceState<T>(getState(), route);
    const add =
        (
            newData: Partial<T>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            prepend?: boolean,
        ) =>
        async (dispatch: AppDispatch, getState: GetState) => {
            await withLoading(setLoading, async () => {
                try {
                    const state = getSlice(getState) ?? ({} as GenericState<T>);
                    const {
                        data: { data },
                    } = await api.post(`/${route}/add`, newData, getHeader(token));

                    const record = (data as T[])[0]!;
                    if (state.recordById[0]) {
                        dispatch(actions.setRecord(record));
                    }
                    dispatch(prepend ? actions.prependItem(record) : actions.addItem(record));
                } catch (err) {
                    console.error(err);
                    showAlert(
                        getApiMessage(
                            err as Parameters<typeof getApiMessage>[0],
                            `Failed to add ${route}`,
                        ),
                        "error",
                    );
                }
            });
        };

    const update =
        (
            id: string | number,
            updatedData: Partial<T>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
        async (dispatch: AppDispatch, getState: GetState) => {
            await withLoading(setLoading, async () => {
                try {
                    const state = getSlice(getState) ?? ({} as GenericState<T>);
                    const { data } = await api.put(
                        `/${route}/update/${id}`,
                        updatedData,
                        getHeader(token),
                    );
                    const record = (data.data as T[])[0]!;
                    if (state.recordById[id]) {
                        dispatch(actions.setRecord(record));
                    }
                    dispatch(actions.updateItem(record));
                } catch (err) {
                    console.error(err);
                    showAlert(
                        getApiMessage(
                            err as Parameters<typeof getApiMessage>[0],
                            `Failed to update ${route}`,
                        ),
                        "error",
                    );
                }
            });
        };

    const remove =
        (
            id: string | number,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
        async (dispatch: AppDispatch) => {
            await withLoading(setLoading, async () => {
                try {
                    await api.delete(`/${route}/delete/${id}`, getHeader(token));
                    dispatch(actions.removeItem(id));
                } catch (err) {
                    console.error(err);
                    showAlert(
                        getApiMessage(
                            err as Parameters<typeof getApiMessage>[0],
                            `Failed to delete ${route}`,
                        ),
                        "error",
                    );
                }
            });
        };

    const getAll =
        (
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            token: string | null | undefined,
            params: RequestParams,
            rootId: string | number,
            infinite?: boolean,
            /** Internal flag — used by `refresh` to bypass cache checks. Not part of the public CrudThunks interface. */
            _force?: boolean,
        ) =>
        async (dispatch: AppDispatch, getState: GetState) => {
            const state = getSlice(getState) ?? ({} as GenericState<T>);

            if (rootId === 0) return;
            if (!_force && isCacheValid(state, rootId, params)) return;
            if (!_force && !params.page && state.items.length) return;

            // ── Thunk in-flight guard ──────────────────────────────────────────
            // Prevents identical concurrent dispatches (e.g. two components both
            // calling getAll for the same route/page before the first resolves).
            const thunkKey = buildThunkKey(route, rootId, params.page);
            if (!tryAcquireThunk(thunkKey)) {
                // An identical fetch is already in flight — skip silently.
                return;
            }

            try {
                await withLoading(setLoading, async () => {
                    try {
                        const {
                            data: { data, status },
                        } = await api.get(`/${route}/getAll/${rootId}`, {
                            ...getHeader(token),
                            params,
                        });
                        const statusBlock = status as ListStatus;

                        const action =
                            infinite && params.searchTerm === state.searchTerm
                                ? actions.appendItems({ data: data as T[], rootId })
                                : actions.setItems({ data: data as T[], rootId });

                        dispatch(action);
                        dispatch(
                            actions.setInfo({
                                currentPage: params.page ?? 1,
                                pageSize: params.size ?? 10,
                                searchTerm: params.searchTerm,
                                filterKeys: params as FilterKeys,
                                totalCount: statusBlock.totalCount,
                            }),
                        );
                    } catch (err) {
                        console.error(err);
                        showAlert(
                            getApiMessage(
                                err as Parameters<typeof getApiMessage>[0],
                                `Failed to fetch ${route}`,
                            ),
                            "error",
                        );
                    }
                });
            } finally {
                // Always release the guard so future calls can proceed.
                releaseThunk(thunkKey);
            }
        };

    const getById =
        (
            id: string | number,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            { forceRefresh = false }: { forceRefresh?: boolean } = {},
        ) =>
        async (dispatch: AppDispatch, getState: GetState) => {
            const state = getSlice(getState);
            if (!state) return;

            if (id === 0) return;
            const cached = state.recordById[id];
            if (cached && !forceRefresh) return cached;

            return withLoading(setLoading, async () => {
                try {
                    const {
                        data: { data },
                    } = await api.get(`/${route}/get/${id}`, getHeader(token));
                    const record = (data as T[])[0]!;
                    dispatch(actions.setRecord(record));
                    return record;
                } catch (err) {
                    console.error(err);
                    showAlert(
                        getApiMessage(
                            err as Parameters<typeof getApiMessage>[0],
                            `Failed to fetch ${route} by ID`,
                        ),
                        "error",
                    );
                    return null;
                }
            });
        };

    const refresh =
        (
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            token: string | null | undefined,
            infinite = false,
        ) =>
        async (dispatch: AppDispatch, getState: GetState) => {
            const state = getSlice(getState) ?? ({} as GenericState<T>);

            const rootId = state.rootId;
            const pageSize = state.pageSize || 10;
            const searchTerm = state.searchTerm || "";
            const filterKeys = state.filterKeys || {};

            if (rootId === null || rootId === undefined || rootId === 0) {
                console.warn(`[refresh] Skipped for route "${route}" — rootId is not set.`);
                return;
            }

            const refreshKey = `refresh::${route}::${String(rootId)}`;
            if (!tryAcquireThunk(refreshKey)) {
                return;
            }

            try {
                await dispatch(
                    getAll(
                        showAlert,
                        setLoading,
                        token,
                        {
                            page: 1,
                            size: pageSize,
                            searchTerm,
                            ...filterKeys,
                        },
                        rootId,
                        infinite,
                        true, // _force: bypass cache checks
                    ),
                );
            } finally {
                releaseThunk(refreshKey);
            }
        };

    return {
        add,
        update,
        remove,
        getAll,
        getById,
        refresh,
    } as CrudThunks<T>;
}
