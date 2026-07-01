import { getNestedValue } from "../../utils/objectHelpers";

export interface FieldDef {
    name: string;
    show?: boolean;
    view?: boolean;
    getValue?: (raw: any, row: any, isEdit: boolean) => any;
    editable?: (row: any) => boolean;
    extraProp?: {
        getOptions?: (search: string, page: number, limit: number, row?: any) => Promise<any>;
        [key: string]: any;
    };
    [key: string]: any;
}

/**
 * Returns the fields that should be visible in list/card/dialog views.
 *
 * @param fields - field definitions
 * @returns visible fields
 */
export const getVisibleFields = (fields: FieldDef[]): FieldDef[] =>
    fields.filter((f) => f.show || f.view);

/**
 * Resolves the display/edit value for a field from a data row.
 *
 * @param field  - field definition
 * @param row    - data row / record
 * @param isEdit - editing mode flag
 * @returns resolved value
 */
export const resolveFieldValue = (field: FieldDef, row: any, isEdit: boolean): any => {
    const raw = getNestedValue(row, field.name);
    return field?.getValue ? field.getValue(raw, row, isEdit) : raw;
};

/**
 * Checks if a field is editable given a record and editing state.
 *
 * @param field     - field definition
 * @param row       - current record data
 * @param isEditing - editing state flag
 * @returns boolean indicating if editable
 */
export const isFieldEditable = (field: FieldDef, row: any, isEditing: boolean): boolean => {
    if (!isEditing) return false;
    return field?.editable ? field.editable(row) : true;
};

/**
 * Returns a patched extraProp object where getOptions is row-bound.
 *
 * @param extraProp - original field.extraProp
 * @param row       - current data row
 * @returns patched extraProp object
 */
export const bindGetOptions = (extraProp: FieldDef["extraProp"], row: any): FieldDef["extraProp"] => {
    if (!extraProp?.getOptions) return extraProp ?? {};
    return {
        ...extraProp,
        getOptions: async (search: string, page: number, limit: number) =>
            extraProp.getOptions!(search, page, limit, row),
    };
};

/** Shared "empty state" message constant */
export const EMPTY_DATA_MSG = "No data available";
