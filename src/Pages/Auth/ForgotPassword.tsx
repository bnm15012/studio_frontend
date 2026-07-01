import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    FormControl,
    IconButton,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { FlexBetween, FlexEvenlyColumn } from "@/core/components/layout/FlexBox";
import Loading from "@/core/components/loading/Loading";
import { changePasswordApiCall, sendOTPRequest } from "./auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { validatePassword } from "../../utils/validationConstraints.js";
import { closeLastDialog, isDialogOnTop } from "../../state/dialogSlice";

const ForgotPassword = () => {
    const showAlert = useAlert();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repass, setRepass] = useState("");
    const [otp, setOtp] = useState("");
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [OTPToken, setOtpToken] = useState(null);
    const isNonMobileScreens = useMediaQuery("(min-width: 650px)");

    const handleSendOTP = async () => {
        if (!email) {
            showAlert("Please enter an email to send OTP", "warning");
            return;
        }

        try {
            setLoading(true);
            const { success, otpToken, message } = await sendOTPRequest(email);
            if (success) {
                setOtpToken(otpToken);
                setIsOTPSent(true);
                showAlert("OTP sent successfully", "success");
            } else {
                showAlert(message || "Failed to send OTP", "error");
            }
        } catch (error: any) {
            console.error(error);
            showAlert("Error sending OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        const { valid, message } = validatePassword(password);

        if (!valid) {
            showAlert(message);
            return;
        }
        if (password !== repass) {
            showAlert("Passwords do not match. Please enter the same password.", "warning");
            return;
        }
        if (otp.length !== 6) {
            showAlert("Please enter a 6-digit OTP.", "warning");
            return;
        }

        try {
            setLoading(true);
            const { success, message } = await changePasswordApiCall({
                email,
                password,
                otp,
                OTPToken,
            });
            if (success) {
                showAlert("Password changed successfully!", "success");
                dispatch(closeLastDialog());
            } else {
                showAlert(message || "Failed to change password", "error");
            }
        } catch (error: any) {
            showAlert(error.message || "Error changing password", "error");
        } finally {
            setLoading(false);
            setIsOTPSent(false);
        }
    };

    return (
        <Dialog
            open={useAppSelector(isDialogOnTop("forgotPassDialog"))}
            onClose={() => {
                dispatch(closeLastDialog());
            }}
        >
            <DialogTitle sx={{ paddingBottom: 1 }}>
                <FlexBetween>
                    <Box>Reset Your Password</Box>
                    <IconButton onClick={() => dispatch(closeLastDialog())}>
                        <CloseIcon />
                    </IconButton>
                </FlexBetween>
            </DialogTitle>
            <FlexEvenlyColumn
                sx={{
                    padding: "10px",
                    minWidth: isNonMobileScreens ? "30rem" : "80vw",
                    minHeight: "8rem",
                }}
            >
                <FormControl>
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Email"
                        type="email"
                        required
                        disabled={isOTPSent}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            marginBottom: "6px",
                            marginTop: "6px",
                        }}
                    />
                    {!isOTPSent && (
                        <Button
                            onClick={handleSendOTP}
                            sx={{
                                mt: 1,
                                p: 1,
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.background.alt,
                                "&:hover": { color: theme.palette.primary.main },
                            }}
                            disabled={loading}
                        >
                            Send OTP
                        </Button>
                    )}
                </FormControl>

                {isOTPSent && (
                    <Box width="100%">
                        <TextField
                            variant="standard"
                            label="OTP"
                            required
                            slotProps={{
                                htmlInput: {
                                    minLength: 6,
                                    maxLength: 6,
                                },
                            }}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={{
                                my: 1,
                                width: "100%",
                            }}
                        />
                        <TextField
                            variant="standard"
                            label="New Password"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                my: 1,
                                width: "100%",
                            }}
                        />
                        <TextField
                            variant="standard"
                            label="Confirm Password"
                            required
                            type="password"
                            value={repass}
                            onChange={(e) => setRepass(e.target.value)}
                            sx={{
                                my: 1,
                                width: "100%",
                            }}
                            error={password !== repass && repass !== ""}
                            helperText={
                                password !== repass && repass !== "" ? "Passwords do not match" : ""
                            }
                        />
                        <Button
                            onClick={handleChangePassword}
                            fullWidth
                            sx={{
                                mt: 2,
                                p: 1,
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.background.alt,
                                "&:hover": { color: theme.palette.primary.main },
                            }}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </Box>
                )}
            </FlexEvenlyColumn>

            {loading && <Loading />}
        </Dialog>
    );
};

export default ForgotPassword;
