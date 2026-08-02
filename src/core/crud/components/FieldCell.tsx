/** Single source of truth for rendering a field in table/card/dialog contexts, handling view/edit/read-only modes. */
import { Button } from "@mui/material";
import Field from "@/core/components/fields/Field";
import { resolveFieldValue, bindGetOptions } from "@/core/utils/fieldHelpers";
import { CrudRecord, FieldDef, FieldValue } from "@/core/types";
import type { ValidationRules } from "@/core/components/fields/StyledTextField";

/**
 * FieldCell
 *
 * Single source of truth for rendering a field in table/card/dialog contexts.
 * Handles:
 *   - "view" fields → renders a "View Details" button that calls handleViewOpen
 *   - editable fields → renders <Field /> in edit mode
 *   - read-only fields → renders <Field /> getValue display
 *
 * Replaces repeated inline <Field /> blocks across ListView, DialogForm, and CardView.
 */
interface FieldCellProps<T extends CrudRecord> {
    field: FieldDef<T>;
    row: T;
    isEdit: boolean;
    handleChange?: ((value: FieldValue, rowId: number, fieldName: string) => void) | undefined;
    handleViewOpen?: ((row: T) => void) | undefined;
    submitAttempted?: boolean | undefined;
}

function FieldCell<T extends CrudRecord>({
    field,
    row,
    isEdit,
    handleChange,
    handleViewOpen,
    submitAttempted,
}: FieldCellProps<T>) {
    if (field.view) {
        return (
            <Button
                size="small"
                variant="text"
                color="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewOpen?.(row);
                }}
                sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    p: 0,
                    minWidth: "unset",
                    fontSize: "0.85rem",
                    "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                }}
            >
                View
            </Button>
        );
    }

    const firstKey = Object.keys(row)[0] as keyof T | undefined;
    const rowId = firstKey ? Number(row[firstKey]) || 0 : 0;

    const fieldType = field.type || "TEXT";

    return (
        <Field
            isEdit={isEdit}
            value={resolveFieldValue(field, row, isEdit)}
            setValue={(v) => handleChange?.(v as FieldValue, rowId, field.name)}
            type={fieldType}
            extraProp={bindGetOptions(field, row)}
            validation={field.validation as ValidationRules}
            submitAttempted={Boolean(submitAttempted)}
        />
    );
}

export default FieldCell;
