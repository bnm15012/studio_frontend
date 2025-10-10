import { createGenericSlice } from "../state/createGenericSlice";
import api from "../utils/api";

export function createCrud({ route, idKey = "id", extra = {}, extraReducers }) {
    const getHeader = (token) => ({ headers: { Authorization: token } });

    const { actions, getInitialState, reducer } = createGenericSlice({
        name: route,
        idKey,
        extraReducers,
    });

    const baseCrud = {
        initialState: getInitialState(),
        reducer,
        removeAll: actions.clearData,

        add: (newData, token, showAlert, setLoading, prepend) => async (dispatch) => {
            try {
                setLoading(true);
                const {
                    data: { data },
                } = await api.post(`/${route}/add`, newData, getHeader(token));
                if (prepend) {
                    dispatch(actions.prependItem(data[0]));
                } else {
                    dispatch(actions.addItem(data[0]));
                }
            } catch (err) {
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to add ${route}`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },

        update: (id, updatedData, token, showAlert, setLoading) => async (dispatch) => {
            try {
                setLoading(true);
                const { data } = await api.put(
                    `/${route}/update/${id}`,
                    updatedData,
                    getHeader(token),
                );
                dispatch(actions.updateItem(data.data[0]));
            } catch (err) {
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
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to delete ${route}`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },

        getAll:
            (stateName, showAlert, setLoading, token, params, rootId, infinite) =>
            async (dispatch, getState) => {
                try {
                    const state = getState()[stateName];
                    if (
                        state.currentPage === params?.page &&
                        params?.searchTerm === state.searchTerm
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

                    if (infinite) {
                        dispatch(actions.appendItems(data));
                    } else {
                        dispatch(actions.setItems(data));
                    }

                    dispatch(
                        actions.setInfo({
                            currentPage: params?.page,
                            pageSize: params?.size,
                            searchTerm: params?.searchTerm,
                            totalCount: status.totalCount,
                        }),
                    );
                } catch (err) {
                    showAlert(
                        err?.response?.data?.status?.statusMessage || `Failed to fetch ${route}`,
                        "error",
                    );
                } finally {
                    setLoading(false);
                }
            },
    };

    return { ...baseCrud, ...extra };
}
