import { getNestedValue } from "@/core/utils/objectHelpers";
import { FieldDef, ExtraProp, CrudRecord, KnownKeys, ActionItem, ViewMode } from "@/core/types";

/** Field utility functions: getVisibleFields, resolveFieldValue, bindGetOptions, isFieldEditable for form/view rendering.

 * Returns the fields that should be visible in list/card/dialog views.
 *
 * @param fields - field definitions
 * @returns visible fields
 */
export const getVisibleFields = <T extends CrudRecord>(fields: FieldDef<T>[]): FieldDef<T>[] =>
    fields.filter((f) => f.show || f.view);

/**
 * Resolves the display/edit value for a field from a data row.
 *
 * @param field  - field definition
 * @param row    - data row / record
 * @param isEdit - editing mode flag
 * @returns resolved value
 */
export const resolveFieldValue = <
    T extends CrudRecord,
    K extends KnownKeys<T> & string = KnownKeys<T> & string,
>(
    field: FieldDef<T>,
    row: T,
    isEdit: boolean,
): React.ReactNode | { key: string | number; value: T[K] } | T[K] => {
    const raw = getNestedValue(row, field.name) as T[K];
    return field.getValue
        ? (
              field.getValue as (
                  val: T[K],
                  r: T,
                  edit: boolean,
              ) => React.ReactNode | { key: string | number; value: T[K] } | T[K]
          )(raw, row, isEdit)
        : raw;
};

/**
 * Checks if a field is editable given a record and editing state.
 *
 * @param field     - field definition
 * @param row       - current record data
 * @param isEditing - editing state flag
 * @returns boolean indicating if editable
 */
export const isFieldEditable = <T extends CrudRecord>(
    field: FieldDef<T>,
    row: T,
    isEditing: boolean,
): boolean => {
    if (!isEditing) return false;
    if (!row || typeof row !== "object") return false;
    return field.editable ? field.editable(row) : true;
};

/**
 * Returns a patched extraProp object where getOptions is row-bound.
 * Supports both top-level field.getOptions and extraProp.getOptions.
 *
 * @param fieldOrExtraProp - field definition or extraProp object
 * @param row              - current data row
 * @returns patched extraProp object
 */
export const bindGetOptions = <T extends CrudRecord>(
    fieldOrExtraProp: FieldDef<T> | ExtraProp<T> | undefined,
    row: T,
): ExtraProp<T> => {
    if (!fieldOrExtraProp) return {};
    const getOptions =
        "getOptions" in fieldOrExtraProp && typeof fieldOrExtraProp.getOptions === "function"
            ? fieldOrExtraProp.getOptions
            : (fieldOrExtraProp as ExtraProp<T>).getOptions;

    const extraProp =
        ("extraProp" in fieldOrExtraProp ? fieldOrExtraProp.extraProp : fieldOrExtraProp) ?? {};

    if (!getOptions) return extraProp as ExtraProp<T>;

    return {
        ...extraProp,
        getOptions: async (search: string, page: number, limit: number) =>
            getOptions(search, page, limit, row),
    } as ExtraProp<T>;
};

/** Shared "empty state" message constant */
export const EMPTY_DATA_MSG = "No data available";

export const isActionVisibleInView = <T>(
    action: ActionItem<T>,
    currentView?: ViewMode | string,
): boolean => {
    if (!currentView) return true;
    const targetViews =
        action.views ??
        (Array.isArray(action.view) ? action.view : action.view ? [action.view] : undefined);
    if (!targetViews || targetViews.length === 0) return true;
    return targetViews.includes(currentView as ViewMode);
};
