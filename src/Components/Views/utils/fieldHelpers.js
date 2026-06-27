import { getNestedValue } from "../../../utils/objectHelpers";

/**
 * Returns the fields that should be visible in list/card/dialog views.
 * Canonical replacement for the three inline filter variants across ListView,
 * DialogForm, and CardView.
 *
 * @param {Array} fields
 * @returns {Array}
 */
export const getVisibleFields = (fields) => fields.filter((f) => f.show || f.view);

/**
 * Resolves the display/edit value for a field from a data row.
 * Replaces the repeated: field?.getValue ? field.getValue(getNestedValue(...)) : getNestedValue(...)
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
 * Replaces the repeated boilerplate:
 *   getOptions: async (search, page, limit) =>
 *       field.extraProp.getOptions(search, page, limit, row)
 *
 * If field.extraProp has no getOptions, returns extraProp unchanged.
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

/** Shared "empty state" message constant — avoids 3 differing capitalisations */
export const EMPTY_DATA_MSG = "No data available";
