import { createSlice } from "@reduxjs/toolkit";

export function createGenericSlice(options) {
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
        ...options.extraState,
    };

    const slice = createSlice({
        name: options.name,
        initialState,
        reducers: {
            setItems(state, action) {
                state.rootId = action.payload.rootId;
                state.items = action.payload.data;
            },
            setInfo(state, action) {
                state.totalCount = action.payload.totalCount;
                state.currentPage = action.payload.currentPage;
                state.searchTerm = action.payload.searchTerm || "";
                state.filterKeys = action.payload.filterKeys || {};
                state.pageSize = action.payload.pageSize;
                state.totalPages = Math.ceil(
                    action.payload.totalCount / (action.payload.pageSize ?? 1),
                );
            },
            addItem(state, action) {
                state.items.push(action.payload);
            },
            prependItem(state, action) {
                state.items = [action.payload, ...state.items];
            },
            appendItems(state, action) {
                if (state.rootId != action.payload.rootId) {
                    state.rootId = action.payload.rootId;
                    state.items = [];
                }
                const newItems = action.payload.data.filter(
                    (item) =>
                        !state.items.some(
                            (existing) => existing[options.idKey] === item[options.idKey],
                        ),
                );
                state.items.push(...newItems);
            },
            updateItem(state, action) {
                if ("predicate" in action.payload) {
                    const { predicate, data } = action.payload;
                    state.items = state.items.map((item) =>
                        predicate(item) ? { ...item, ...data } : item,
                    );
                } else {
                    const updatedItem = action.payload;
                    state.items = state.items.map((item) =>
                        item[options.idKey] === updatedItem[options.idKey]
                            ? { ...item, ...updatedItem }
                            : item,
                    );
                }
            },
            removeItem(state, action) {
                if (typeof action.payload === "function") {
                    state.items = state.items.filter((item) => !action.payload(item));
                } else {
                    state.items = state.items.filter(
                        (item) => item[options.idKey] !== action.payload,
                    );
                }
            },
            setRecord(state, action) {
                const record = action.payload;
                state.recordById[record[options.idKey]] = record;
            },
            clearData(state) {
                Object.keys(initialState).forEach((key) => {
                    state[key] = initialState[key];
                });
            },
            ...options.extraReducers,
        },
    });

    return {
        actions: slice.actions,
        reducer: slice.reducer,
        name: slice.name,
        getInitialState: () => initialState,
    };
}
