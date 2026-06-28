import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

/**
 * CardInfoRow
 *
 * Reusable icon + value row for listing cards.
 *
 * Modes:
 *   - Default: icon + label (small) + value (below label)
 *   - Compact (compact=true): icon + value only, single line, no label — for native mobile list items
 */
const CardInfoRow = ({ Icon, label, value, onClick, action, hoverable = false, compact = false }) => {
    const theme = useTheme();
    const iconColor = theme.palette.text.secondary;
    const isClickable = Boolean(onClick);

    if (compact) {
        return (
            <Box
                display="flex"
                alignItems="center"
                gap={0.75}
                sx={{
                    minWidth: 0,
                    flex: 1,
                    cursor: isClickable ? "pointer" : "default",
                }}
                onClick={onClick}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {React.isValidElement(Icon) ? (
                        React.cloneElement(Icon, {
                            sx: {
                                color: iconColor,
                                fontSize: "1rem",
                                ...(Icon.props.sx || {}),
                            },
                        })
                    ) : (
                        <Icon sx={{ color: iconColor, fontSize: "1rem" }} />
                    )}
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.primary",
                        fontWeight: 450,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.8125rem",
                        lineHeight: 1.4,
                    }}
                >
                    {value}
                </Typography>
                {action && (
                    <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", ml: "auto" }}>
                        {action}
                    </Box>
                )}
            </Box>
        );
    }

    // Default (non-compact) mode — label + value stacked
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
                py: 0.75,
                px: 0.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                transition: "background-color 0.2s ease",
                "&:last-of-type": {
                    borderBottom: "none",
                },
                ...(hoverable && {
                    "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: "8px",
                    },
                }),
            }}
        >
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: isClickable ? "pointer" : "default",
                }}
                onClick={onClick}
            >
                {React.isValidElement(Icon) ? (
                    React.cloneElement(Icon, {
                        sx: {
                            color: theme.palette.primary.main,
                            fontSize: "1.2rem",
                            ...(Icon.props.sx || {}),
                        },
                    })
                ) : (
                    <Icon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                )}
            </Box>

            <Box
                flexGrow={1}
                sx={{
                    minWidth: 0,
                    cursor: isClickable ? "pointer" : "default",
                }}
                onClick={onClick}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.7rem",
                        lineHeight: 1,
                    }}
                >
                    {label}
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
                        fontSize: "0.875rem",
                    }}
                >
                    {value}
                </Typography>
            </Box>

            {action && (
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{action}</Box>
            )}
        </Box>
    );
};

CardInfoRow.propTypes = {
    Icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]).isRequired,
    label: PropTypes.string,
    value: PropTypes.node,
    onClick: PropTypes.func,
    action: PropTypes.node,
    hoverable: PropTypes.bool,
    compact: PropTypes.bool,
};

export default CardInfoRow;
