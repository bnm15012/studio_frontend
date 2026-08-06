/** Factory that assembles a complete CRUD module — creates a Redux slice + thunks + helper functions for a given API route. */
import { createGenericSlice } from "@/core/state/createGenericSlice";
import { getHeader } from "@/core/api/helper";
import { createCrudThunks, CrudThunksOptions } from "@/core/api/thunk";
import { FilterKeys, GenericState } from "@/core/state/stateTypes";
import { CrudThunks } from "@/core/types";
import type { CrudRecord } from "@/api/types";
import {
    ActionCreatorWithPayload,
    ActionCreatorWithoutPayload,
    Reducer,
    PayloadAction,
    SliceCaseReducers,
} from "@reduxjs/toolkit";

/** Strongly typed action creators from the generic slice. */
export interface GenericSliceActions<T extends CrudRecord> {
    setItems: ActionCreatorWithPayload<{ data: T[]; rootId: string | number }>;
    setInfo: ActionCreatorWithPayload<{
        totalCount: number;
        currentPage: number;
        searchTerm?: string;
        filterKeys?: FilterKeys;
        pageSize: number;
    }>;
    addItem: ActionCreatorWithPayload<T>;
    prependItem: ActionCreatorWithPayload<T>;
    appendItems: ActionCreatorWithPayload<{ data: T[]; rootId: string | number }>;
    updateItem: ActionCreatorWithPayload<T | { predicate: (item: T) => boolean; data: Partial<T> }>;
    updateItems: ActionCreatorWithPayload<
        T | T[] | { predicate: (item: T) => boolean; data: Partial<T> }
    >;
    removeItem: ActionCreatorWithPayload<((item: T) => boolean) | string | number>;
    setRecord: ActionCreatorWithPayload<T>;
    clearData: ActionCreatorWithoutPayload;
}

/** Infer ActionCreators from extraReducers map */
export type InferExtraActions<R> = {
    [K in keyof R]: R[K] extends (state: never, action: PayloadAction<infer P>) => void
        ? ActionCreatorWithPayload<P>
        : R[K] extends (state: never, action: infer A) => void
          ? A extends { payload: infer P }
              ? ActionCreatorWithPayload<P>
              : ActionCreatorWithoutPayload
          : ActionCreatorWithoutPayload;
};

/** Shape of the opts object passed into the extraCruds factory. */
export interface ExtraCrudsOpts<T extends CrudRecord> {
    actions: GenericSliceActions<T>;
    getHeader: typeof getHeader;
    route: string;
}

export interface CreateCrudModuleOptions<
    T extends CrudRecord,
    S extends GenericState<T>,
    E extends object = Record<string, never>,
    R extends SliceCaseReducers<S> = SliceCaseReducers<S>,
> {
    route: string;
    idKey?: string;
    extraCruds?: (opts: ExtraCrudsOpts<T>) => E;
    extraState?: Partial<S>;
    extraReducers?: R;
}

/** The complete return type of createCrudModule. */
export type CrudModule<
    T extends CrudRecord,
    S extends GenericState<T> = GenericState<T>,
    E extends object = Record<string, never>,
    R extends SliceCaseReducers<S> = SliceCaseReducers<S>,
> = CrudThunks<T> &
    E & {
        actions: GenericSliceActions<T> & InferExtraActions<R>;
        initialState: S;
        reducer: Reducer<S>;
        removeAll: ActionCreatorWithoutPayload;
    };

export function createCrudModule<
    T extends CrudRecord,
    S extends GenericState<T> = GenericState<T>,
>() {
    return <
        E extends object = Record<string, never>,
        R extends SliceCaseReducers<S> = SliceCaseReducers<S>,
    >(
        options: CreateCrudModuleOptions<T, S, E, R>,
    ): CrudModule<T, S, E, R> => {
        const { route, idKey = "id", extraCruds, extraState, extraReducers = {} as R } = options;

        const { actions, getInitialState, reducer } = createGenericSlice<T, S, R>({
            name: route,
            idKey,
            ...(extraState ? { extraState } : {}),
            ...(extraReducers ? { extraReducers } : {}),
        });

        const baseCrud = {
            actions: actions as unknown as GenericSliceActions<T> & InferExtraActions<R>,
            initialState: getInitialState(),
            reducer,
            removeAll: actions.clearData,
            ...createCrudThunks<T>({
                actions: actions as unknown as CrudThunksOptions<T>["actions"],
                idKey,
                route,
            }),
        };

        return {
            ...baseCrud,
            ...(extraCruds?.({
                actions: actions as unknown as GenericSliceActions<T>,
                getHeader,
                route,
            }) ?? {}),
        } as CrudModule<T, S, E, R>;
    };
}
