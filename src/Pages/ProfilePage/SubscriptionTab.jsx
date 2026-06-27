import { useSelector } from "react-redux";
import { Typography, CardContent, Box, Divider, useTheme, Button } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { FlexBetween } from "../../core/components/layout/FlexBox";
import { useEffect, useState } from "react";
import SubscriptionPopup from "../Auth/SubscriptionPopup";
import PropTypes from "prop-types";

const SubscriptionTab = () => {
    const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);
    const [openplansPopUp, setopenplansPopUp] = useState(false);

    useEffect(() => { }, [openplansPopUp]);

    if (!subscriptionPlan) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography variant="h6" color="textSecondary">
                    No active subscription found.
                </Typography>
            </Box>
        );
    }

    const endDate = new Date(subscriptionPlan.endDate);
    const today = new Date();
    const timeDiff = endDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return (
        <Box>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "grid", gap: 0.5 }}>
                    <InfoRow
                        icon={AssignmentIcon}
                        label="Plan Type"
                        value={subscriptionPlan.subscriptionPlan}
                    />
                    <Divider />

                    <InfoRow
                        icon={EventAvailableIcon}
                        label="Start Date"
                        value={new Date(subscriptionPlan.startDate).toLocaleDateString("en-GB")}
                    />
                    <Divider />

                    <InfoRow
                        icon={EventBusyIcon}
                        label="End Date"
                        value={endDate.toLocaleDateString("en-GB")}
                    />
                    <Divider />

                    <InfoRow
                        icon={CalendarTodayIcon}
                        label="Status"
                        value={subscriptionPlan.status}
                        valueIcon={
                            subscriptionPlan.status === "ACTIVE" ? CheckCircleIcon : CancelIcon
                        }
                        color={subscriptionPlan.status === "ACTIVE" ? "success.main" : "error.main"}
                    />
                    <Divider />

                    <InfoRow
                        icon={PriceCheckIcon}
                        label="Price"
                        value={`Rs ${subscriptionPlan.price.toFixed(2)}`}
                    />
                    <Divider />

                    <InfoRow icon={PaymentIcon} label="Order ID" value={subscriptionPlan.orderId} />
                    <Divider />

                    <InfoRow
                        icon={PaymentIcon}
                        label="Payment ID"
                        value={subscriptionPlan.paymentId}
                    />
                    <Divider />

                    <InfoRow
                        icon={HourglassBottomIcon}
                        label="Expires in"
                        value={daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                        color={daysRemaining > 0 ? "warning.main" : "error.main"}
                    />
                </Box>
            </CardContent>
            <Button
                fullWidth
                variant="contained"
                onClick={() => setopenplansPopUp(!openplansPopUp)}
            >
                Extend subscription
            </Button>
            {openplansPopUp && (
                <SubscriptionPopup
                    popupOn={openplansPopUp}
                    setPopup={() => setopenplansPopUp(!openplansPopUp)}
                />
            )}
        </Box>
    );
};

export default SubscriptionTab;

const InfoRow = ({ icon: Icon, label, value, color, valueIcon: ValueIcon }) => {
    const theme = useTheme();
    return (
        <FlexBetween sx={{ py: 1 }}>
            <Box display="flex" alignItems="center">
                <Icon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="body1" fontWeight="500">
                    {label}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                {ValueIcon && <ValueIcon sx={{ mr: 1, color: color }} />}
                <Typography variant="body1" color={color}>
                    {value}
                </Typography>
            </Box>
        </FlexBetween>
    );
};

InfoRow.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string,
    valueIcon: PropTypes.elementType,
};
