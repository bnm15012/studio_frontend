import { getNestedValue } from "../../utils/objectHelpers";

/**
 * Returns the fields that should be visible in list/card/dialog views.
 *
 * @param {Array} fields
 * @returns {Array}
 */
export const getVisibleFields = (fields) => fields.filter((f) => f.show || f.view);

/**
 * Resolves the display/edit value for a field from a data row.
 *
 * @param {Object} field  - field definition
 * @param {Object} row    - data row / record
 * @param {boolean} isEdit
 * @returns {*}
 */
export const resolveFieldValue = (field, row, isEdit) => {
    const raw = getNestedValue(row, field.name);
    return field?.getValue ? field.getValue(raw, row, isEdit) : raw;
};

/**
 * Returns a patched extraProp object where getOptions is row-bound.
 *
 * @param {Object} extraProp - original field.extraProp
 * @param {Object} row       - current data row
 * @returns {Object}
 */
export const bindGetOptions = (extraProp, row) => {
    if (!extraProp?.getOptions) return extraProp ?? {};
    return {
        ...extraProp,
        getOptions: async (search, page, limit) => extraProp.getOptions(search, page, limit, row),
    };
};

/** Shared "empty state" message constant */
export const EMPTY_DATA_MSG = "No data available";
