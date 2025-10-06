import { Button, TextField, useTheme, Box, Typography } from "@mui/material";
import { useState } from "react";
import Loading from "../../Components/Loading/Loading";
import { useAlert } from "../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Auth/auth.api";
import { validatePassword } from "../../utils/validationConstraints";
import PropTypes from "prop-types";
import { closeLastDialog } from "../../state/dialogSlice";

const ChangePassword = ({ user }) => {
    const showAlert = useAlert();
    const theme = useTheme();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const [password, setPassword] = useState("");
    const [repass, setRepass] = useState("");
    const [loading, setLoading] = useState(false);

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
            const { success, message } = await updateProfile({
                dispatch,
                values: { userId: user.userId, email: user.email, password },
                token,
            });
            if (success) {
                showAlert("Password changed successfully!", "success");
                dispatch(closeLastDialog());
            } else {
                showAlert(message || "Failed to change password", "error");
            }
        } catch (error) {
            showAlert(error.message || "Error changing password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Current Email
                </Typography>
                <Typography variant="body1" fontWeight="500">
                    {user.email}
                </Typography>
            </Box>

            <TextField
                variant="outlined"
                label="New Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                fullWidth
            />

            <TextField
                variant="outlined"
                label="Confirm Password"
                required
                type="password"
                value={repass}
                onChange={(e) => setRepass(e.target.value)}
                size="small"
                fullWidth
                error={password !== repass && repass !== ""}
                helperText={password !== repass && repass !== "" ? "Passwords do not match" : ""}
            />

            <Box sx={{ flexGrow: 1 }} />

            <Button
                onClick={handleChangePassword}
                fullWidth
                variant="contained"
                sx={{
                    py: 1,
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                }}
                disabled={loading}
            >
                Change Password
            </Button>

            {loading && <Loading />}
        </Box>
    );
};

ChangePassword.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default ChangePassword;
