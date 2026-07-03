import api from "../utils/api";
import { getApiMessage, getHeader, isCacheValid, withLoading } from "./helper";
import { CrudThunks, Entity, AppDispatch } from "../types";
import { GenericState } from "@/core/state/stateTypes";

export interface CrudThunksOptions<T extends Entity = Entity> {
    actions: {
        setRecord: (record: T) => { type: string; payload: T };
        addItem: (item: T) => { type: string; payload: T };
        prependItem: (item: T) => { type: string; payload: T };
        updateItem: (item: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        removeItem: (id: string | number) => { type: string; payload: string | number };
        appendItems: (payload: { data: T[]; rootId: unknown }) => { type: string; payload: { data: T[]; rootId: unknown } };
        setItems: (payload: { data: T[]; rootId: unknown }) => { type: string; payload: { data: T[]; rootId: unknown } };
        setInfo: (info: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        clearData: () => { type: string };
        [key: string]: unknown;
    };
    idKey: string;
    route: string;
}

export function createCrudThunks<T extends Entity = Entity>({ actions, idKey, route }: CrudThunksOptions<T>) {
    const add =
        (
            newData: Partial<T> | Record<string, unknown>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            prepend?: boolean,
        ) =>
            async (dispatch: AppDispatch, getState: unknown) => {
                await withLoading(setLoading, async () => {
                    try {
                        const state = (getState as () => Record<string, unknown>)()[route] as unknown as GenericState<T>;
                        const {
                            data: { data },
                        } = await api.post(`/${route}/add`, newData, getHeader(token));

                        if ((state.recordById as Record<string, unknown>)["NEW"]) {
                            dispatch(actions.setRecord((data as T[])[0]));
                        }
                        dispatch(prepend ? actions.prependItem((data as T[])[0]) : actions.addItem((data as T[])[0]));
                    } catch (err: unknown) {
                        console.error(err);
                        showAlert(getApiMessage(err as Parameters<typeof getApiMessage>[0], `Failed to add ${route}`), "error");
                    }
                });
            };

    const update =
        (
            id: string | number,
            updatedData: Partial<T> | Record<string, unknown>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
            async (dispatch: AppDispatch, getState: unknown) => {
                await withLoading(setLoading, async () => {
                    try {
                        const state = (getState as () => Record<string, unknown>)()[route] as unknown as GenericState<T>;
                        const { data } = await api.put(
                            `/${route}/update/${id}`,
                            updatedData,
                            getHeader(token),
                        );
                        const record = (data.data as T[])[0];
                        if ((state.recordById as unknown as Record<string, unknown>)[id]) {
                            dispatch(actions.setRecord(record));
                        }
                        dispatch(actions.updateItem(record as unknown as Record<string, unknown>));
                    } catch (err: unknown) {
                        console.error(err);
                        showAlert(getApiMessage(err as Parameters<typeof getApiMessage>[0], `Failed to update ${route}`), "error");
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
                        showAlert(getApiMessage(err as Parameters<typeof getApiMessage>[0], `Failed to delete ${route}`), "error");
                    }
                });
            };

    const getAll =
        (
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            token: string | null | undefined,
            params: Record<string, unknown>,
            rootId: string | number,
            infinite?: boolean,
        ) =>
            async (dispatch: AppDispatch, getState: unknown) => {
                const state = (getState as () => Record<string, unknown>)()[route] as unknown as GenericState<T>;

                if (rootId === "NEW") return;
                if (isCacheValid(state as Parameters<typeof isCacheValid>[0], rootId, params)) return;
                if (!params?.page && (state.items as unknown[]).length) return;

                await withLoading(setLoading, async () => {
                    try {
                        const {
                            data: { data, status },
                        } = await api.get(`/${route}/getAll/${rootId}`, {
                            ...getHeader(token),
                            params,
                        });

                        const action =
                            infinite && params?.searchTerm === state.searchTerm
                                ? actions.appendItems({ data: data as T[], rootId })
                                : actions.setItems({ data: data as T[], rootId });

                        dispatch(action);
                        dispatch(
                            actions.setInfo({
                                currentPage: params?.page,
                                pageSize: params?.size,
                                searchTerm: params?.searchTerm,
                                filterKeys: params,
                                totalCount: (status as Record<string, unknown>).totalCount,
                            }),
                        );
                    } catch (err: unknown) {
                        console.error(err);
                        showAlert(getApiMessage(err as Parameters<typeof getApiMessage>[0], `Failed to fetch ${route}`), "error");
                    }
                });
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
                if (id === "NEW") return;

                const cached = ((getState as () => Record<string, unknown>)()[route] as unknown as GenericState<T>).recordById[id];
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
                        showAlert(getApiMessage(err as Parameters<typeof getApiMessage>[0], `Failed to fetch ${route} by ID`), "error");
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
                const state = (getState as () => Record<string, unknown>)()[route] as unknown as GenericState<T>;
                dispatch(actions.clearData());
                return dispatch(
                    getAll(
                        showAlert,
                        setLoading,
                        token,
                        {
                            page: 1,
                            size: state.pageSize as number,
                            searchTerm: state.searchTerm as string,
                            ...(state.filterKeys as Record<string, unknown>),
                        },
                        state.rootId as string | number,
                        infinite,
                    ),
                );
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
