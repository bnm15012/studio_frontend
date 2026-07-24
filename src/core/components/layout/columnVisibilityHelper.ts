import { KEYS, ls } from "@/core/utils/localStorageHelper";
import { Entity, FieldDef } from "@/core/types";

export type ColumnVisibilityMap = Record<string, boolean>;

export interface ColumnVisibilityButtonProps<T extends Entity> {
    /**
     * Unique key used to namespace the visibility map in localStorage.
     * Typically the table / entity name, e.g. "students" or "invoices".
     */
    tableKey: string;
    /** All available field definitions for this table. */
    fields: FieldDef<T>[];
    /**
     * Called whenever the user changes a column's visibility.
     * Receives the full updated map so the parent can re-filter fields.
     */
    onVisibilityChange: (map: ColumnVisibilityMap) => void;
    currentView: string;
}

/** Returns the stored visibility map for a given tableKey. */
export function getStoredVisibility(tableKey: string): ColumnVisibilityMap {
    const all = ls.get<Record<string, ColumnVisibilityMap>>(KEYS.COLUMN_VISIBILITY, {});
    return all[tableKey] ?? {};
}

/** Persists a visibility map update for a given tableKey. */
export function storeVisibility(tableKey: string, map: ColumnVisibilityMap) {
    const all = ls.get<Record<string, ColumnVisibilityMap>>(KEYS.COLUMN_VISIBILITY, {});
    ls.set(KEYS.COLUMN_VISIBILITY, { ...all, [tableKey]: map });
}

/**
 * Given the full list of fields and the stored map, returns which fields
 * are visible. A field is visible when it's not explicitly set to false.
 */
export function applyVisibility<T extends Entity>(
    fields: FieldDef<T>[],
    map: ColumnVisibilityMap,
): FieldDef<T>[] {
    return fields.filter((f) => map[f.name] !== false);
}
