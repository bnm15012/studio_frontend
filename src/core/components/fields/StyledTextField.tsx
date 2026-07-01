import React, { useState, useEffect } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface ValidationRules {
    required?: boolean;
    regex?: RegExp;
    message?: string;
    minLength?: number;
    maxLength?: number;
}

interface StyledTextFieldProps {
    value?: string;
    setValue: (val: string) => void;
    rows?: number;
    label?: string;
    placeholder?: string;
    type?: string;
    variant?: "standard" | "outlined" | "filled";
    validation?: ValidationRules;
    readOnly?: boolean;
    sx?: SxProps<Theme>;
}

const StyledTextField: React.FC<StyledTextFieldProps> = ({
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
    const [error, setError] = useState<string>("");

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

export default StyledTextField;
