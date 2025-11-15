import { Box, Typography, Chip, Divider, useTheme } from "@mui/material";
import { Activity, Calendar, UserCheck, FileText, TimerReset } from "lucide-react";
import PropTypes from "prop-types";
import { StyledCardContent } from "../../../Components/New/StyledCard";
import FlexBetween from "../../../Components/FlexBetween";
import ImageDialog from "../../../Components/Views/ImageDialog";

const InstructorAssignedActivityCard = ({ row }) => {
    const theme = useTheme();

    const {
        activityName,
        assignedDate,
        startDate,
        endDate,
        contractDocument,
        membershipStatus,
        instructorId,
    } = row;

    const infoItems = [
        {
            label: "Activity Name",
            value: activityName,
            icon: <Activity size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Assigned Date",
            value: assignedDate,
            icon: <Calendar size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Start Date",
            value: startDate,
            icon: <TimerReset size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "End Date",
            value: endDate,
            icon: <TimerReset size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Instructor ID",
            value: instructorId,
            icon: <UserCheck size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Contract Document",
            value: contractDocument ? <ImageDialog image={contractDocument} /> : "Not Provided",
            icon: <FileText size={18} color={theme.palette.primary.main} />,
        },
    ].filter((item) => item.value !== undefined);

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
                        membershipStatus === "ACTIVE"
                            ? "linear-gradient(90deg, #0288d1, #26c6da, #4dd0e1)"
                            : "linear-gradient(90deg, #bdbdbd, #e0e0e0)",
                }}
            />

            <StyledCardContent>
                {/* Header Section */}
                <FlexBetween>
                    <Chip
                        label={membershipStatus === "ACTIVE" ? "Active" : "Inactive"}
                        sx={{
                            backgroundColor:
                                membershipStatus === "ACTIVE"
                                    ? theme.palette.success.main
                                    : theme.palette.grey[400],
                            color: "white",
                            fontWeight: 600,
                        }}
                    />
                </FlexBetween>
                <Divider sx={{ my: 2 }} />

                {/* Info Rows */}
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

InstructorAssignedActivityCard.propTypes = {
    row: PropTypes.shape({
        assignmentId: PropTypes.number,
        activityName: PropTypes.string,
        assignedDate: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        contractDocument: PropTypes.string,
        membershipStatus: PropTypes.string,
        instructorId: PropTypes.number,
    }).isRequired,
};

export default InstructorAssignedActivityCard;
