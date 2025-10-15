import Field from "../Fields/Field";
import FlexBetween from "../FlexBetween";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import StyledDialog from "../New/StyledDialog";

const FormView = ({ data, fields, fieldsMeta, handleChange, handleSave, handleCancel }) => {
    const id = data[fieldsMeta.primary];
    const visibleFields = fields.filter((f) => f.show !== false);

    return (
        <>
            {visibleFields.map((field) => (
                <FlexBetween key={field.name}>
                    <Field
                        label={field.label}
                        value={
                            field?.getValue ? field.getValue(data[field.name]) : data[field.name]
                        }
                        setValue={(v) => handleChange(v, id, field.name)}
                        type={field.type}
                        extraProp={field.extraProp}
                    />
                </FlexBetween>
            ))}
            <FlexBetween width={"100%"} gap={2} mt={2}>
                <>
                    <Button
                        size="small"
                        fullWidth
                        variant="contained"
                        onClick={() => handleSave(id)}
                        sx={{ color: "white" }}
                    >
                        Save
                    </Button>
                    <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                            color: "red",
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
        </>
    );
};

export const DialogForm = (props) => {
    const { data, fieldsMeta, setClose } = props;
    const id = data[fieldsMeta.primary];

    return (
        <StyledDialog
            open={true}
            onClose={setClose}
            closeIcon={true}
            title={id === "NEW" ? "Create Record" : "Edit Record"}
        >
            <FlexBetween flexDirection={"column"} gap={2} mt={2}>
                <FormView {...props} />
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
    handleCancel: PropTypes.func,
    setClose: PropTypes.func,
};
FormView.propTypes = {
    data: PropTypes.object,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
};

export default FormView;
