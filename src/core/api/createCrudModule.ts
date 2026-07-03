import { createGenericSlice } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks } from "./thunk";
import { Entity } from "../types";
import { GenericState } from "../state/stateTypes";

export interface CreateCrudModuleOptions<T extends Entity, S extends GenericState<T>> {
    route: string;
    idKey?: string;
    extraCruds?: (opts: { actions: Record<string, any>; getHeader: typeof getHeader; route: string }) => Record<string, any>;
    extraState?: Partial<S>;
    extraReducers?: Record<string, any>;
}

export function createCrudModule<T extends Entity = Entity, S extends GenericState<T> =  GenericState<T>>({
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
        ...createCrudThunks<T>({ actions, idKey, route } as any),
    };

    return {
        ...baseCrud,
        ...extraCruds({ actions, getHeader, route }),
    };
}
