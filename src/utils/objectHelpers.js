// utils/objectHelpers.js
export const getNestedValue = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

export const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const deep = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    deep[lastKey] = value;
};
