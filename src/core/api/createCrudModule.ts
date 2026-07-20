/** Factory that assembles a complete CRUD module — creates a Redux slice + thunks + helper functions for a given API route. */
import { createGenericSlice } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks, CrudThunksOptions } from "./thunk";
import { Entity } from "../types";
import { GenericState } from "../state/stateTypes";
import { CrudThunks } from "../types";
import { ActionCreatorWithPayload, ActionCreatorWithoutPayload, Reducer } from "@reduxjs/toolkit";

/** Strongly typed action creators from the generic slice. */
export interface GenericSliceActions<T extends Entity> {
    setItems: ActionCreatorWithPayload<{ data: T[]; rootId: string | number }>;
    setInfo: ActionCreatorWithPayload<{
        totalCount: number;
        currentPage: number;
        searchTerm?: string;
        filterKeys?: Entity;
        pageSize: number;
    }>;
    addItem: ActionCreatorWithPayload<T>;
    prependItem: ActionCreatorWithPayload<T>;
    appendItems: ActionCreatorWithPayload<{ data: T[]; rootId: string | number }>;
    updateItem: ActionCreatorWithPayload<T | { predicate: (item: T) => boolean; data: Partial<T> }>;
    updateItems: ActionCreatorWithPayload<Entity | Entity[]>;
    removeItem: ActionCreatorWithPayload<((item: T) => boolean) | string | number>;
    setRecord: ActionCreatorWithPayload<T>;
    clearData: ActionCreatorWithoutPayload;
}

/** Shape of the opts object passed into the extraCruds factory. */
export interface ExtraCrudsOpts<T extends Entity> {
    actions: GenericSliceActions<T>;
    getHeader: typeof getHeader;
    route: string;
}

export interface CreateCrudModuleOptions<
    T extends Entity,
    S extends GenericState<T>,
    E extends Record<string, unknown> = Record<string, never>,
> {
    route: string;
    idKey?: string;
    extraCruds?: (opts: ExtraCrudsOpts<T>) => E;
    extraState?: Partial<S>;
    extraReducers?: Record<string, unknown>;
}

/** The complete return type of createCrudModule. */
export type CrudModule<
    T extends Entity,
    S extends GenericState<T> = GenericState<T>,
    E extends Record<string, unknown> = Record<string, never>,
> = CrudThunks<T> &
    E & {
        actions: GenericSliceActions<T>;
        initialState: S;
        reducer: Reducer<S>;
        removeAll: ActionCreatorWithoutPayload;
    };

export function createCrudModule<T extends Entity, S extends GenericState<T> = GenericState<T>>() {
    return <E extends Record<string, unknown> = Record<string, never>>(
        options: CreateCrudModuleOptions<T, S, E>,
    ): CrudModule<T, S, E> => {
        const { route, idKey = "id", extraCruds, extraState, extraReducers = {} } = options;

        const { actions, getInitialState, reducer } = createGenericSlice<T, S>({
            name: route,
            idKey,
            extraState,
            extraReducers,
        });

        const baseCrud = {
            actions: actions as unknown as GenericSliceActions<T>,
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
        } as CrudModule<T, S, E>;
    };
}
