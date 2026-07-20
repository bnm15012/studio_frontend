/** Dialog-based form for editing a single entity row, rendering visible fields with save/cancel buttons. */
import Field from "../components/fields/Field";
import { FlexBetween } from "../components/layout/FlexBox";
import { Box } from "@mui/material";
import StyledDialog from "../components/dialogs/StyledDialog";
import { FieldLabel } from "../components/fields/StyledField";
import { useUI } from "@/context/UIContext";
import { bindGetOptions, resolveFieldValue, isFieldEditable } from "../utils/fieldHelpers";
import { Entity, FieldDef } from "../types";
import { Close } from "@mui/icons-material";
import { Save } from "lucide-react";

interface DialogFormProps<T extends Entity = Entity> {
    data: T;
    fields: FieldDef<T>[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    handleChange: (value: unknown, rowId: number, fieldName: string) => void;
    handleSave: (rowId: number) => void | Promise<void>;
    setClose: () => void;
    submitAttempted?: boolean;
    [key: string]: unknown;
}

export function DialogForm<T extends Entity = Entity>(props: DialogFormProps<T>) {
    const {
        data,
        fields,
        fieldsMeta,
        setClose,
        handleChange,
        handleSave,
        submitAttempted,
        ...dialogProps
    } = props;
    const { isMobile } = useUI();
    const id = Number(data?.[fieldsMeta.primary]) || 0;
    const visibleFields = fields.filter((f) => f.show || f.view);

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
                                value={resolveFieldValue(field, data, true)}
                                setValue={(v) =>
                                    handleChange(
                                        v,
                                        Number(data[fieldsMeta.primary]) || 0,
                                        field.name,
                                    )
                                }
                                type={field.type}
                                extraProp={bindGetOptions(field.extraProp ?? {}, data)}
                                validation={field.validation as Record<string, unknown>}
                                submitAttempted={submitAttempted}
                            />
                        </Box>
                    </Box>
                ))}
            </FlexBetween>
        </StyledDialog>
    );
}

export default DialogForm;
