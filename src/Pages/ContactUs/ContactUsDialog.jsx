import {
    Box,
    IconButton,
    Dialog,
    useTheme,
} from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import ContactForm from "./ContactForm";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const ContactUsDialog = ({ open, setOpenContactUsForm }) => {
    const theme = useTheme();
    return (
        <Dialog open={open}>
            <FlexBetween>
                <Box></Box>
                <IconButton
                    onClick={() => {
                        setOpenContactUsForm(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </FlexBetween>
            <Box
                sx={{
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <ContactForm />
            </Box>
        </Dialog>
    );
};
ContactUsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpenContactUsForm: PropTypes.func.isRequired,
};

export default ContactUsDialog;
