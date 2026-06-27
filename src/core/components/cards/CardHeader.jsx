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
                ? alpha(theme.palette.success.main, 0.12)
                : alpha(theme.palette.text.secondary, 0.08),
            color: isActive ? theme.palette.success.main : theme.palette.text.secondary,
            border: `1px solid ${isActive ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.text.secondary, 0.12)}`,
        };
    }

    const val = badge.toUpperCase();
    if (["ACTIVE", "COMPLETED", "FULLY PAID", "PAID", "YES", "TRUE", "SUCCESS"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.main,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        };
    }
    if (["PENDING", "PENDING PAYMENT", "WARNING", "PARTIAL", "PARTIALLY PAID"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.warning.main, 0.12),
            color: theme.palette.warning.main,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        };
    }
    if (["INACTIVE", "REJECTED", "FAILED", "EXPIRED", "NO", "FALSE", "CANCELLED"].includes(val)) {
        return {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            color: theme.palette.error.main,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        };
    }

    const isActive = enabled;
    return {
        backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.text.secondary, 0.08),
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.text.secondary, 0.12)}`,
    };
};

const CardHeader = ({ enabled, FieldIcon = PersonIcon, image, fieldValue, badge, badgeSx }) => {
    const theme = useTheme();
    const computedBadgeStyles = getBadgeStyles(badge, enabled, theme);

    return (
        <Box sx={{ width: "100%", pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <FlexBetween alignItems="center" gap={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
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
                            <FieldIcon sx={{ fontSize: "1.25rem" }} />
                        </Avatar>
                    )}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {fieldValue}
                    </Typography>
                </Box>
                {badge && (
                    <Chip
                        size="small"
                        label={badge}
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
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
};
export default CardHeader;
