// utils/objectHelpers.ts
export const getNestedValue = (obj: Record<string, unknown>, path: string): unknown =>
    path.split(".").reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
        return undefined;
    }, obj);

export const setNestedValue = (
    obj: Record<string, unknown>,
    path: string,
    value: unknown,
): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;
    const deep = keys.reduce<Record<string, unknown>>((acc, key) => {
        if (!acc[key] || typeof acc[key] !== "object") acc[key] = {};
        return acc[key] as Record<string, unknown>;
    }, obj);
    deep[lastKey] = value;
};
