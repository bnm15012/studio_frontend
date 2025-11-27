import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAlert } from "../utils/Alert";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button, Paper } from "@mui/material";
import Field from "./Fields/Field";
import { StyledFieldItem } from "./Views/FormComponents";
import { FieldLabel, FieldValue } from "./New/StyledField";

const FormBuilder = ({ form, branchId }) => {
    const FORM_SIG = import.meta.env.VITE_APP_FORM_SIG;
    const [formState, setFormState] = useState({ _form_sig: FORM_SIG });
    const [loading, setLoading] = useState(false);
    const showAlert = useAlert();
    const theme = useTheme();
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const initialState = { _form_sig: FORM_SIG };
        form.fields.forEach(({ name, defaultValue }) => {
            if (defaultValue !== undefined) {
                initialState[name] = defaultValue;
            }
        });
        setFormState((prev) => ({ ...initialState, ...prev }));
    }, [FORM_SIG, form]);

    const validateField = (key, value, validation) => {
        if (validation.required && !value) {
            throw Error(key + " field is required");
        }
        if (validation?.regex) {
            const regex = new RegExp(validation.regex);
            if (!regex.test(value)) {
                throw Error(validation.message || "Invalid format");
            }
        }
    };

    const handleChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { _form_sig, ...cleanData } = formState;
            if (_form_sig !== FORM_SIG) {
                showAlert("Invalid form signature", "error");
                return;
            }

            form.fields.forEach(({ name, validation, label }) => {
                validateField(label, formState[name], validation);
            });

            setLoading(true);
            const { success, message } = await form.onSubmit({
                newData: { ...cleanData, branchId: parseInt(branchId) },
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
            showAlert(error?.message || "Failed to save/update student", "error");
        }
        setLoading(false);
    };

    return (
        <Paper
            elevation={8}
            sx={{
                maxWidth: 500,
                margin: "40px auto",
                padding: theme.spacing(5),
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
                borderRadius: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
        >
            {isSubmitted ? (
                <>Form Submitted Successfully </>
            ) : (
                <>
                    <Typography
                        variant="h4"
                        color="primary"
                        gutterBottom
                        sx={{
                            textAlign: "center",
                            fontWeight: 700,
                            letterSpacing: 1,
                            mb: 3,
                        }}
                    >
                        {form.name}
                    </Typography>

                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: theme.spacing(3),
                        }}
                    >
                        <input
                            type="hidden"
                            name="_form_sig"
                            value={formState._form_sig}
                            onChange={(e) => handleChange("_form_sig", e.target.value)}
                        />
                        {form.fields.map((field) => (
                            <StyledFieldItem key={field.name} gap={2}>
                                <FieldLabel>{field.label}</FieldLabel>
                                <FieldValue>
                                    <Field
                                        key={field.name}
                                        value={formState[field.name]}
                                        setValue={(v) => {
                                            handleChange(field.name, v);
                                        }}
                                        type={field.type}
                                        extraProp={field.extraProp}
                                        validation={field.validation}
                                    />
                                </FieldValue>
                            </StyledFieldItem>
                        ))}

                        <Button
                            type="submit"
                            variant="contained"
                            onClick={(e) => handleSubmit(e)}
                            color="primary"
                            disabled={loading}
                            sx={{
                                padding: theme.spacing(1.5),
                                fontWeight: "bold",
                                borderRadius: "16px",
                                fontSize: "1.1rem",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
                                transition: "background 0.3s",
                                "&:hover": {
                                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 60%, ${theme.palette.secondary.dark} 100%)`,
                                },
                            }}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </Box>
                </>
            )}
        </Paper>
    );
};

FormBuilder.propTypes = {
    form: PropTypes.shape({
        name: PropTypes.string.isRequired,
        fields: PropTypes.array.isRequired,
        onSubmit: PropTypes.func.isRequired,
    }).isRequired,
    branchId: PropTypes.number,
};

export default FormBuilder;
