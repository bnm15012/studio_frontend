import { CrudRecord, FieldValue } from "@/core/types";

export const compareData = <T extends CrudRecord>(obj1: T, obj2: T): boolean => {
    if (!obj1 || !obj2) return false;
    return (
        JSON.stringify(obj2, Object.keys(obj2).sort()) ===
        JSON.stringify(obj1, Object.keys(obj1).sort())
    );
};

export function replacePlaceholders(
    templateStr: string | null | undefined,
    dataMap: CrudRecord & { getLocalDateTime?: (date: string) => string },
): string {
    if (!templateStr) return "";
    return templateStr.replace(/{{\s*([\w_]+)\s*}}/g, (_, key) => {
        // Support nested keys like instructorData.name
        const keys = key.split("_");
        let value: FieldValue | Record<string, FieldValue> = dataMap as unknown as Record<
            string,
            FieldValue
        >;
        for (const k of keys) {
            if (!value || typeof value !== "object") return "";
            value = (value as Record<string, FieldValue>)[k];
            if (value === undefined || value === null) return "";
        }
        if (typeof value === "string" && !isNaN(Date.parse(value))) {
            if (typeof dataMap.getLocalDateTime === "function") {
                return dataMap.getLocalDateTime(value);
            }
        }
        return String(value);
    });
}
