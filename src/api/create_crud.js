import { createGenericSlice } from "../state/createGenericSlice";
import api from "../utils/api";

/** Build the Authorization header object. */
const getHeader = (token) => ({ headers: { Authorization: token } });

/**
 * Extract a human-readable error message from an Axios error response,
 * falling back to `fallback` when the server provides no message.
 */
const getApiMessage = (err, fallback) => err?.response?.data?.status?.statusMessage ?? fallback;

/**
 * Wrap an async `fn` with setLoading(true) / setLoading(false) lifecycle.
 * Always calls setLoading(false) even if `fn` throws.
 */
const withLoading = async (setLoading, fn) => {
    setLoading(true);
    try {
        return await fn();
    } finally {
        setLoading(false);
    }
};

/**
 * Returns true when the slice state already contains the data being requested,
 * meaning the thunk can safely skip a network call.
 */
const isCacheValid = (state, rootId, params) =>
    state.rootId === rootId &&
    state.currentPage === params?.page &&
    params?.searchTerm === state.searchTerm &&
    JSON.stringify(params) === JSON.stringify(state.filterKeys);

// ── Factory ────────────────────────────────────────────────────────────────

/**
 * Creates a complete CRUD slice + thunk set for a given API route.
 *
 * @param {object} opts
 * @param {string}   opts.route         - API route segment (e.g. "students")
 * @param {string}   [opts.idKey="id"]  - Primary key field name
 * @param {Function} [opts.extraCruds]  - Factory for extra thunks, receives { actions, getHeader, route }
 * @param {object}   [opts.extraState]  - Extra initial state merged into the slice
 * @param {object}   [opts.extraReducers] - Extra reducers merged into the slice
 */
export function createCrud({
    route,
    idKey = "id",
    extraCruds = () => ({}),
    extraState = {},
    extraReducers = {},
}) {
    const { actions, getInitialState, reducer } = createGenericSlice({
        name: route,
        idKey,
        extraState,
        extraReducers,
    });

    // ── Thunks ─────────────────────────────────────────────────────────────

    /**
     * POST /{route}/add
     * Adds a new record. Dispatches `prependItem` when `prepend` is true.
     */
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
    const del = (id, token, showAlert, setLoading) => async (dispatch) => {
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

    // ── Assembly ───────────────────────────────────────────────────────────
    const baseCrud = {
        actions,
        initialState: getInitialState(),
        reducer,
        removeAll: actions.clearData,
        add,
        update,
        delete: del,
        getAll,
        getById,
        refresh,
    };

    return {
        ...baseCrud,
        ...extraCruds({ actions, getHeader, route }),
    };
}
