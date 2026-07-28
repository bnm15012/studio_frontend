// utils/objectHelpers.ts
import { Entity } from "@/core/types";

export const getNestedValue = <T extends Entity, K extends string & keyof T>(
    obj: T,
    path: string,
): T[K] => {
    const keys = path.split(".");
    let current: Entity = obj;
    for (const key of keys) {
        if (current == null || typeof current !== "object") return undefined as T[K];
        current = current[key] as Entity;
    }
    return current as T[K];
};

export const setNestedValue = <T extends Entity>(obj: T, path: string, value: T[keyof T]): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;
    const deep = keys.reduce<Entity>((acc, key) => {
        if (!acc[key] || typeof acc[key] !== "object") acc[key] = {} as Entity;
        return acc[key] as Entity;
    }, obj);
    deep[lastKey] = value;
};
