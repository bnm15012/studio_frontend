import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useAppDispatch } from "@/state";
import { closeLastDialog, openDialog } from "../../state/dialogSlice.js";
import FormFields from "./FormFields";
import type { FormFieldsValues } from "./FormFields";
import { loginApiCall, registerApiCall } from "./auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { FlexBetween, FlexEvenly } from "@/core/components/layout/FlexBox";
import { User } from "@/api/types.js";
import { setAuthLoading } from "@/state/authSlice.js";

interface FormProps {
    pageType: "Login" | "Register";
    editProfile?: boolean;
    user?: User;
}

const Form: React.FC<FormProps> = ({ pageType, editProfile = false, user }) => {
    const initialValuesRegister = {
        studioName: "",
        location: "",
        userName: "",
        email: "",
        contactDetails: "",
        address: "",
        state: "",
        pincode: "",
    };
    const initialValuesLogin = {
        userName: "",
        password: "",
    };

    const { palette } = useTheme();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const isLogin = pageType === "Login";
    const isRegister = pageType === "Register";
    const [values, setValues] = useState<Record<string, unknown>>(
        isLogin
            ? initialValuesLogin
            : editProfile
              ? (user ?? initialValuesRegister)
              : initialValuesRegister,
    );

    const showAlert = useAlert();

    const onChangehandle = (val: string, name: string) => {
        setValues({ ...values, [name]: val });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isLogin) {
                dispatch(setAuthLoading({ loading: true }));
                const response = await loginApiCall({ values, dispatch });
                if (!response.success) {
                    showAlert(response.message, "error");
                }
            } else {
                const { success, message } = await registerApiCall(values);
                if (success) {
                    showAlert(message, "success");
                    dispatch(closeLastDialog());
                } else {
                    showAlert(message || "Failed to register!", "error");
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            showAlert(message, "error");
        } finally {
            if (isLogin) {
                setTimeout(() => {
                    dispatch(setAuthLoading({ loading: false }));
                }, 600);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) setValues(user);
    }, [user]);

    return (
        <>
            <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
                <>
                    <Box fontWeight={"bold"} fontSize={"1.5rem"} color={palette.primary.main}>
                        {isLogin ? "Login" : !editProfile ? "Sign up" : "Update"}
                    </Box>
                    <FormFields
                        onChangehandle={onChangehandle}
                        values={values as FormFieldsValues}
                        isRegister={isRegister}
                        isLogin={isLogin}
                    />
                </>
                <FlexEvenly>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            m: "1rem 0 0.5rem 0",
                            p: "1rem",
                            "&:hover": { color: palette.primary.dark },
                        }}
                    >
                        {isLogin ? "LOGIN" : editProfile ? "Save Changes" : "REGISTER"}
                    </Button>
                </FlexEvenly>

                {isLogin && (
                    <FlexBetween flexWrap={"wrap"} gap={2} mt={1}>
                        <Typography
                            onClick={() => {
                                dispatch(openDialog("signupDialog"));
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            Sign up
                        </Typography>
                        <Typography
                            onClick={() => {
                                dispatch(openDialog("forgotPassDialog"));
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            Forgot Password?
                        </Typography>
                        <Box flexGrow={1}></Box>
                    </FlexBetween>
                )}
            </form>
        </>
    );
};

export default Form;
