import { Box, Typography, Chip, Divider, useTheme } from "@mui/material";
import { Calendar, Clock, Wallet, Activity, TimerReset, Landmark } from "lucide-react";
import PropTypes from "prop-types";
import { StyledCardContent } from "../../../Components/New/StyledCard";
import FlexBetween from "../../../Components/FlexBetween";
import { getLocalDateTime } from "../../../utils/DateUtil";

const StudentAssignActivityCard = ({ row }) => {
    const theme = useTheme();

    const {
        activityName,
        batchName,
        batchTime,
        registrationDate,
        membershipStartDate,
        membershipEndDate,
        membershipType,
        membershipStatus,
        activityAmount,
        daysPerWeek,
        paymentEntry,
    } = row;

    const infoItems = [
        {
            label: "Activity",
            value: activityName,
            icon: <Activity size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Batch Name",
            value: batchName,
            icon: <Landmark size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Batch Time",
            value: batchTime,
            icon: <Clock size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Registration Date",
            value: getLocalDateTime(registrationDate),
            icon: <Calendar size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Membership Start",
            value: getLocalDateTime(membershipStartDate),
            icon: <TimerReset size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Membership End",
            value: getLocalDateTime(membershipEndDate),
            icon: <TimerReset size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Membership Type",
            value: membershipType,
            icon: <Activity size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Amount",
            value: `₹${activityAmount}`,
            icon: <Wallet size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Days Per Week",
            value: daysPerWeek,
            icon: <Calendar size={18} color={theme.palette.primary.main} />,
        },
        {
            label: "Last Payment Date",
            value: paymentEntry?.paymentDate
                ? getLocalDateTime(paymentEntry.paymentDate)
                : "Not Paid",
            icon: <Wallet size={18} color={theme.palette.primary.main} />,
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

                <Typography variant="h6" fontWeight={600} mt={1} mb={1} color="text.primary">
                    {activityName}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Info List */}
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

StudentAssignActivityCard.propTypes = {
    row: PropTypes.object.isRequired,
};

export default StudentAssignActivityCard;
