import { LocationOn } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";

const CardLocation = ({ address, city, state, pincode }) => {
    const theme = useTheme();
    const iconColor = theme.palette.primary.main;
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
                p: 1,
                borderRadius: "8px",
                backgroundColor: theme.palette.background.alt || alpha(theme.palette.primary.main, 0.02),
            }}
        >
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
                }}
            >
                <LocationOn sx={{ color: iconColor, fontSize: "1.1rem" }} />
            </Box>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
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
                    Location
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
                    {address || `${city || ""}, ${state || ""} ${pincode || ""}` || "-"}
                </Typography>
            </Box>
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
