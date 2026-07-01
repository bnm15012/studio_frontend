import React from "react";
import { Button } from "@mui/material";
import Field from "../../components/fields/Field";
import { resolveFieldValue, bindGetOptions } from "../../utils/fieldHelpers";
import { FieldDef } from "../../types";

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
interface FieldCellProps {
    field: FieldDef;
    row: Record<string, unknown>;
    isEdit: boolean;
    handleChange?: (value: unknown, rowId: string | number | null | undefined, fieldName: string) => void;
    handleViewOpen?: (row: Record<string, unknown>) => void;
}

const FieldCell: React.FC<FieldCellProps> = ({
    field,
    row,
    isEdit,
    handleChange,
    handleViewOpen,
}) => {
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

    const rowId = row?.[Object.keys(row)[0]]; // fallback; callers provide explicit id via handleChange closure

    return (
        <Field
            isEdit={isEdit}
            value={resolveFieldValue(field, row, isEdit)}
            setValue={(v) => handleChange?.(v, rowId, field.name)}
            type={field.type}
            extraProp={bindGetOptions(field.extraProp, row)}
            validation={field.validation}
        />
    );
};

export default FieldCell;
