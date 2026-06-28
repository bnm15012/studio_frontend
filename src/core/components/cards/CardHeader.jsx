import { Chip, Box, Typography, Avatar, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FlexBetween } from "../layout/FlexBox";
import Field from "../fields/Field";
import PersonIcon from "@mui/icons-material/Person";

const getBadgeStyles = (badge, enabled, theme) => {
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

const CardHeader = ({ enabled, FieldIcon = PersonIcon, image, fieldValue, badge, badgeSx, subtitle }) => {
    const theme = useTheme();
    const computedBadgeStyles = getBadgeStyles(badge, enabled, theme);

    return (
        <Box sx={{ width: "100%", pb: 1.5, mb: 0.5 }}>
            <FlexBetween alignItems="flex-start" gap={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                    {image ? (
                        <Box sx={{ flexShrink: 0 }}>
                            <Field
                                value={image}
                                type="IMAGE"
                                isEdit={false}
                                extraProp={{ size: "48px" }}
                            />
                        </Box>
                    ) : (
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.main,
                                flexShrink: 0,
                                fontSize: "1.25rem",
                            }}
                        >
                            <FieldIcon sx={{ fontSize: "1.4rem" }} />
                        </Avatar>
                    )}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "1.125rem",
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
                                    fontSize: "0.75rem",
                                    lineHeight: 1.4,
                                    mt: 0.25,
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
                            fontSize: "0.65rem",
                            borderRadius: "12px",
                            textTransform: "capitalize",
                            letterSpacing: "0.02em",
                            height: 24,
                            mt: 0.5,
                            ...computedBadgeStyles,
                            ...badgeSx,
                        }}
                    />
                )}
            </FlexBetween>
        </Box>
    );
};

CardHeader.propTypes = {
    FieldIcon: PropTypes.elementType,
    badgeSx: PropTypes.object,
    fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
    enabled: PropTypes.bool,
    subtitle: PropTypes.string,
};
export default CardHeader;
