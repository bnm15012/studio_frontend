import { useState } from "react";
import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Phone, Copy, Mail } from "lucide-react";
import PropTypes from "prop-types";

const ContactSection = ({ contact }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    const isEmail = contact.includes("@");

    const handleCopy = (e) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (!contact) return;
        const link = isEmail ? `mailto:${contact}` : `tel:${contact}`;
        window.open(link, "_self");
    };

    const iconColor = theme.palette.primary.main;
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
                p: 1,
                borderRadius: "8px",
                backgroundColor: theme.palette.background.alt || alpha(theme.palette.primary.main, 0.02),
                transition: "background-color 0.2s ease",
                "&:hover": {
                    backgroundColor: theme.palette.action.hover || alpha(theme.palette.primary.main, 0.06),
                }
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
                onClick={handleClick}
            >
                {isEmail ? <Mail size={16} color={iconColor} /> : <Phone size={16} color={iconColor} />}
            </Box>
            <Box flexGrow={1} onClick={handleClick} sx={{ cursor: "pointer", minWidth: 0 }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        lineHeight: 1,
                    }}
                >
                    {isEmail ? "Email" : "Phone"}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.primary",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mt: 0.25,
                    }}
                >
                    {contact}
                </Typography>
            </Box>
            <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
                <IconButton size="small" onClick={handleCopy} sx={{ color: theme.palette.primary.main }}>
                    <Copy size={14} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

ContactSection.propTypes = {
    contact: PropTypes.string.isRequired,
};

export default ContactSection;
