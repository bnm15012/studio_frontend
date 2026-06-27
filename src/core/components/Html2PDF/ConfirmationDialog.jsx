import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import StyledDialog from "../StyledDialog";

export const ConfirmationDialog = ({ type, value, error, open, onClose, onConfirm, disabled }) => (
    <StyledDialog
        title={type === "email" ? "Confirm Email Address" : "Confirm Mobile Number"}
        open={open}
        onConfirm={onConfirm}
        confirmDisabled={disabled}
        onClose={onClose}
    >
        <Box textAlign="center">
            <Typography color="red">
                {type === "email"
                    ? !value && "Email passcode not configured!"
                    : !value && "Please configure WhatsApp Session First"}
            </Typography>

            <Typography sx={{ mt: 2 }}>{value}</Typography>

            {error && (
                <Typography color="red" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
        </Box>
    </StyledDialog>
);

ConfirmationDialog.propTypes = {
    type: PropTypes.oneOf(["email", "mobile"]).isRequired,
    value: PropTypes.string,
    error: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
