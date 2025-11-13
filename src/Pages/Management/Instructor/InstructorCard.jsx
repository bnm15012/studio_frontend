import { Box, Typography, Avatar, Chip, Divider, useTheme } from "@mui/material";
import { Phone, Mail, Calendar, MapPin, PhoneCall } from "lucide-react";
import PropTypes from "prop-types";
import { StyledCardContent } from "../../../Components/New/StyledCard";
import FlexBetween from "../../../Components/FlexBetween";
import Field from "../../../Components/Fields/Field";

const InstructorCard = ({ row }) => {
    const theme = useTheme();
    const { name, email, phone, instructorStatus, imageUrl, dob, address, emergencyContactNumber } =
        row;

    const infoItems = [
        {
            label: "Email",
            value: email,
            icon: <Mail size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Phone",
            value: phone,
            icon: <Phone size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Date of Birth",
            value: dob,
            icon: <Calendar size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Address",
            value: address,
            icon: <MapPin size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Emergency Contact",
            value: emergencyContactNumber,
            icon: <PhoneCall size={18} color={theme.palette.primary.main} />,
        },
    ].filter((item) => item.value);

    return (
        <>
            {/* Gradient Header Line */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background:
                        instructorStatus === "ACTIVE"
                            ? "linear-gradient(90deg, #0288d1, #26c6da, #4dd0e1)"
                            : "linear-gradient(90deg, #bdbdbd, #e0e0e0)",
                }}
            />

            <StyledCardContent>
                {/* Header Section */}
                <FlexBetween>
                    <Chip
                        label={instructorStatus === "ACTIVE" ? "Active" : "Inactive"}
                        sx={{
                            backgroundColor:
                                instructorStatus === "ACTIVE"
                                    ? theme.palette.success.main
                                    : theme.palette.grey[400],
                            color: "white",
                            fontWeight: 600,
                        }}
                    />
                </FlexBetween>

                {/* Avatar and Name */}
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                    {imageUrl ? (
                        <Field
                            value={imageUrl}
                            type="IMAGE"
                            isEdit={false}
                            extraProp={{ size: "48px" }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                width: 48,
                                height: 48,
                                fontWeight: 600,
                                fontSize: "1.1rem",
                            }}
                        >
                            {name?.charAt(0)?.toUpperCase() || "I"}
                        </Avatar>
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                            {name}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Info Sections (uniform format) */}
                <Box display="flex" flexDirection="column" gap={1}>
                    {infoItems.map(({ label, value, icon }, index) => (
                        <Box key={index} display="flex" alignItems="flex-start" gap={2}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.action.hover,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 36,
                                }}
                            >
                                {icon}
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    fontWeight={600}
                                >
                                    {label}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                    {value}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </StyledCardContent>
        </>
    );
};

InstructorCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dob: PropTypes.string,
        instructorStatus: PropTypes.string,
        address: PropTypes.string,
        emergencyContactNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default InstructorCard;
