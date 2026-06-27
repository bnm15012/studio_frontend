import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";

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
                p: 1,
                borderRadius: "8px",
                backgroundColor:
                    theme.palette.background.alt || alpha(theme.palette.primary.main, 0.02),
                transition: "background-color 0.2s ease",
                ...(hoverable && {
                    "&:hover": {
                        backgroundColor:
                            theme.palette.action.hover || alpha(theme.palette.primary.main, 0.06),
                    },
                }),
            }}
        >
            {/* Left Icon Container */}
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: isClickable ? "pointer" : "default",
                }}
                onClick={onClick}
            >
                {typeof Icon === "function" || typeof Icon === "object" ? (
                    <Icon sx={{ color: iconColor, fontSize: "1.1rem" }} />
                ) : (
                    Icon
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
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
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
