/** Dynamic form builder that renders fields from a FieldDef[] config with submit/cancel buttons, validation, and styled layout. */
import React, { useEffect, useState } from "react";
import { useAlert } from "@/core/components/feedback/Alert";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Typography, Button, Paper, Grid, Divider } from "@mui/material";
import Field from "@/core/components/fields/Field";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import { resolveFieldValue, bindGetOptions } from "@/core/utils/fieldHelpers";
import { FieldDef, FieldValue } from "@/core/types";
import type { ValidationRules } from "@/core/components/fields/StyledTextField";

// ==============================
// Styled Components
// ==============================

const FormContainer = styled(Paper)(({ theme }) => ({
    width: "100%",
    maxWidth: 900,
    margin: "32px auto",
    padding: theme.spacing(4),
    borderRadius: 24,
    overflow: "hidden",

    background:
        theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.alt} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.odd} 100%)`,

    border: `1px solid ${theme.palette.divider}`,

    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",

    [theme.breakpoints.down("sm")]: {
        margin: "12px auto",
        padding: theme.spacing(2.5),
        borderRadius: 18,
    },
}));

const SectionContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(5),

    "&:first-of-type": {
        marginTop: theme.spacing(2),
    },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: "1.15rem",
    fontWeight: 800,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
}));

const FieldWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
    fontSize: "0.82rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: theme.palette.text.secondary,

    display: "flex",
    alignItems: "center",
    gap: 4,

    "& .required": {
        color: theme.palette.error.main,
    },
}));

const FieldContainer = styled(Box)(({ theme }) => ({
    width: "100%",

    "& .MuiOutlinedInput-root, & .MuiInputBase-root": {
        borderRadius: 14,
        transition: "all 0.2s ease",

        background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",

        "& fieldset": {
            borderColor: theme.palette.divider,
        },

        "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
        },

        "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: theme.palette.primary.main,
        },
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    borderRadius: 16,
    padding: theme.spacing(1.5, 4),
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",

    background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,

    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",

    "&:hover": {
        transform: "translateY(-1px)",
    },

    [theme.breakpoints.down("sm")]: {
        width: "100%",
    },
}));

// ==============================
// Component
// ==============================

interface FormBuilderProps {
    form: {
        name: string;
        fields: FieldDef[];
        onSubmit: (arg: {
            newData: Record<string, FieldValue>;
            formSignature: string;
        }) => Promise<{ success: boolean; message: string }>;
    };
    branchId?: string | number;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form, branchId }) => {
    const FORM_SIG = import.meta.env.VITE_APP_FORM_SIG || "";

    const theme = useTheme();
    const showAlert = useAlert();

    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formState, setFormState] = useState<Record<string, FieldValue>>({
        _form_sig: FORM_SIG,
    });

    // ==============================
    // Group Fields By Section
    // ==============================

    const sectionMap: Record<string, FieldDef[]> = {};

    form.fields.forEach((field) => {
        const section = field.section || "General Information";

        if (!sectionMap[section]) {
            sectionMap[section] = [];
        }

        sectionMap[section].push(field);
    });

    // ==============================
    // Initial Values
    // ==============================

    useEffect(() => {
        const initialState: Record<string, FieldValue> = {
            _form_sig: FORM_SIG,
        };

        form.fields.forEach(({ name, defaultValue }) => {
            if (defaultValue !== undefined) {
                initialState[name] = defaultValue;
            }
        });

        setFormState((prev: Record<string, FieldValue>) => ({
            ...initialState,
            ...prev,
        }));
    }, [FORM_SIG, form]);

    // ==============================
    // Validation
    // ==============================

    const validateField = (
        label: string,
        value: FieldValue,
        validation:
            | {
                  required?: boolean;
                  regex?: string | RegExp;
                  message?: string;
              }
            | undefined,
    ) => {
        if (validation?.required && (value === undefined || value === null || value === "")) {
            throw Error(`${label} is required`);
        }

        if (validation?.regex) {
            const regex = new RegExp(validation.regex);

            if (!regex.test(String(value ?? ""))) {
                throw Error(validation?.message || `Invalid ${label}`);
            }
        }
    };

    // ==============================
    // Change Handler
    // ==============================

    const handleChange = (key: string, value: FieldValue) => {
        setFormState((prev: Record<string, FieldValue>) => ({
            ...prev,
            [key]: value,
        }));
    };

    // ==============================
    // Submit
    // ==============================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { _form_sig, ...cleanData } = formState;

            if (_form_sig !== FORM_SIG) {
                showAlert("Invalid form signature", "error");
                return;
            }

            // Validate all fields
            form.fields.forEach(({ name, validation, label }) => {
                validateField(label || name, formState[name], validation);
            });

            setLoading(true);

            const { success, message } = await form.onSubmit({
                newData: {
                    ...cleanData,
                    branchId: branchId ? parseInt(String(branchId)) : undefined,
                },
                formSignature: FORM_SIG,
            });

            if (success) {
                setIsSubmitted(true);
                showAlert(message, "success");
            } else {
                showAlert(message, "error");
            }
        } catch (error) {
            console.error(error);

            showAlert(error instanceof Error ? error.message : "Failed to submit form", "error");
        }

        setLoading(false);
    };

    // ==============================
    // Success State
    // ==============================

    if (isSubmitted) {
        return (
            <FormContainer elevation={0}>
                <Box
                    sx={{
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 2,
                    }}
                >
                    <CheckCircleIcon
                        sx={{
                            fontSize: "5rem",
                            color: theme.palette.success.main,
                        }}
                    />

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        Form Submitted Successfully
                    </Typography>

                    <Typography color="text.secondary">Your response has been recorded.</Typography>
                </Box>
            </FormContainer>
        );
    }

    // ==============================
    // Render
    // ==============================

    return (
        <FormContainer elevation={0}>
            {/* Header */}
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    mb: 1,

                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                {form.name}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: "center",
                    mb: 4,
                }}
            >
                Please fill in the required details.
            </Typography>

            {/* Form */}
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <input type="hidden" name="_form_sig" value={String(formState._form_sig ?? "")} />

                {/* Sections */}
                {Object.entries(sectionMap).map(([sectionName, fields]) => (
                    <SectionContainer key={sectionName}>
                        <SectionHeader>
                            <SectionTitle>{sectionName}</SectionTitle>

                            <Divider />
                        </SectionHeader>

                        <Grid container spacing={3}>
                            {fields.map((field) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={field.type === "TEXTAREA" ? 12 : 6}
                                    key={field.name}
                                >
                                    <FieldWrapper>
                                        <FieldLabel>
                                            {field.label}

                                            {field.validation?.required && (
                                                <span className="required">*</span>
                                            )}
                                        </FieldLabel>

                                        <FieldContainer>
                                            <Field
                                                isEdit={
                                                    field.editable
                                                        ? field.editable(formState)
                                                        : true
                                                }
                                                value={resolveFieldValue(field, formState, true)}
                                                setValue={(v) => {
                                                    handleChange(field.name, v);
                                                }}
                                                type={field.type}
                                                extraProp={bindGetOptions(field, formState)}
                                                validation={
                                                    field.validation as ValidationRules | undefined
                                                }
                                            />
                                        </FieldContainer>
                                    </FieldWrapper>
                                </Grid>
                            ))}
                        </Grid>
                    </SectionContainer>
                ))}

                {/* Submit */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 6,
                        pt: 3,
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <SubmitButton
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        endIcon={<SendIcon />}
                    >
                        {loading ? "Submitting..." : "Submit Form"}
                    </SubmitButton>
                </Box>
            </Box>
        </FormContainer>
    );
};

export default FormBuilder;
