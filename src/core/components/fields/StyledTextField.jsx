import { useState, useEffect } from "react";
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
    validation = {},
    readOnly = false,
    sx,
}) => {
    const [error, setError] = useState("");

    useEffect(() => {
        if (!validation || (!validation.required && !value)) {
            setError("");
            return;
        }

        if (validation.required && !value) {
            setError("This field is required");
        } else if (validation.regex && !validation.regex.test(value)) {
            setError(validation.message || "Invalid format");
        } else if (validation.minLength && value.length < validation.minLength) {
            setError(`Minimum ${validation.minLength} characters required`);
        } else if (validation.maxLength && value.length > validation.maxLength) {
            setError(`Maximum ${validation.maxLength} characters allowed`);
        } else {
            setError("");
        }
    }, [value, validation]);

    return (
        <TextField
            fullWidth
            value={value}
            variant={variant}
            label={label}
            onChange={(e) => setValue(e.target.value)}
            type={type}
            multiline={rows !== 1}
            rows={rows}
            placeholder={placeholder}
            disabled={readOnly}
            error={Boolean(error)}
            helperText={error}
            sx={sx}
        />
    );
};

StyledTextField.propTypes = {
    value: PropTypes.any,
    setValue: PropTypes.func.isRequired,
    label: PropTypes.string,
    rows: PropTypes.number,
    type: PropTypes.string,
    variant: PropTypes.string,
    validation: PropTypes.shape({
        required: PropTypes.bool,
        regex: PropTypes.instanceOf(RegExp),
        message: PropTypes.string, // message for regex
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
    }),
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    sx: PropTypes.object,
};

export default StyledTextField;
