import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

/**
 * CardInfoRow
 *
 * A reusable, styled layout element for displaying icon-labeled key-value rows
 * inside listing cards. Replaces duplicate CSS/JSX structures across
 * CardChip, CardLocation, and ContactSection.
 */
const CardInfoRow = ({ Icon, label, value, onClick, action, hoverable = false }) => {
    const theme = useTheme();
    const iconColor = theme.palette.primary.main;
    const isClickable = Boolean(onClick);

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
            {/* Left Icon — inline, no background box */}
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
                            color: iconColor,
                            fontSize: "1.2rem",
                            ...(Icon.props.sx || {}),
                        },
                    })
                ) : (
                    <Icon sx={{ color: iconColor, fontSize: "1.2rem" }} />
                )}
            </Box>

            {/* Middle Text Content */}
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

            {/* Optional Right Action Container */}
            {action && (
                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{action}</Box>
            )}
        </Box>
    );
};

CardInfoRow.propTypes = {
    Icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
    onClick: PropTypes.func,
    action: PropTypes.node,
    hoverable: PropTypes.bool,
};

export default CardInfoRow;
