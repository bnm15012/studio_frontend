import Field from "../Fields/Field";
import FlexBetween from "../FlexBetween";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import StyledDialog from "../New/StyledDialog";
import { getNestedValue } from "../../utils/objectHelpers";
import { FieldLabel } from "../New/StyledField";

export const DialogForm = (props) => {
    const { data, fields, fieldsMeta, setClose, handleChange, handleSave } = props;
    const id = data[fieldsMeta.primary];
    const visibleFields = fields.filter((f) => f.show !== false);

    return (
        <StyledDialog
            open={true}
            onClose={setClose}
            closeIcon={true}
            size={"xs"}
            title={id === "NEW" ? "Create Record" : "Edit Record"}
        >
            <FlexBetween flexDirection={"column"} gap={2} mt={2}>
                {visibleFields.map((field) => (
                    <FlexBetween key={field.name} gap={2}>
                        <FieldLabel>{field.label}</FieldLabel>
                        <Field
                            isEdit={field?.editable ? field.editable(data) : true}
                            value={
                                field?.getValue
                                    ? field.getValue(getNestedValue(data, field.name), data, true)
                                    : getNestedValue(data, field.name)
                            }
                            setValue={(v) => {
                                handleChange(v, data[fieldsMeta.primary], field.name);
                            }}
                            type={field.type}
                            extraProp={{
                                ...field.extraProp,
                                getOptions: async (search, page, limit) =>
                                    field.extraProp.getOptions(search, page, limit, data),
                            }}
                            validation={field.validation}
                        />
                    </FlexBetween>
                ))}
                <FlexBetween width={"100%"} gap={2} mt={2}>
                    <>
                        <Button
                            size="small"
                            fullWidth
                            onClick={() => handleSave(id)}
                            sx={{ backgroundColor: "green", color: "white" }}
                        >
                            Save
                        </Button>
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={setClose}
                            sx={{
                                color: "red",
                                border: "2px solid red",
                                "&:hover": {
                                    color: "white",
                                    background: "rgba(239, 64, 64, 1)",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </>
                </FlexBetween>
            </FlexBetween>
        </StyledDialog>
    );
};
DialogForm.propTypes = {
    data: PropTypes.object,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    setClose: PropTypes.func,
};

export default DialogForm;
