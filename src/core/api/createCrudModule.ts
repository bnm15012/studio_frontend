import { createGenericSlice } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks } from "./thunk";

export interface CreateCrudModuleOptions {
    route: string;
    idKey?: string;
    extraCruds?: (opts: { actions: Record<string, any>; getHeader: typeof getHeader; route: string }) => Record<string, any>;
    extraState?: Record<string, unknown>;
    extraReducers?: Record<string, unknown>;
}

/**
 * Creates a complete CRUD slice + thunk set for a given API route.
 */
export function createCrudModule({
    route,
    idKey = "id",
    extraCruds = () => ({}),
    extraState = {},
    extraReducers = {},
}: CreateCrudModuleOptions) {
    const { actions, getInitialState, reducer } = createGenericSlice({
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
        ...createCrudThunks({ actions, idKey, route }),
    };

    return {
        ...baseCrud,
        ...extraCruds({ actions, getHeader, route }),
    };
}
