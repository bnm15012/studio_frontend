import { Box, useTheme } from "@mui/material";
import ContactForm from "./ContactForm";
import PropTypes from "prop-types";
import StyledDialog from "../../Components/New/StyledDialog";

const ContactUsDialog = ({ open, setOpenContactUsForm }) => {
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
ContactUsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpenContactUsForm: PropTypes.func.isRequired,
};

export default ContactUsDialog;
