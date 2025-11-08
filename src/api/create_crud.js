import { createGenericSlice } from "../state/createGenericSlice";
import api from "../utils/api";

export function createCrud({
    route,
    idKey = "id",
    extraCruds = {},
    extraState = {},
    extraReducers = {},
}) {
    const getHeader = (token) => ({ headers: { Authorization: token } });

    const { actions, getInitialState, reducer } = createGenericSlice({
        name: route,
        idKey,
        extraState,
        extraReducers,
    });

    const baseCrud = {
        actions: actions,
        initialState: getInitialState(),
        reducer,
        removeAll: actions.clearData,

        add: (newData, token, showAlert, setLoading, prepend) => async (dispatch, getState) => {
            try {
                setLoading(true);
                const state = getState()[route];
                const {
                    data: { data },
                } = await api.post(`/${route}/add`, newData, getHeader(token));

                if (state.recordById["NEW"]) {
                    dispatch(actions.setRecord(data[0]));
                }

                if (prepend) {
                    dispatch(actions.prependItem(data[0]));
                } else {
                    dispatch(actions.addItem(data[0]));
                }
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to add ${route}`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },

        update: (id, updatedData, token, showAlert, setLoading) => async (dispatch, getState) => {
            try {
                setLoading(true);
                const state = getState()[route];
                const { data } = await api.put(
                    `/${route}/update/${id}`,
                    updatedData,
                    getHeader(token),
                );
                if (state.recordById[id]) {
                    dispatch(actions.setRecord(data.data[0]));
                }
                dispatch(actions.updateItem(data.data[0]));
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to update ${route}`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },

        delete: (id, token, showAlert, setLoading) => async (dispatch) => {
            try {
                setLoading(true);
                await api.delete(`/${route}/delete/${id}`, getHeader(token));
                dispatch(actions.removeItem(id));
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to delete ${route}`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },

        getAll:
            (showAlert, setLoading, token, params, rootId, infinite) =>
            async (dispatch, getState) => {
                try {
                    const state = getState()[route];
                    if (rootId === "NEW") return;
                    if (
                        state.rootId === rootId &&
                        state.currentPage === params?.page &&
                        params?.searchTerm === state.searchTerm &&
                        JSON.stringify(params) === JSON.stringify(state.filterKeys)
                    )
                        return;
                    if (!params?.page && state.items.length) return;
                    setLoading(true);

                    const {
                        data: { data, status },
                    } = await api.get(`/${route}/getAll/${rootId}`, {
                        ...getHeader(token),
                        params,
                    });

                    if (infinite && params?.searchTerm === state.searchTerm) {
                        dispatch(actions.appendItems({ data, rootId }));
                    } else {
                        dispatch(actions.setItems({ data, rootId }));
                    }

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
                    showAlert(
                        err?.response?.data?.status?.statusMessage || `Failed to fetch ${route}`,
                        "error",
                    );
                } finally {
                    setLoading(false);
                }
            },

        getById:
            (id, token, showAlert, setLoading, { forceRefresh = false } = {}) =>
            async (dispatch, getState) => {
                try {
                    if (id === "NEW") return;

                    const state = getState()[route];
                    const cached = state.recordById[id];

                    if (cached && !forceRefresh) {
                        return cached;
                    }

                    setLoading(true);
                    const {
                        data: { data },
                    } = await api.get(`/${route}/get/${id}`, getHeader(token));

                    const record = data[0];
                    dispatch(actions.setRecord(record));
                    return record;
                } catch (err) {
                    console.error(err);
                    showAlert(
                        err?.response?.data?.status?.statusMessage ||
                            `Failed to fetch ${route} by ID`,
                        "error",
                    );
                    return null;
                } finally {
                    setLoading(false);
                }
            },
    };

    return { ...baseCrud, ...extraCruds };
}
