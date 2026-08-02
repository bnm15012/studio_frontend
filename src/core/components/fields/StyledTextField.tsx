/** Styled MUI TextField with built-in validation (required, regex, min/max length) and error display. */
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface ValidationRules {
    required?: boolean | undefined;
    regex?: RegExp | undefined;
    message?: string | undefined;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    [key: string]: unknown;
}

export interface StyledTextFieldProps {
    value?: string | undefined;
    setValue: (val: string) => void;
    rows?: number | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    type?: string | undefined;
    variant?: "standard" | "outlined" | "filled" | undefined;
    validation?: ValidationRules | undefined;
    readOnly?: boolean | undefined;
    sx?: SxProps<Theme> | undefined;
    submitAttempted?: boolean | undefined;
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
    submitAttempted = false,
}) => {
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!submitAttempted) {
            setError("");
            return;
        }

        if (!validation || (!validation.required && !value)) {
            setError("");
            return;
        }

        if (validation.required && !value) {
            setError("This field is required");
        } else if (validation.regex && !validation.regex.test(value ?? "")) {
            setError(validation.message || "Invalid format");
        } else if (validation.minLength && (value ?? "").length < validation.minLength) {
            setError(`Minimum ${validation.minLength} characters required`);
        } else if (validation.maxLength && (value ?? "").length > validation.maxLength) {
            setError(`Maximum ${validation.maxLength} characters allowed`);
        } else {
            setError("");
        }
    }, [value, validation, submitAttempted]);

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
