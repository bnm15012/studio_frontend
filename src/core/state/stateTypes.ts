import type { RootState } from "@/state";

/** Flat query/filter parameters attached to a list request. */
export interface FilterKeys {
    page?: number;
    size?: number;
    searchTerm?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface GenericState<T> {
    rootId: string | number;
    items: T[];
    recordById: Record<string | number, T>;
    searchTerm: string;
    filterKeys: FilterKeys;
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

/**
 * Safely read a CRUD slice from the root state by its route/slice name.
 * The input is validated before being returned typed.
 */
export const getSliceState = <T>(
    rootState: RootState | Record<string, GenericState<T>>,
    route: string,
): GenericState<T> | undefined => {
    if (!rootState || typeof rootState !== "object") return undefined;
    const candidate = (rootState as Record<string, GenericState<T>>)[route];
    if (!candidate || typeof candidate !== "object") return undefined;
    const record = candidate as Partial<GenericState<T>>;
    if (
        !Array.isArray(record.items) ||
        !record.recordById ||
        typeof record.recordById !== "object" ||
        typeof record.totalCount !== "number" ||
        typeof record.totalPages !== "number" ||
        typeof record.currentPage !== "number" ||
        typeof record.pageSize !== "number"
    ) {
        return undefined;
    }
    return candidate as GenericState<T>;
};
