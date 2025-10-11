import { useState } from "react";
import { Box, Typography, IconButton, Tooltip, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Phone, Copy } from "lucide-react";
import PropTypes from "prop-types";

// Main Component
const ContactSection = ({ contact }) => {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleCall = () => {
        if (contact) {
            window.open(`tel:${contact}`, "_self");
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Avatar
                sx={{
                    bgcolor: theme.palette.secondary.main + "20",
                    color: theme.palette.secondary.main,
                    height: 40,
                    width: 40,
                }}
            >
                <Phone onClick={handleCall} size={18} />
            </Avatar>
            <Box flexGrow={1}>
                <Typography variant="body2" fontWeight={500}>
                    {contact}
                </Typography>
            </Box>
            <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
                <IconButton size="small" onClick={handleCopy}>
                    <Copy size={16} color="#1976d2" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

ContactSection.propTypes = {
    contact: PropTypes.string.isRequired,
};

export default ContactSection;
