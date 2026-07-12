/** Contact info row with phone/email display, copy-to-clipboard, and long-press to call/email via useLongPress. */
import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Phone, Copy, Mail } from "lucide-react";
import { useLongPress } from "@/core/hooks/useLongPress";

interface ContactSectionProps {
    contact: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();
    const isEmail = contact.includes("@");
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(contact);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err: unknown) {
            console.error("Failed to copy:", err);
        }
    };

    const longPressHandler = useLongPress(
        (e: React.MouseEvent | React.TouchEvent) => {
            e.stopPropagation();
            if (!contact) return;
            const link = isEmail ? `mailto:${contact}` : `tel:${contact}`;
            window.open(link, "_self");
        },
        { delay: 700 },
    );

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={0.75}
            sx={{ minHeight: 0, maxWidth: "fit-content" }}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={0.75}
                sx={{ minWidth: 0, flex: 1, cursor: "pointer", py: 0.25 }}
                {...longPressHandler}
            >
                {isEmail ? (
                    <Mail size={15} color={theme.palette.text.secondary} />
                ) : (
                    <Phone size={15} color={theme.palette.text.secondary} />
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
                    <Copy size={12} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ContactSection;
