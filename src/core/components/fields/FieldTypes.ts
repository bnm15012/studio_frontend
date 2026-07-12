/** Constants object FIELD_TYPES listing all supported field types: SELECT, BOOL, DATE, DATETIME, NUMBER, EDITOR, IMAGE, etc. */
export const FIELD_TYPES = {
    SELECT: "SELECT",
    BOOL: "BOOL",
    DATE: "DATE",
    DATETIME: "DATETIME",
    NUMBER: "number",
    EDITOR: "EDITOR",
    IMAGE_DIALOG: "IMAGE_DIALOG",
    CUSTOM: "CUSTOM",
    IMAGE: "IMAGE",
    CHECK: "CHECK",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
