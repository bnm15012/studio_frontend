/** Confirmation dialog for email/mobile input before sending a PDF, with validation error display. */
import React from "react";
import { Box, Typography } from "@mui/material";
import StyledDialog from "@/core/components/dialogs/StyledDialog";

interface ConfirmationDialogProps {
    type: "email" | "mobile" | string;
    value?: string;
    error?: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    disabled?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    type,
    value,
    error,
    open,
    onClose,
    onConfirm,
    disabled,
}) => (
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
