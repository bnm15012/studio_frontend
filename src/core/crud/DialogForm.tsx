/** Dialog-based form for editing a single entity row, rendering visible fields with save/cancel buttons. */
import Field from "@/core/components/fields/Field";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import StyledDialog, {
    type StyledDialogProps,
    type DialogAction,
} from "@/core/components/dialogs/StyledDialog";
import { FieldLabel } from "@/core/components/fields/StyledField";
import { useUI } from "@/context/UIContext";
import { bindGetOptions, resolveFieldValue, isFieldEditable } from "@/core/utils/fieldHelpers";
import { ActionItem, CrudRecord, FieldDef, FieldMeta, CrudState, FieldValue } from "@/core/types";
import type { ValidationRules } from "@/core/components/fields/StyledTextField";
import { Close } from "@mui/icons-material";
import { Save } from "lucide-react";

interface DialogFormProps<T extends CrudRecord> extends Omit<
    Partial<StyledDialogProps>,
    "actions"
> {
    data: T;
    fields: FieldDef<T>[];
    fieldsMeta: FieldMeta;
    handleChange: (value: FieldValue, rowId: number, fieldName: string) => void;
    handleSave: (rowId: number) => void | Promise<void>;
    setClose: () => void;
    submitAttempted?: boolean | undefined;
    actions?: ActionItem<T>[] | DialogAction[] | undefined;
    tableState?: CrudState | undefined;
    loading?: boolean | undefined;
    editingId?: number | undefined;
}

export function DialogForm<T extends CrudRecord>(props: DialogFormProps<T>) {
    const {
        data,
        fields,
        fieldsMeta,
        setClose,
        handleChange,
        handleSave,
        submitAttempted,
        actions: _actions,
        tableState: _tableState,
        loading: _loading,
        editingId: _editingId,
        ...dialogProps
    } = props;
    const { isMobile } = useUI();
    const id = Number(data[fieldsMeta.primary as keyof T]) || 0;
    const visibleFields = fields.filter((f) => f.show !== false);

    return (
        <StyledDialog
            open={true}
            onClose={setClose}
            closeIcon={true}
            title={id === 0 ? "Create Record" : "Edit Record"}
            {...dialogProps}
            actions={[
                { component: <Close />, key: "cancel", onClick: setClose },
                {
                    component: <Save />,
                    variant: "contained",
                    key: "save",
                    onClick: () => handleSave(id),
                },
            ]}
        >
            <FlexBetween flexDirection={"column"} gap={2} mt={2}>
                {visibleFields.map((field) => (
                    <Box
                        key={field.name}
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: isMobile ? 0.5 : 2,
                            alignItems: isMobile ? "flex-start" : "center",
                            width: "100%",
                        }}
                    >
                        <FieldLabel sx={{ flexShrink: 0, minWidth: isMobile ? "auto" : "8rem" }}>
                            {field.label}
                        </FieldLabel>
                        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                            <Field
                                isEdit={isFieldEditable(field, data, true)}
                                value={resolveFieldValue(field, data, true) as FieldValue}
                                setValue={(v) =>
                                    handleChange(
                                        v as FieldValue,
                                        Number(data[fieldsMeta.primary as keyof T]) || 0,
                                        field.name,
                                    )
                                }
                                type={field.type || "TEXT"}
                                extraProp={bindGetOptions(field, data)}
                                validation={field.validation as ValidationRules}
                                submitAttempted={Boolean(submitAttempted)}
                            />
                        </Box>
                    </Box>
                ))}
            </FlexBetween>
        </StyledDialog>
    );
}

export default DialogForm;
