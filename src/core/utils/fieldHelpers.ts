import { getNestedValue } from "@/core/utils/objectHelpers";
import { FieldDef, ExtraProp, Entity, KnownKeys } from "@/core/types";

/** Field utility functions: getVisibleFields, resolveFieldValue, bindGetOptions, isFieldEditable for form/view rendering.

 * Returns the fields that should be visible in list/card/dialog views.
 *
 * @param fields - field definitions
 * @returns visible fields
 */
export const getVisibleFields = <T extends Entity>(fields: FieldDef<T>[]): FieldDef<T>[] =>
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
    T extends Entity,
    K extends KnownKeys<T> & string = KnownKeys<T> & string,
>(
    field: FieldDef<T>,
    row: T,
    isEdit: boolean,
): React.ReactNode | { key: string | number; value: T[K] } | T[K] => {
    const raw = getNestedValue<T, K>(row, field.name);
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
export const isFieldEditable = <T extends Entity>(
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
export const bindGetOptions = <T extends Entity>(
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
    };
};

/** Shared "empty state" message constant */
export const EMPTY_DATA_MSG = "No data available";
