import { useAppSelector } from "@/state";
import React, { useState } from "react";
import { Typography, Box, Divider, useTheme, Button, Chip, alpha, Grid } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import AutoRenewIcon from "@mui/icons-material/Autorenew";
import SubscriptionPopup from "@/Pages/Auth/SubscriptionPopup";

const SubscriptionTab: React.FC = () => {
    const subscriptionPlan = useAppSelector((state) => state.auth.subscriptionPlan);
    const theme = useTheme();
    const [openplansPopUp, setopenplansPopUp] = useState(false);

    if (!subscriptionPlan) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="220px"
                gap={1.5}
            >
                <CancelIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                    No active subscription found
                </Typography>
                <Typography variant="body2" color="text.disabled">
                    Contact support or upgrade your plan.
                </Typography>
            </Box>
        );
    }

    const endDate = subscriptionPlan.endDate ? new Date(subscriptionPlan.endDate) : new Date();
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isActive = subscriptionPlan.status === "ACTIVE";
    const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;

    return (
        <Box>
            {/* Status Banner */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    p: 2.5,
                    mb: 2.5,
                    borderRadius: 2,
                    bgcolor: isActive
                        ? alpha(theme.palette.success.main, 0.07)
                        : alpha(theme.palette.error.main, 0.07),
                    border: `1px solid ${isActive ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)}`,
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    {isActive ? (
                        <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
                    ) : (
                        <CancelIcon sx={{ color: "error.main", fontSize: 28 }} />
                    )}
                    <Box>
                        <Typography variant="body1" fontWeight={700}>
                            {subscriptionPlan.subscriptionPlan ?? subscriptionPlan.name ?? "Plan"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isActive ? "Your subscription is active" : "Subscription has expired"}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                        label={subscriptionPlan.status}
                        size="small"
                        color={isActive ? "success" : "error"}
                        sx={{ fontWeight: 700 }}
                    />
                    {isExpiringSoon && (
                        <Chip
                            label={`Expires in ${daysRemaining}d`}
                            size="small"
                            color="warning"
                            sx={{ fontWeight: 700 }}
                        />
                    )}
                </Box>
            </Box>

            {/* Info Grid */}
            <Grid container spacing={0}>
                {[
                    {
                        icon: AssignmentIcon,
                        label: "Plan",
                        value: subscriptionPlan.subscriptionPlan ?? subscriptionPlan.name ?? "—",
                    },
                    {
                        icon: EventAvailableIcon,
                        label: "Start Date",
                        value: subscriptionPlan.startDate
                            ? new Date(subscriptionPlan.startDate).toLocaleDateString("en-GB")
                            : "—",
                    },
                    {
                        icon: EventBusyIcon,
                        label: "End Date",
                        value: endDate.toLocaleDateString("en-GB"),
                    },
                    {
                        icon: HourglassBottomIcon,
                        label: "Expires in",
                        value: daysRemaining > 0 ? `${daysRemaining} days` : "Expired",
                        color:
                            daysRemaining > 7
                                ? "text.primary"
                                : daysRemaining > 0
                                  ? "warning.main"
                                  : "error.main",
                    },
                    {
                        icon: PriceCheckIcon,
                        label: "Price",
                        value: `₹ ${subscriptionPlan.price.toFixed(2)}`,
                    },
                    {
                        icon: CalendarTodayIcon,
                        label: "Status",
                        value: subscriptionPlan.status ?? "—",
                        color: isActive ? "success.main" : "error.main",
                    },
                    {
                        icon: PaymentIcon,
                        label: "Order ID",
                        value: subscriptionPlan.orderId ?? "—",
                    },
                    {
                        icon: PaymentIcon,
                        label: "Payment ID",
                        value: subscriptionPlan.paymentId ?? "—",
                    },
                ].map((row, i, arr) => (
                    <Grid item xs={12} key={row.label}>
                        <InfoRow {...row} />
                        {i < arr.length - 1 && <Divider />}
                    </Grid>
                ))}
            </Grid>

            <Button
                fullWidth
                variant="contained"
                startIcon={<AutoRenewIcon />}
                onClick={() => setopenplansPopUp(true)}
                sx={{
                    mt: 3,
                    py: 1.25,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    borderRadius: 2,
                }}
            >
                Extend Subscription
            </Button>

            {openplansPopUp && (
                <SubscriptionPopup
                    popupOn={openplansPopUp}
                    setPopup={() => setopenplansPopUp(false)}
                />
            )}
        </Box>
    );
};

export default SubscriptionTab;

interface InfoRowProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, color }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.25,
                px: 0.5,
                "&:hover": { bgcolor: theme.palette.action.hover, borderRadius: 1 },
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5}>
                <Icon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                    {label}
                </Typography>
            </Box>
            <Typography variant="body2" fontWeight={600} color={color ?? "text.primary"}>
                {value}
            </Typography>
        </Box>
    );
};
