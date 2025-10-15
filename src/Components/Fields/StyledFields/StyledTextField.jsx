import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const StyledTextField = ({
    value,
    setValue,
    rows = 1,
    label,
    placeholder,
    type = "text",
    variant = "standard",
    readOnly = false,
}) => (
    <TextField
        fullWidth
        value={value}
        variant={variant}
        label={label}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        multiline={rows != 1}
        rows={rows}
        placeholder={placeholder}
        disabled={readOnly}
    />
);

StyledTextField.propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    rows: PropTypes.number,
    type: PropTypes.string,
    variant: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
};

export default StyledTextField;
