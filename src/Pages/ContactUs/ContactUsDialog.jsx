import {
    Box,
    IconButton,
    Dialog,
    useTheme,
} from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import ContactForm from "./ContactForm";
import { Close } from "@mui/icons-material";

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
                    <Close />
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

export default ContactUsDialog;
