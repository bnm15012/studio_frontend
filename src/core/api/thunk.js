// ── Thunks ─────────────────────────────────────────────────────────────

import api from "../../core/util/api";
import { getApiMessage, getHeader, isCacheValid, withLoading } from "./helper";

/**
 * POST /{route}/add
 * Adds a new record. Dispatches `prependItem` when `prepend` is true.
 */

export const createCrudThunks = ({ actions, idKey, route }) => {
    const add = (newData, token, showAlert, setLoading, prepend) => async (dispatch, getState) => {
        await withLoading(setLoading, async () => {
            try {
                const state = getState()[route];
                const {
                    data: { data },
                } = await api.post(`/${route}/add`, newData, getHeader(token));

                if (state.recordById["NEW"]) {
                    dispatch(actions.setRecord(data[0]));
                }
                dispatch(prepend ? actions.prependItem(data[0]) : actions.addItem(data[0]));
            } catch (err) {
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
        (id, updatedData, token, showAlert, setLoading) => async (dispatch, getState) => {
            await withLoading(setLoading, async () => {
                try {
                    const state = getState()[route];
                    const { data } = await api.put(
                        `/${route}/update/${id}`,
                        updatedData,
                        getHeader(token),
                    );
                    const record = data.data[0];
                    if (state.recordById[id]) {
                        dispatch(actions.setRecord(record));
                    }
                    dispatch(actions.updateItem(record));
                } catch (err) {
                    console.error(err);
                    showAlert(getApiMessage(err, `Failed to update ${route}`), "error");
                }
            });
        };

    /**
     * DELETE /{route}/delete/{id}
     */
    const remove = (id, token, showAlert, setLoading) => async (dispatch) => {
        await withLoading(setLoading, async () => {
            try {
                await api.delete(`/${route}/delete/${id}`, getHeader(token));
                dispatch(actions.removeItem(id));
            } catch (err) {
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
        (showAlert, setLoading, token, params, rootId, infinite) => async (dispatch, getState) => {
            const state = getState()[route];

            if (rootId === "NEW") return;
            if (isCacheValid(state, rootId, params)) return;
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
                            ? actions.appendItems({ data, rootId })
                            : actions.setItems({ data, rootId });

                    dispatch(action);
                    dispatch(
                        actions.setInfo({
                            currentPage: params?.page,
                            pageSize: params?.size,
                            searchTerm: params?.searchTerm,
                            filterKeys: params,
                            totalCount: status.totalCount,
                        }),
                    );
                } catch (err) {
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
        (id, token, showAlert, setLoading, { forceRefresh = false } = {}) =>
            async (dispatch, getState) => {
                if (id === "NEW") return;

                const cached = getState()[route].recordById[id];
                if (cached && !forceRefresh) return cached;

                return withLoading(setLoading, async () => {
                    try {
                        const {
                            data: { data },
                        } = await api.get(`/${route}/get/${id}`, getHeader(token));
                        const record = data[0];
                        dispatch(actions.setRecord(record));
                        return record;
                    } catch (err) {
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
        (showAlert, setLoading, token, infinite = false) =>
            async (dispatch, getState) => {
                const state = getState()[route];
                dispatch(actions.clearData());
                return dispatch(
                    getAll(
                        showAlert,
                        setLoading,
                        token,
                        {
                            page: 1,
                            size: state.pageSize,
                            searchTerm: state.searchTerm,
                            ...state.filterKeys,
                        },
                        state.rootId,
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
