// ── Thunks ─────────────────────────────────────────────────────────────

import api from "../utils/api";
import { getApiMessage, getHeader, isCacheValid, withLoading } from "./helper";
import { CrudThunks } from "../types";

export interface CrudThunksOptions {
    actions: {
        setRecord: (record: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        addItem: (item: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        prependItem: (item: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        updateItem: (item: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        removeItem: (id: string | number) => { type: string; payload: string | number };
        appendItems: (payload: { data: Record<string, unknown>[]; rootId: unknown }) => { type: string; payload: { data: Record<string, unknown>[]; rootId: unknown } };
        setItems: (payload: { data: Record<string, unknown>[]; rootId: unknown }) => { type: string; payload: { data: Record<string, unknown>[]; rootId: unknown } };
        setInfo: (info: Record<string, unknown>) => { type: string; payload: Record<string, unknown> };
        clearData: () => { type: string };
        [key: string]: unknown;
    };
    idKey: string;
    route: string;
}

export const createCrudThunks = ({ actions, idKey, route }: CrudThunksOptions) => {
    const add =
        (
            newData: Record<string, unknown>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            prepend?: boolean,
        ) =>
            async (dispatch: unknown, getState: unknown) => {
                await withLoading(setLoading, async () => {
                    try {
                        const state = (getState as () => Record<string, unknown>)()[route] as Record<string, unknown>;
                        const {
                            data: { data },
                        } = await api.post(`/${route}/add`, newData, getHeader(token));

                        if ((state.recordById as Record<string, unknown>)["NEW"]) {
                            dispatch(actions.setRecord(data[0]));
                        }
                        dispatch(prepend ? actions.prependItem((data as Record<string, unknown>[])[0]) : actions.addItem((data as Record<string, unknown>[])[0]));
                    } catch (err: any) {
                        console.error(err);
                        showAlert(getApiMessage(err, `Failed to add ${route}`), "error");
                    }
                });
            };

    /**
     * PUT /{route}/update/{id}
     * Updates an existing record and refreshes both the list item and the
     * recordById cache if it exists.
     */
    const update =
        (
            id: string | number,
            updatedData: Record<string, unknown>,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
            async (dispatch: unknown, getState: unknown) => {
                await withLoading(setLoading, async () => {
                    try {
                        const state = (getState as () => Record<string, unknown>)()[route] as Record<string, unknown>;
                        const { data } = await api.put(
                            `/${route}/update/${id}`,
                            updatedData,
                            getHeader(token),
                        );
                        const record = (data.data as Record<string, unknown>[])[0];
                        if ((state.recordById as Record<string, unknown>)[id]) {
                            dispatch(actions.setRecord(record));
                        }
                        dispatch(actions.updateItem(record));
                    } catch (err: any) {
                        console.error(err);
                        showAlert(getApiMessage(err, `Failed to update ${route}`), "error");
                    }
                });
            };

    /**
     * DELETE /{route}/delete/{id}
     */
    const remove =
        (
            id: string | number,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
            async (dispatch: unknown) => {
                await withLoading(setLoading, async () => {
                    try {
                        await api.delete(`/${route}/delete/${id}`, getHeader(token));
                        dispatch(actions.removeItem(id));
                    } catch (err: any) {
                        console.error(err);
                        showAlert(getApiMessage(err, `Failed to delete ${route}`), "error");
                    }
                });
            };

    /**
     * GET /{route}/getAll/{rootId}
     * Skips the request when the slice cache is already valid for the given
     * page/searchTerm/filterKeys combination.
     */
    const getAll =
        (
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            token: string | null | undefined,
            params: Record<string, unknown>,
            rootId: string | number,
            infinite?: boolean,
        ) =>
            async (dispatch: unknown, getState: unknown) => {
                const state = (getState as () => Record<string, unknown>)()[route] as Record<string, unknown>;

                if (rootId === "NEW") return;
                if (isCacheValid(state as Parameters<typeof isCacheValid>[0], rootId, params)) return;
                if (!params?.page && state.items.length) return;

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
                                ? actions.appendItems({ data: data as Record<string, unknown>[], rootId })
                                : actions.setItems({ data: data as Record<string, unknown>[], rootId });

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
                    } catch (err: any) {
                        console.error(err);
                        showAlert(getApiMessage(err, `Failed to fetch ${route}`), "error");
                    }
                });
            };

    /**
     * GET /{route}/get/{id}
     * Returns the cached record when available (unless `forceRefresh` is true).
     */
    const getById =
        (
            id: string | number,
            token: string | null | undefined,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            { forceRefresh = false }: { forceRefresh?: boolean } = {},
        ) =>
            async (dispatch: unknown, getState: unknown) => {
                if (id === "NEW") return;

                const cached = (((getState as () => Record<string, unknown>)()[route] as Record<string, unknown>).recordById as Record<string, unknown>)[id];
                if (cached && !forceRefresh) return cached;

                return withLoading(setLoading, async () => {
                    try {
                        const {
                            data: { data },
                        } = await api.get(`/${route}/get/${id}`, getHeader(token));
                        const record = (data as Record<string, unknown>[])[0];
                        dispatch(actions.setRecord(record));
                        return record;
                    } catch (err: any) {
                        console.error(err);
                        showAlert(getApiMessage(err, `Failed to fetch ${route} by ID`), "error");
                        return null;
                    }
                });
            };

    /**
     * Clears the slice and re-fetches the current page with the same filters.
     */
    const refresh =
        (
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
            token: string | null | undefined,
            infinite = false,
        ) =>
            async (dispatch: unknown, getState: unknown) => {
                const state = (getState as () => Record<string, unknown>)()[route] as Record<string, unknown>;
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
    };
};
