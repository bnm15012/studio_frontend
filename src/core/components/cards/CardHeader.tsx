import React from "react";
import { Chip, Box, Typography, Avatar, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FlexBetween } from "../layout/FlexBox";
import Field from "../fields/Field";
import PersonIcon from "@mui/icons-material/Person";

const getBadgeStyles = (badge: any, enabled: boolean | undefined, theme: any) => {
    if (!badge) return {};
    if (typeof badge !== "string") {
        const isActive = enabled;
        return {
            backgroundColor: isActive
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.text.secondary, 0.06),
            color: isActive ? theme.palette.success.main : theme.palette.text.secondary,
            border: `1px solid ${isActive ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.text.secondary, 0.1)}`,
        };
    }

    const val = badge.toUpperCase();
    if (["ACTIVE", "COMPLETED", "FULLY PAID", "PAID", "YES", "TRUE", "SUCCESS"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
        };
    }
    if (["PENDING", "PENDING PAYMENT", "WARNING", "PARTIAL", "PARTIALLY PAID"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
        };
    }
    if (["INACTIVE", "REJECTED", "FAILED", "EXPIRED", "NO", "FALSE", "CANCELLED"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
        };
    }

    const isActive = enabled;
    return {
        backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.text.secondary, 0.06),
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.secondary, 0.1)}`,
    };
};

interface CardHeaderProps {
    enabled?: boolean;
    FieldIcon?: React.ComponentType<any>;
    image?: string;
    fieldValue?: string | number;
    badge?: any;
    badgeSx?: any;
    subtitle?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
    enabled,
    FieldIcon = PersonIcon,
    image,
    fieldValue,
    badge,
    badgeSx,
    subtitle,
}) => {
    const theme = useTheme();
    const computedBadgeStyles = getBadgeStyles(badge, enabled, theme);

    return (
        <FlexBetween alignItems="center" gap={1.25}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                {image ? (
                    <Box sx={{ flexShrink: 0 }}>
                        <Field
                            value={image}
                            type="IMAGE"
                            isEdit={false}
                            extraProp={{ size: "40px" }}
                        />
                    </Box>
                ) : (
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                        }}
                    >
                        <FieldIcon sx={{ fontSize: "1.2rem" }} />
                    </Avatar>
                )}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: "1.0625rem",
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.3,
                        }}
                    >
                        {fieldValue}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 400,
                                fontSize: "0.7rem",
                                lineHeight: 1.3,
                                display: "block",
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>
            {badge && (
                <Chip
                    size="small"
                    label={badge}
                    sx={{
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        letterSpacing: "0.02em",
                        height: 22,
                        ...computedBadgeStyles,
                        ...badgeSx,
                    }}
                />
            )}
        </FlexBetween>
    );
};

export default CardHeader;
