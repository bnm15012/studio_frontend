import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Phone, Copy } from "lucide-react";
import PropTypes from "prop-types";

// Main Component
const ContactSection = ({ contact }) => {
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
            <Box
                sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Phone onClick={handleCall} size={18} />
            </Box>
            <Box flexGrow={1} onClick={handleCall} sx={{ cursor: "pointer" }}>
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
