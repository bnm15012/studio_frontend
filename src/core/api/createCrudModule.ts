import { createGenericSlice, GenericState } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks } from "./thunk";

export interface CreateCrudModuleOptions<T extends Record<string, unknown> = Record<string, unknown>> {
    route: string;
    idKey?: string;
    extraCruds?: (opts: { actions: Record<string, any>; getHeader: typeof getHeader; route: string }) => Record<string, any>;
    extraState?: Partial<GenericState<T>> & Record<string, unknown>;
    extraReducers?: Record<string, any>;
}

export function createCrudModule<T extends Record<string, unknown> = Record<string, unknown>>({
    route,
    idKey = "id",
    extraCruds = () => ({}),
    extraState = {},
    extraReducers = {},
}: CreateCrudModuleOptions<T>) {
    const { actions, getInitialState, reducer } = createGenericSlice<T>({
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
