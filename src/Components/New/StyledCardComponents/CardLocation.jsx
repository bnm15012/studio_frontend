import { LocationOn } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
const CardLocation = ({ address, city, state, pincode }) => (
    <>
        {" "}
        <Box display="flex" alignItems="flex-start" gap={2}>
            <Box
                sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <LocationOn color="primary" fontSize="small" />
            </Box>
            <Box>
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {city}, {state} {pincode}
                </Typography>
            </Box>
        </Box>
    </>
);

CardLocation.propTypes = {
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CardLocation;
