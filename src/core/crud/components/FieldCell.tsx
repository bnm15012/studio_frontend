/** Single source of truth for rendering a field in table/card/dialog contexts, handling view/edit/read-only modes. */
import { Button } from "@mui/material";
import Field from "@/core/components/fields/Field";
import { resolveFieldValue, bindGetOptions } from "@/core/utils/fieldHelpers";
import { Entity, FieldDef } from "@/core/types";

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
interface FieldCellProps<T extends Entity> {
    field: FieldDef<T>;
    row: T;
    isEdit: boolean;
    handleChange?: (value: unknown, rowId: number, fieldName: string) => void;
    handleViewOpen?: (row: T) => void;
    submitAttempted?: boolean;
}

function FieldCell<T extends Entity>({
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

    const rowId = Number(row[Object.keys(row)[0]]) || 0;

    return (
        <Field
            isEdit={isEdit}
            value={resolveFieldValue(field, row, isEdit)}
            setValue={(v) => handleChange?.(v, rowId, field.name)}
            type={field.type}
            extraProp={bindGetOptions(field, row)}
            validation={field.validation as Record<string, unknown>}
            submitAttempted={submitAttempted}
        />
    );
}

export default FieldCell;
