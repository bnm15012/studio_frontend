/** Simple form validation: checks required fields, regex patterns, min length, and max length, throwing an error message if any fail. */
const isEmpty = (v: unknown): boolean =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

interface ValidationField {
    name: string;
    label?: string;
    validation?: {
        required?: boolean;
        regex?: RegExp | string;
        message?: string;
        minLength?: number;
        maxLength?: number;
    };
}

export const validate = (data: Record<string, unknown>, fields: ValidationField[]): void => {
    fields.forEach(({ name, label, validation }) => {
        if (!validation) return;
        const value = data[name];
        const strValue = value === null || value === undefined ? "" : String(value);

        if (validation.required && isEmpty(value)) {
            throw new Error(`${label || name} is required`);
        }

        if (!isEmpty(value)) {
            if (validation.regex) {
                const regexObj =
                    typeof validation.regex === "string"
                        ? new RegExp(validation.regex)
                        : validation.regex;
                if (!regexObj.test(strValue)) {
                    throw new Error(`${label || name}: ${validation.message || "Invalid format"}`);
                }
            }
            if (validation.minLength && strValue.length < validation.minLength) {
                throw new Error(
                    `${label || name} must be at least ${validation.minLength} characters`,
                );
            }
            if (validation.maxLength && strValue.length > validation.maxLength) {
                throw new Error(
                    `${label || name} must be at most ${validation.maxLength} characters`,
                );
            }
        }
    });
};
