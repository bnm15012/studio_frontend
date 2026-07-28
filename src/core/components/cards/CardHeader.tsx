/** Card header component showing an avatar, primary text, badge chip (with auto-colored status like Active/Pending), and secondary text. */
import React from "react";
import { Chip, Box, Typography, Avatar, useTheme, SxProps, Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import Field from "@/core/components/fields/Field";
import PersonIcon from "@mui/icons-material/Person";

const getBadgeStyles = (badge: React.ReactNode, enabled: boolean | undefined, theme: Theme) => {
    if (!badge) return {};
    if (typeof badge !== "string") {
        const isActive = enabled;
        return {
            backgroundColor: isActive
                ? alpha(theme.palette.success.main, 0.08)
                : alpha(theme.palette.text.secondary, 0.06),
            color: isActive ? theme.palette.success.main : theme.palette.text.secondary,
        };
    }

    const val = badge.toUpperCase();
    if (["ACTIVE", "COMPLETED", "FULLY PAID", "PAID", "YES", "TRUE", "SUCCESS"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.success.main, 0.08),
            color: theme.palette.success.main,
        };
    }
    if (["PENDING", "PENDING PAYMENT", "WARNING", "PARTIAL", "PARTIALLY PAID"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
            color: theme.palette.warning.main,
        };
    }
    if (["INACTIVE", "REJECTED", "FAILED", "EXPIRED", "NO", "FALSE", "CANCELLED"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            color: theme.palette.error.main,
        };
    }

    const isActive = enabled;
    return {
        backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.text.secondary, 0.06),
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    };
};

interface CardHeaderProps {
    enabled?: boolean;
    FieldIcon?: React.ComponentType<Record<string, unknown>>;
    image?: string;
    fieldValue?: string | number;
    badge?: React.ReactNode;
    badgeSx?: SxProps<Theme>;
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
        <FlexBetween alignItems="center" gap={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                {image ? (
                    <Box sx={{ flexShrink: 0 }}>
                        <Field
                            value={image}
                            type="IMAGE"
                            isEdit={false}
                            extraProp={{ size: "36px" }}
                        />
                    </Box>
                ) : (
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                        }}
                    >
                        <FieldIcon sx={{ fontSize: "1.1rem" }} />
                    </Avatar>
                )}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: "0.9375rem",
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.4,
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
                                fontSize: "0.6875rem",
                                lineHeight: 1.3,
                                display: "block",
                                mt: 0.25,
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
                        fontWeight: 500,
                        fontSize: "0.625rem",
                        borderRadius: "8px",
                        textTransform: "capitalize",
                        height: 20,
                        "& .MuiChip-label": {
                            px: 1,
                        },
                        ...computedBadgeStyles,
                        ...badgeSx,
                    }}
                />
            )}
        </FlexBetween>
    );
};

export default CardHeader;
