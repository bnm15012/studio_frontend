import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Phone, Copy, Mail } from "lucide-react";
import PropTypes from "prop-types";

const ContactSection = ({ contact }) => {
    const [copied, setCopied] = useState(false);

    const isEmail = contact.includes("@");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = () => {
        if (!contact) return;
        const link = isEmail ? `mailto:${contact}` : `tel:${contact}`;
        window.open(link, "_self");
    };
    const iconProps = { fontSize: "small", color: "blue" };
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
                onClick={handleClick}
            >
                {isEmail ? <Mail {...iconProps} /> : <Phone {...iconProps} />}
            </Box>
            <Box flexGrow={1} onClick={handleClick} sx={{ cursor: "pointer" }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    {isEmail ? "Email" : "Phone"}
                </Typography>
                <Typography variant="body2" color="text.primary" textOverflow={"ellipsis"}>
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
