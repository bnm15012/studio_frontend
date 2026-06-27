import { createGenericSlice } from "../state/createGenericSlice";
import { getHeader } from "./helper";
import { createCrudThunks } from "./thunk";

/**
 * Creates a complete CRUD slice + thunk set for a given API route.
 *
 * @param {object} opts
 * @param {string}   opts.route         - API route segment (e.g. "students")
 * @param {string}   [opts.idKey="id"]  - Primary key field name
 * @param {Function} [opts.extraCruds]  - Factory for extra thunks, receives { actions, getHeader, route }
 * @param {object}   [opts.extraState]  - Extra initial state merged into the slice
 * @param {object}   [opts.extraReducers] - Extra reducers merged into the slice
 */
export function createCrudModule({
    route,
    idKey = "id",
    extraCruds = () => ({}),
    extraState = {},
    extraReducers = {},
}) {
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
