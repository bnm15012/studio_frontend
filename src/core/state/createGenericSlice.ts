import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
export interface Entity {
    [key: string]: unknown;
}

export interface GenericState<T> {
    rootId: string | number;
    items: T[];
    recordById: Record<string | number, T>;
    searchTerm: string;
    filterKeys: Entity;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    [key: string]: unknown;
}


export interface CreateGenericSliceOptions<T extends Entity> {
    name: string;
    idKey?: string;
    extraState?: Partial<GenericState<T>> & Entity;
    extraReducers?: Record<string, any>;
}

export function createGenericSlice<T extends Entity>({
    name,
    idKey = "id",
    extraState = {},
    extraReducers = {},
}: CreateGenericSliceOptions<T>) {
    const initialState: GenericState<T> = {
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
            setItems(state, { payload: { data, rootId } }: PayloadAction<{ data: T[]; rootId: string | number }>) {
                state.rootId = rootId;
                state.items = data as Draft<T[]>;
            },

            setInfo(
                state,
                {
                    payload,
                }: PayloadAction<{
                    totalCount: number;
                    currentPage: number;
                    searchTerm?: string;
                    filterKeys?: Entity;
                    pageSize: number;
                }>,
            ) {
                state.totalCount = payload.totalCount;
                state.currentPage = payload.currentPage;
                state.searchTerm = payload.searchTerm ?? "";
                state.filterKeys = payload.filterKeys ?? {};
                state.pageSize = payload.pageSize;
                state.totalPages = Math.ceil(payload.totalCount / (payload.pageSize ?? 1));
            },

            addItem(state, { payload }: PayloadAction<T>) {
                state.items.push(payload as Draft<T>);
            },

            prependItem(state, { payload }: PayloadAction<T>) {
                state.items = [payload as Draft<T>, ...state.items];
            },

            appendItems(state, { payload: { data, rootId } }: PayloadAction<{ data: T[]; rootId: string | number }>) {
                if (state.rootId !== rootId) {
                    state.rootId = rootId;
                    state.items = [];
                }
                const existingIds = new Set(state.items.map((item) => (item as Entity)[idKey]));
                const newItems = data.filter((item) => !existingIds.has((item as Entity)[idKey]));
                state.items.push(...(newItems as Draft<T[]>));
            },

            updateItem(state, action: PayloadAction<T | { predicate: (item: T) => boolean; data: Partial<T> }>) {
                if ("predicate" in action.payload) {
                    const payload = action.payload as { predicate: (item: T) => boolean; data: Partial<T> };
                    state.items = state.items.map((item) =>
                        payload.predicate(item as T) ? Object.assign({}, item, payload.data) : item,
                    ) as Draft<T[]>;
                } else {
                    state.items = state.items.map((item) =>
                        (item as T)[idKey] === action.payload[idKey] ? { ...item, ...action.payload } : item,
                    );
                }
            },

            updateItems(state, { payload }: PayloadAction<Entity | Entity[]>) {
                if (payload && typeof payload === "object" && "predicate" in payload) {
                    state.items = state.items.map((item) =>
                        (payload as any).predicate(item) ? { ...item, ...(payload as any).data } : item,
                    ) as any;
                    return;
                }
                if (Array.isArray(payload)) {
                    const byId = new Map(payload.map((item) => [(item as Entity)[idKey], item]));
                    state.items = state.items.map((item) => {
                        const updated = byId.get((item as Entity)[idKey]);
                        return updated ? { ...item, ...updated } as T : item;
                    }) as any;
                }
            },

            removeItem(state, { payload }: PayloadAction<((item: T) => boolean) | string | number>) {
                if (typeof payload === "function") {
                    state.items = state.items.filter((item) => !(payload as (item: T) => boolean)(item as T));
                } else {
                    state.items = state.items.filter((item) => (item as Entity)[idKey] !== payload);
                }
            },

            setRecord(state, { payload }: PayloadAction<T>) {
                (state.recordById as Record<string | number, Entity>)[(payload as Entity)[idKey] as string | number] = payload as unknown as Entity;
            },

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
