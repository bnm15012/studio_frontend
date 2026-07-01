import { useState } from "react";
import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Mail, Phone, Copy } from "lucide-react";
import { LocationOn } from "@mui/icons-material";
import CardHeader from "../../../core/components/cards/CardHeader";

/**
 * Compact inline info item — icon + value, no label.
 * Used for the phone/location split row.
 */
const InfoItem = ({ icon, value, onClick, sx }) => {
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

InfoItem.propTypes = {
    icon: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
    sx: PropTypes.object,
};

/**
 * Compact email row with copy button.
 */
const EmailRow = ({ email }) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    if (!email) return null;

    const handleCopy = (e) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleClick = (e) => {
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

EmailRow.propTypes = {
    email: PropTypes.string,
};

/**
 * StudentCard — Compact native mobile list item.
 *
 * Layout:
 *   Row 1: Avatar + Name + Status chip
 *   Row 2: 📧 email                        📋
 *   Row 3: 📞 phone           📍 location
 *
 * Actions are rendered by the framework below this component.
 */
const StudentCard = ({ row }) => {
    const { name, email, phone, membershipStatus, imageUrl, address } = row;
    const theme = useTheme();

    const handlePhoneClick = (e) => {
        e.stopPropagation();
        if (phone) window.open(`tel:${phone}`, "_self");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {/* Row 1: Header */}
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={name}
                image={imageUrl}
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

StudentCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dob: PropTypes.string,
        membershipStatus: PropTypes.string,
        address: PropTypes.string,
        emergencyContactNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default StudentCard;
