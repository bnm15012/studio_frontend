import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const StyledTextField = ({
    value,
    setValue,
    rows = 1,
    placeholder,
    type = "text",
    variant = "standard",
    disabled = "false",
}) => (
    <TextField
        fullWidth
        value={value}
        variant={variant}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        multiline={rows != 1}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
    />
);

StyledTextField.propTypes = {
    value: PropTypes.any.isRequired,
    setValue: PropTypes.func.isRequired,
    rows: PropTypes.number,
    type: PropTypes.string,
    variant: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

export default StyledTextField;
