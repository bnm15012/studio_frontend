import PropTypes from "prop-types";
import { Typography, Box, Chip, Divider } from "@mui/material";
import { LocationOn, Circle, Business } from "@mui/icons-material";
import ContactSection from "../Enquiry/ContactSection";
import { StyledCardContent } from "../../../Components/New/StyledCard";

const BranchCardView = ({ row }) => {
    const { name, address, city, state, pincode, phone, isActive } = row;

    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: isActive
                        ? "linear-gradient(90deg, #018605ff, #81c784, #21f344ff)"
                        : "linear-gradient(90deg, #bdbdbd, #e0e0e0)",
                }}
            />

            <StyledCardContent sx={{ pt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: "primary.light",
                                opacity: 0.2,
                            }}
                        >
                            <Business color="primary" />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                transition: "color 0.3s ease",
                                "&:hover": { color: "primary.main" },
                            }}
                        >
                            {name}
                        </Typography>
                    </Box>

                    <Chip
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                <Circle
                                    sx={{
                                        fontSize: 10,
                                        color: isActive ? "green" : "text.disabled",
                                        animation: isActive ? "pulse 1.5s infinite" : "none",
                                    }}
                                />
                                {isActive ? "Active" : "Inactive"}
                            </Box>
                        }
                        variant="outlined"
                        sx={{
                            borderColor: isActive ? "success.light" : "text.disabled",
                            color: isActive ? "success.main" : "text.secondary",
                            backgroundColor: isActive ? "success.light + 15%" : "transparent",
                            "@keyframes pulse": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                                "100%": { opacity: 1 },
                            },
                        }}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
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

                <ContactSection contact={phone} />
            </StyledCardContent>
        </>
    );
};

BranchCardView.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        phone: PropTypes.string,
        isActive: PropTypes.bool,
    }).isRequired,
};

export default BranchCardView;
