import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Mail, Phone, Copy } from "lucide-react";
import { LocationOn } from "@mui/icons-material";
import CardHeader from "@/core/components/cards/CardHeader";

interface InfoItemProps {
    icon: React.ReactNode;
    value?: string | number | null;
    onClick?: (e: React.MouseEvent) => void;
    sx?: any;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, value, onClick, sx }) => {
    const theme = useTheme();
    if (!value) return null;

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={0.75}
            sx={{
                minWidth: 0,
                flex: 1,
                cursor: onClick ? "pointer" : "default",
                ...sx,
            }}
            onClick={onClick}
        >
            <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, color: theme.palette.text.secondary }}>
                {icon}
            </Box>
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
                {value}
            </Typography>
        </Box>
    );
};

interface EmailRowProps {
    email?: string | null;
}

const EmailRow: React.FC<EmailRowProps> = ({ email }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    if (!email) return null;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err: any) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`mailto:${email}`, "_self");
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
                <Mail size={16} color={theme.palette.text.secondary} />
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
                    {email}
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

interface StudentCardProps {
    row: {
        name: string;
        imageUrl?: string | null;
        email?: string | null;
        phone?: string | number | null;
        dob?: string | null;
        membershipStatus?: string | null;
        address?: string | null;
        emergencyContactNumber?: string | number | null;
    };
}

const StudentCard: React.FC<StudentCardProps> = ({ row }) => {
    const { name, email, phone, membershipStatus, imageUrl, address } = row;
    const theme = useTheme();

    const handlePhoneClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phone) window.open(`tel:${phone}`, "_self");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {/* Row 1: Header */}
            <CardHeader
                badge={membershipStatus || ""}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={name}
                image={imageUrl || ""}
            />

            {/* Row 2: Email */}
            {email && <EmailRow email={email} />}

            {/* Row 3: Phone + Location (side by side) */}
            {(phone || address) && (
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    sx={{
                        borderTop: email ? `1px solid ${alpha(theme.palette.divider, 0.25)}` : "none",
                        pt: email ? 0.5 : 0,
                    }}
                >
                    {phone && (
                        <InfoItem
                            icon={<Phone size={16} />}
                            value={String(phone)}
                            onClick={handlePhoneClick}
                        />
                    )}
                    {address && (
                        <InfoItem
                            icon={<LocationOn sx={{ fontSize: "1.05rem" }} />}
                            value={address}
                            sx={{ justifyContent: "flex-end", flex: "0 1 auto", maxWidth: "45%" }}
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default StudentCard;
