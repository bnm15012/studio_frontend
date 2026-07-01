import React from "react";
import Field from "../components/fields/Field";
import { FlexBetween } from "../components/layout/FlexBox";
import { Box } from "@mui/material";
import StyledDialog from "../components/dialogs/StyledDialog";
import { FieldLabel } from "../components/fields/StyledField";
import { useUI } from "../context/UIContext";
import SaveCancelButtons from "./components/SaveCancelButtons";
import {
    getVisibleFields,
    bindGetOptions,
    resolveFieldValue,
    isFieldEditable,
    FieldDef,
} from "../utils/fieldHelpers";

interface DialogFormProps {
    data: any;
    fields: FieldDef[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    handleChange: (value: any, rowId: any, fieldName: string) => void;
    handleSave: (rowId: any) => void | Promise<void>;
    setClose: () => void;
    [key: string]: any;
}

export const DialogForm: React.FC<DialogFormProps> = (props) => {
    const { data, fields, fieldsMeta, setClose, handleChange, handleSave, ...dialogProps } = props;
    const { isMobile } = useUI();
    const id = data?.[fieldsMeta.primary];
    const visibleFields = getVisibleFields(fields);

    return (
        <StyledDialog
            open={true}
            onClose={setClose}
            closeIcon={true}
            title={id === "NEW" ? "Create Record" : "Edit Record"}
            fullScreen={isMobile}
            {...dialogProps}
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
                                    handleChange(v, data[fieldsMeta.primary], field.name)
                                }
                                type={field.type}
                                extraProp={bindGetOptions(field.extraProp, data)}
                                validation={field.validation}
                            />
                        </Box>
                    </Box>
                ))}

                <FlexBetween width={"100%"} gap={2} mt={2}>
                    <SaveCancelButtons
                        onSave={() => handleSave(id)}
                        onCancel={setClose}
                        size="small"
                        saveLabel="Save"
                        fullWidth
                    />
                </FlexBetween>
            </FlexBetween>
        </StyledDialog>
    );
};

export default DialogForm;
