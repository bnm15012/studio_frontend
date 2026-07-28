/** Creates Redux async thunks for CRUD operations (fetch list, fetch one, create, update, delete) with caching, loading states, and error handling. */
import api from "@/core/utils/api";
import { getApiMessage, getHeader, isCacheValid, withLoading } from "@/core/api/helper";
import { CrudThunks, Entity, AppDispatch, RequestParams } from "@/core/types";
import { GenericState } from "@/core/state/stateTypes";
import { buildThunkKey, tryAcquireThunk, releaseThunk } from "@/core/api/apiGuard";

export interface CrudThunksOptions<T extends Entity> {
    actions: {
        setRecord: (record: T) => { type: string; payload: T };
        addItem: (item: T) => { type: string; payload: T };
        prependItem: (item: T) => { type: string; payload: T };
        updateItem: (item: Entity) => { type: string; payload: Entity };
        removeItem: (id: string | number) => { type: string; payload: string | number };
        appendItems: (payload: { data: T[]; rootId: unknown }) => {
            type: string;
            payload: { data: T[]; rootId: unknown };
        };
        setItems: (payload: { data: T[]; rootId: unknown }) => {
            type: string;
            payload: { data: T[]; rootId: unknown };
        };
        setInfo: (info: Entity) => { type: string; payload: Entity };
        clearData: () => { type: string };
    };
    idKey: string;
    route: string;
}

export function createCrudThunks<T extends Entity>({ actions, route }: CrudThunksOptions<T>) {
    const add =
        (
            newData: Partial<T> | Entity,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            prepend?: boolean,
        ) =>
        async (dispatch: AppDispatch, getState: unknown) => {
            await withLoading(setLoading, async () => {
                try {
                    const state = (getState as () => Entity)()[route] as unknown as GenericState<T>;
                    const {
                        data: { data },
                    } = await api.post(`/${route}/add`, newData, getHeader(token));

                    if (state.recordById[0]) {
                        dispatch(actions.setRecord((data as T[])[0]));
                    }
                    dispatch(
                        prepend
                            ? actions.prependItem((data as T[])[0])
                            : actions.addItem((data as T[])[0]),
                    );
                } catch (err: unknown) {
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
            updatedData: Partial<T> | Entity,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
        async (dispatch: AppDispatch, getState: unknown) => {
            await withLoading(setLoading, async () => {
                try {
                    const state = (getState as () => Entity)()[route] as unknown as GenericState<T>;
                    const { data } = await api.put(
                        `/${route}/update/${id}`,
                        updatedData,
                        getHeader(token),
                    );
                    const record = (data.data as T[])[0];
                    if ((state.recordById as unknown as Entity)[id]) {
                        dispatch(actions.setRecord(record));
                    }
                    dispatch(actions.updateItem(record as unknown as Entity));
                } catch (err: unknown) {
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
                } catch (err: unknown) {
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
        async (dispatch: AppDispatch, getState: unknown) => {
            const state = (getState as () => Entity)()[route] as GenericState<T>;

            if (rootId === 0) return;
            if (!_force && isCacheValid(state, rootId, params)) return;
            if (!_force && !params.page && (state.items as unknown[]).length) return;

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

                        const action =
                            infinite && params.searchTerm === state.searchTerm
                                ? actions.appendItems({ data: data as T[], rootId })
                                : actions.setItems({ data: data as T[], rootId });

                        dispatch(action);
                        dispatch(
                            actions.setInfo({
                                currentPage: params.page,
                                pageSize: params.size,
                                searchTerm: params.searchTerm,
                                filterKeys: params,
                                totalCount: (status as Entity).totalCount,
                            }),
                        );
                    } catch (err: unknown) {
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
        async (dispatch: AppDispatch, getState: unknown) => {
            const state = (getState as () => Entity)()[route] as GenericState<T> | undefined;
            if (!state) return;

            if (id === 0) return;
            const cached = state.recordById[id];
            if (cached && !forceRefresh) return cached;

            return withLoading(setLoading, async () => {
                try {
                    const {
                        data: { data },
                    } = await api.get(`/${route}/get/${id}`, getHeader(token));
                    const record = (data as T[])[0];
                    dispatch(actions.setRecord(record));
                    return record;
                } catch (err: unknown) {
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
        async (dispatch: AppDispatch, getState: unknown) => {
            const state = (getState as () => Entity)()[route] as unknown as GenericState<T>;

            const rootId = state.rootId as string | number | null | undefined;
            const pageSize = (state.pageSize as number) || 10;
            const searchTerm = (state.searchTerm as string) || "";
            const filterKeys = (state.filterKeys as Entity) || {};

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
    } as unknown as CrudThunks<T>;
}
