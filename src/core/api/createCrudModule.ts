/** Factory that assembles a complete CRUD module — creates a Redux slice + thunks + helper functions for a given API route. */
import { createGenericSlice } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks, CrudThunksOptions } from "./thunk";
import { Entity } from "../types";
import { GenericState } from "../state/stateTypes";

export interface CreateCrudModuleOptions<T extends Entity, S extends GenericState<T>> {
    route: string;
    idKey?: string;
    extraCruds?: (opts: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        actions: Record<string, (...args: any[]) => { type: string; payload?: unknown }>;
        getHeader: typeof getHeader;
        route: string;
    }) => Record<string, unknown>;
    extraState?: Partial<S>;
    extraReducers?: Record<string, unknown>;
}

export function createCrudModule<
    T extends Entity = Entity,
    S extends GenericState<T> = GenericState<T>,
>({
    route,
    idKey = "id",
    extraCruds = () => ({}),
    extraState,
    extraReducers = {},
}: CreateCrudModuleOptions<T, S>) {
    const { actions, getInitialState, reducer } = createGenericSlice<T, S>({
        name: route,
        idKey,
        extraState,
        extraReducers,
    });

    const baseCrud = {
        actions,
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
        ...extraCruds({ actions, getHeader, route }),
    };
}
