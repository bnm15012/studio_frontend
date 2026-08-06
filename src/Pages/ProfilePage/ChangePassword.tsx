import { useAppDispatch, useAppSelector } from "@/state";
import React, { useState } from "react";
import {
    Button,
    TextField,
    useTheme,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
    alpha,
} from "@mui/material";
import {
    LockReset as LockResetIcon,
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Shield as ShieldIcon,
} from "@mui/icons-material";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import { useAlert } from "@/core/components/feedback/Alert";
import { updateProfile } from "@/Pages/Auth/auth.api";
import { validatePassword } from "@/core/utils/validationConstraints";
import { closeLastDialog } from "@/state/dialogSlice";
import type { User } from "@/api/types";

interface ChangePasswordProps {
    user: User;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ user }) => {
    const showAlert = useAlert();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    const [password, setPassword] = useState("");
    const [repass, setRepass] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showRepass, setShowRepass] = useState(false);

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

        try {
            setLoading(true);
            const { success, message: responseMessage } = await updateProfile({
                dispatch,
                values: { userId: user.userId, email: user.email, password },
                token: token!,
            });
            if (success) {
                showAlert("Password changed successfully!", "success");
                dispatch(closeLastDialog());
            } else {
                showAlert(responseMessage || "Failed to change password", "error");
            }
        } catch (error) {
            showAlert(error instanceof Error ? error.message : "Error changing password", "error");
        } finally {
            setLoading(false);
        }
    };

    const mismatch = password !== repass && repass !== "";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <TopProgressBar loading={loading} />

            {/* Header Banner */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2.5,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.07),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        flexShrink: 0,
                    }}
                >
                    <ShieldIcon sx={{ color: "primary.main", fontSize: 22 }} />
                </Box>
                <Box>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                        Security — Change Password
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Choose a strong password to keep your account safe.
                    </Typography>
                </Box>
            </Box>

            {/* Current account */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    mb: 2.5,
                    borderRadius: 1.5,
                    bgcolor: theme.palette.action.hover,
                }}
            >
                <EmailIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Account
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {user.email}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    variant="outlined"
                    label="New Password"
                    required
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setShowPass((p) => !p)}
                                    edge="end"
                                >
                                    {showPass ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    variant="outlined"
                    label="Confirm Password"
                    required
                    type={showRepass ? "text" : "password"}
                    value={repass}
                    onChange={(e) => setRepass(e.target.value)}
                    size="small"
                    fullWidth
                    error={mismatch}
                    helperText={mismatch ? "Passwords do not match" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setShowRepass((p) => !p)}
                                    edge="end"
                                >
                                    {showRepass ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Button
                onClick={handleChangePassword}
                fullWidth
                variant="contained"
                startIcon={<LockResetIcon />}
                disabled={loading || !password || !repass || mismatch}
                sx={{
                    mt: 3,
                    py: 1.25,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    borderRadius: 2,
                }}
            >
                {loading ? "Updating…" : "Update Password"}
            </Button>
        </Box>
    );
};

export default ChangePassword;
