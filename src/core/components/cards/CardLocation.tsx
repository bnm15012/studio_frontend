/** Compact address display row with a location pin icon, showing address, city, state, and pincode. */
import React from "react";
import { LocationOn } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";

/**
 * CardLocation — Compact address display row. No label.
 */
interface CardLocationProps {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string | number;
}

const CardLocation: React.FC<CardLocationProps> = ({ address, city, state, pincode }) => {
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

export default CardLocation;
