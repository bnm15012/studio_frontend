import { useSelector } from "react-redux";
import { Typography, CardContent, Box, Divider, useTheme, Button } from "@mui/material";
import { Payment, CalendarToday, EventBusy, EventAvailable, PriceCheck, Assignment, HourglassBottom } from "@mui/icons-material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FlexBetween from "../../Components/FlexBetween";
import { useEffect, useState } from "react";
import SubscriptionPopup from "../Auth/SubscriptionPopup";
import PropTypes from "prop-types";

const SubscriptionTab = () => {
  const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);
  const [openplansPopUp, setopenplansPopUp] = useState(false);

  useEffect(() => {

  }, [openplansPopUp])

  if (!subscriptionPlan) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
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
            icon={Assignment}
            label="Plan Type"
            value={subscriptionPlan.subscriptionPlan}
          />
          <Divider />

          <InfoRow
            icon={EventAvailable}
            label="Start Date"
            value={new Date(subscriptionPlan.startDate).toLocaleDateString("en-GB")}
          />
          <Divider />

          <InfoRow
            icon={EventBusy}
            label="End Date"
            value={endDate.toLocaleDateString("en-GB")}
          />
          <Divider />

          <InfoRow
            icon={CalendarToday}
            label="Status"
            value={subscriptionPlan.status}
            valueIcon={subscriptionPlan.status === "ACTIVE" ? CheckCircle : Cancel}
            color={subscriptionPlan.status === "ACTIVE" ? "success.main" : "error.main"}
          />
          <Divider />

          <InfoRow
            icon={PriceCheck}
            label="Price"
            value={`Rs ${subscriptionPlan.price.toFixed(2)}`}
          />
          <Divider />

          <InfoRow
            icon={Payment}
            label="Order ID"
            value={subscriptionPlan.orderId}
          />
          <Divider />

          <InfoRow
            icon={Payment}
            label="Payment ID"
            value={subscriptionPlan.paymentId}
          />
          <Divider />

          <InfoRow
            icon={HourglassBottom}
            label="Expires in"
            value={daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
            color={daysRemaining > 0 ? "warning.main" : "error.main"}
          />
        </Box>
      </CardContent>
      <Button fullWidth variant="contained" onClick={() => setopenplansPopUp(!openplansPopUp)}>Extend subscription</Button>
      {
        openplansPopUp &&
        <SubscriptionPopup popupOn={openplansPopUp} setPopup={() => setopenplansPopUp(!openplansPopUp)} />
      }
    </Box>
  );
};

export default SubscriptionTab;

const InfoRow = ({ icon: Icon, label, value, color, valueIcon: ValueIcon }) => {
  const theme = useTheme();
  return <FlexBetween sx={{ py: 1 }}>
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
};

InfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  valueIcon: PropTypes.elementType,
};
