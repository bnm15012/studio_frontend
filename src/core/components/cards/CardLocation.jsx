import { LocationOn } from "@mui/icons-material";
import PropTypes from "prop-types";
import { Box, Typography, useTheme } from "@mui/material";

/**
 * CardLocation — Compact address display row. No label.
 */
const CardLocation = ({ address, city, state, pincode }) => {
    const theme = useTheme();
    const displayValue =
        address ||
        `${city || ""}, ${state || ""} ${pincode || ""}`.trim().replace(/^,\s*/, "") ||
        "-";

    return (
        <Box display="flex" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
            <LocationOn
                sx={{ fontSize: "1rem", color: theme.palette.text.secondary, flexShrink: 0 }}
            />
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
                {displayValue}
            </Typography>
        </Box>
    );
};

CardLocation.propTypes = {
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CardLocation;
