/** Factory that creates a Redux Toolkit slice with generic CRUD reducers (setItems, addItem, updateItem, removeItem, etc.) for any entity type. */
import { createSlice, Draft, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { FilterKeys, GenericState } from "@/core/state/stateTypes";
import type { CrudRecord } from "@/api/types";

export interface CreateGenericSliceOptions<
    T extends CrudRecord,
    S extends GenericState<T>,
    R extends SliceCaseReducers<S> = SliceCaseReducers<S>,
> {
    name: string;
    idKey?: string;
    extraState?: Partial<S>;
    extraReducers?: R;
}

export function createGenericSlice<
    T extends CrudRecord,
    S extends GenericState<T>,
    R extends SliceCaseReducers<S> = SliceCaseReducers<S>,
>({ name, idKey = "id", extraState, extraReducers = {} as R }: CreateGenericSliceOptions<T, S, R>) {
    const idKeyOf = idKey as keyof T & string;

    const initialState: S = {
        rootId: 0,
        items: [] as T[],
        recordById: {} as Record<string | number, T>,
        searchTerm: "",
        filterKeys: {},
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 0,
        ...extraState,
    } as S;

    const slice = createSlice({
        name,
        initialState,
        reducers: {
            setItems(
                state,
                {
                    payload: { data, rootId },
                }: PayloadAction<{ data: T[]; rootId: string | number }>,
            ) {
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
                    filterKeys?: FilterKeys;
                    pageSize: number;
                }>,
            ) {
                state.totalCount = payload.totalCount;
                state.currentPage = payload.currentPage;
                state.searchTerm = payload.searchTerm ?? "";
                state.filterKeys = payload.filterKeys ?? {};
                state.pageSize = payload.pageSize;
                state.totalPages = Math.ceil(payload.totalCount / (payload.pageSize || 1));
            },

            addItem(state, { payload }: PayloadAction<T>) {
                state.items.push(payload as Draft<T>);
            },

            prependItem(state, { payload }: PayloadAction<T>) {
                state.items.unshift(payload as Draft<T>);
            },

            appendItems(
                state,
                {
                    payload: { data, rootId },
                }: PayloadAction<{ data: T[]; rootId: string | number }>,
            ) {
                state.rootId = rootId;
                state.items = [...state.items, ...(data as Draft<T[]>)];
            },

            updateItem(
                state,
                action: PayloadAction<T | { predicate: (item: T) => boolean; data: Partial<T> }>,
            ) {
                if (
                    action.payload &&
                    typeof action.payload === "object" &&
                    "predicate" in action.payload
                ) {
                    const { predicate, data } = action.payload as {
                        predicate: (item: T) => boolean;
                        data: Partial<T>;
                    };
                    state.items = state.items.map((item) =>
                        predicate(item as T) ? { ...item, ...data } : item,
                    ) as Draft<T[]>;
                } else {
                    const payload = action.payload as T;
                    state.items = state.items.map((item) =>
                        (item as T)[idKeyOf] === payload[idKeyOf]
                            ? { ...(item as T), ...payload }
                            : item,
                    ) as Draft<T[]>;
                }
            },

            updateItems(
                state,
                {
                    payload,
                }: PayloadAction<T | T[] | { predicate: (item: T) => boolean; data: Partial<T> }>,
            ) {
                if (
                    payload &&
                    typeof payload === "object" &&
                    !Array.isArray(payload) &&
                    "predicate" in payload
                ) {
                    const { predicate, data } = payload as {
                        predicate: (item: T) => boolean;
                        data: Partial<T>;
                    };
                    state.items = state.items.map((item) =>
                        predicate(item as T) ? { ...item, ...data } : item,
                    ) as Draft<T[]>;
                    return;
                }
                if (Array.isArray(payload)) {
                    const byId = new Map<T[keyof T], T>(
                        payload.map((item) => [(item as T)[idKeyOf], item]),
                    );
                    state.items = state.items.map((item) => {
                        const updated = byId.get((item as T)[idKeyOf]);
                        return updated ? ({ ...(item as T), ...updated } as T) : item;
                    }) as Draft<T[]>;
                }
            },

            removeItem(
                state,
                { payload }: PayloadAction<((item: T) => boolean) | string | number>,
            ) {
                if (typeof payload === "function") {
                    state.items = state.items.filter(
                        (item) => !(payload as (item: T) => boolean)(item as T),
                    );
                } else {
                    state.items = state.items.filter(
                        (item) => ((item as T)[idKeyOf] as string | number) !== payload,
                    );
                }
            },

            setRecord(state, { payload }: PayloadAction<T>) {
                (state.recordById as Record<string | number, T>)[
                    payload[idKeyOf] as string | number
                ] = payload;
            },

            clearData() {
                return initialState;
            },

            ...(extraReducers as SliceCaseReducers<S>),
        },
    });

    return {
        actions: slice.actions,
        reducer: slice.reducer,
        name: slice.name,
        getInitialState: () => initialState,
    };
}
