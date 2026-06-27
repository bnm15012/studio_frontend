import { createSlice } from "@reduxjs/toolkit";

/**
 * Creates a generic Redux slice with standard CRUD reducers for list views.
 *
 * @param {object}  options
 * @param {string}  options.name          - Slice name (matches the Redux state key)
 * @param {string}  [options.idKey="id"]  - Field used as the primary key
 * @param {object}  [options.extraState]  - Additional fields merged into initialState
 * @param {object}  [options.extraReducers] - Additional reducers merged into the slice
 *
 * @returns {{ actions, reducer, name, getInitialState }}
 */
export function createGenericSlice({ name, idKey = "id", extraState = {}, extraReducers = {} }) {
    const initialState = {
        rootId: 0,
        items: [],
        recordById: {},
        searchTerm: "",
        filterKeys: {},
        totalCount: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0,
        ...extraState,
    };

    const slice = createSlice({
        name,
        initialState,
        reducers: {
            /** Replace the full item list and update rootId. */
            setItems(state, { payload: { data, rootId } }) {
                state.rootId = rootId;
                state.items = data;
            },

            /** Update pagination / search metadata without replacing items. */
            setInfo(state, { payload }) {
                state.totalCount = payload.totalCount;
                state.currentPage = payload.currentPage;
                state.searchTerm = payload.searchTerm ?? "";
                state.filterKeys = payload.filterKeys ?? {};
                state.pageSize = payload.pageSize;
                state.totalPages = Math.ceil(payload.totalCount / (payload.pageSize ?? 1));
            },

            /** Append a single item to the end of the list. */
            addItem(state, { payload }) {
                state.items.push(payload);
            },

            /** Insert a single item at the beginning of the list. */
            prependItem(state, { payload }) {
                state.items = [payload, ...state.items];
            },

            /**
             * Append multiple items for infinite scroll.
             * Resets the list first when rootId changes.
             * De-duplicates by idKey before inserting.
             */
            appendItems(state, { payload: { data, rootId } }) {
                if (state.rootId !== rootId) {
                    state.rootId = rootId;
                    state.items = [];
                }
                const existingIds = new Set(state.items.map((item) => item[idKey]));
                const newItems = data.filter((item) => !existingIds.has(item[idKey]));
                state.items.push(...newItems);
            },

            /**
             * Update one or many items in the list.
             *
             * Accepts two forms:
             *   - `{ predicate: (item) => bool, data: partialItem }` — update all matching items
             *   - `updatedItem` — match by idKey and merge
             */
            updateItem(state, { payload }) {
                if ("predicate" in payload) {
                    state.items = state.items.map((item) =>
                        payload.predicate(item) ? { ...item, ...payload.data } : item,
                    );
                } else {
                    state.items = state.items.map((item) =>
                        item[idKey] === payload[idKey] ? { ...item, ...payload } : item,
                    );
                }
            },

            /**
             * Bulk-update items in the list.
             *
             * Accepts two forms:
             *   - `{ predicate, data }` — update all matching items
             *   - `updatedItems[]` — matched by idKey via a Map for O(n) performance
             */
            updateItems(state, { payload }) {
                if ("predicate" in payload) {
                    state.items = state.items.map((item) =>
                        payload.predicate(item) ? { ...item, ...payload.data } : item,
                    );
                    return;
                }
                const byId = new Map(payload.map((item) => [item[idKey], item]));
                state.items = state.items.map((item) => {
                    const updated = byId.get(item[idKey]);
                    return updated ? { ...item, ...updated } : item;
                });
            },

            /**
             * Remove item(s) from the list.
             *
             * Accepts:
             *   - a predicate `(item) => bool` — remove all matching
             *   - a raw id value — remove by idKey
             */
            removeItem(state, { payload }) {
                if (typeof payload === "function") {
                    state.items = state.items.filter((item) => !payload(item));
                } else {
                    state.items = state.items.filter((item) => item[idKey] !== payload);
                }
            },

            /** Store a single record in the recordById cache. */
            setRecord(state, { payload }) {
                state.recordById[payload[idKey]] = payload;
            },

            /** Reset the entire slice back to initialState. */
            clearData() {
                return initialState;
            },

            ...extraReducers,
        },
    });

    return {
        actions: slice.actions,
        reducer: slice.reducer,
        name: slice.name,
        getInitialState: () => initialState,
    };
}
