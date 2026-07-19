/** Defines the GenericState<T> interface used across Redux slices for paginated CRUD state. */
export interface Entity {
    [key: string]: unknown;
}

export type FilterKeys = Record<string, string>;

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
}
