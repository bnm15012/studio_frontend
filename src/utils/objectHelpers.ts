// utils/objectHelpers.ts
export const getNestedValue = (obj: any, path: string): any =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

export const setNestedValue = (obj: any, path: string, value: any): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;
    const deep = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    deep[lastKey] = value;
};
