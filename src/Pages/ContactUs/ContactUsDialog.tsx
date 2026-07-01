import React from "react";
import { Box, useTheme } from "@mui/material";
import ContactForm from "./ContactForm";
import StyledDialog from "../../core/components/dialogs/StyledDialog";

interface ContactUsDialogProps {
    open: boolean;
    setOpenContactUsForm: () => void;
}

const ContactUsDialog: React.FC<ContactUsDialogProps> = ({ open, setOpenContactUsForm }) => {
    const theme = useTheme();
    return (
        <StyledDialog onClose={setOpenContactUsForm} closeIcon={true} open={open}>
            <Box
                sx={{
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <ContactForm />
            </Box>
        </StyledDialog>
    );
};

export default ContactUsDialog;
