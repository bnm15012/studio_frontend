import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Phone, Copy, Mail } from "lucide-react";

/**
 * ContactSection — Compact inline email/phone display.
 * Icon + value + optional copy button. No label.
 */
interface ContactSectionProps {
    contact?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    if (!contact) return null;

    const isEmail = contact.includes("@");

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!contact) return;
        const link = isEmail ? `mailto:${contact}` : `tel:${contact}`;
        window.open(link, "_self");
    };

    return (
        <Box display="flex" alignItems="center" gap={0.75}>
            <Box
                display="flex"
                alignItems="center"
                gap={0.75}
                sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                onClick={handleClick}
            >
                {isEmail ? (
                    <Mail size={16} color={theme.palette.text.secondary} />
                ) : (
                    <Phone size={16} color={theme.palette.text.secondary} />
                )}
                <Typography
                    sx={{
                        fontSize: "0.8125rem",
                        fontWeight: 450,
                        color: "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.4,
                    }}
                >
                    {contact}
                </Typography>
            </Box>
            <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
                <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{
                        p: 0.5,
                        color: theme.palette.text.secondary,
                        "&:hover": { color: theme.palette.primary.main },
                    }}
                >
                    <Copy size={13} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ContactSection;
