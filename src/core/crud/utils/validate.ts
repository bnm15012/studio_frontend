const isEmpty = (v: any): boolean =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

export const validate = (data: Record<string, any>, fields: any[]): void => {
    fields.forEach(({ name, label, validation }) => {
        if (validation?.required && (!Object.prototype.hasOwnProperty.call(data, name) || isEmpty(data[name]))) {
            throw new Error(`${label || name} is required`);
        }
    });
};
