import { FieldValue } from "@/core/types";

type Indexable = Record<string, FieldValue | Record<string, FieldValue>>;

export const getNestedValue = <T = unknown>(obj: T, path: string): FieldValue => {
    const keys = path.split(".");
    let current: unknown = obj;
    for (const key of keys) {
        if (current == null || typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[key];
    }
    return current as FieldValue;
};

export const setNestedValue = <T = unknown>(obj: T, path: string, value: unknown): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;
    const deep = keys.reduce<Indexable>(
        (acc, key) => {
            const existing = acc[key];
            if (existing == null || typeof existing !== "object") {
                acc[key] = {};
            }
            return acc[key] as Indexable;
        },
        obj as unknown as Indexable,
    );
    deep[lastKey] = value as unknown as FieldValue;
};
