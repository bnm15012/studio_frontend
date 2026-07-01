const isEmpty = (v: unknown): boolean =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

interface ValidationField {
    name: string;
    label?: string;
    validation?: { required?: boolean };
}

export const validate = (data: Record<string, unknown>, fields: ValidationField[]): void => {
    fields.forEach(({ name, label, validation }) => {
        if (validation?.required && (!Object.prototype.hasOwnProperty.call(data, name) || isEmpty(data[name]))) {
            throw new Error(`${label || name} is required`);
        }
    });
};
