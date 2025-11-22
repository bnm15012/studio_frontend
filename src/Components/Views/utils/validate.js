const isEmpty = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

export const validate = (data, fields) => {
    fields.forEach(({ name, label, validation }) => {
        if (validation?.required && (!Object.hasOwn(data, name) || isEmpty(data[name]))) {
            throw new Error(`${label || name} is required`);
        }
    });
};
