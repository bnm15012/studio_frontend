import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import PricingPlanCards from "../Pricing/PricingPlanCards";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import FlexBetween from "../../Components/FlexBetween";
import CloseIcon from "@mui/icons-material/Close";
import { convertUTCToLocal } from "../../utils/DateUtil";

const SubscriptionPopup = ({ popupOn = false, setPopup }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(popupOn);
  const [isExpired, setIsExpired] = useState(false);

  const studio = useSelector((state) => state.auth.studio);
  const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);

  useEffect(() => {
    setOpen(popupOn);
  }, [popupOn]);

  useEffect(() => {
    const checkSubscription = () => {
      const currentDate = new Date();
      const endDate = subscriptionPlan
        ? new Date(convertUTCToLocal(subscriptionPlan.endDate))
        : null;
      if (currentDate > endDate) {
        setOpen(true);
        setIsExpired(true);
      }
    };

    checkSubscription();
    const timer = setInterval(checkSubscription, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(timer);
  }, [subscriptionPlan]);

  const handleClose = () => {
    setOpen(false);
    setPopup && setPopup(false);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
        <Box sx={{ borderRadius: "5px" }}>
          <DialogTitle
            sx={{
              background: isExpired
                ? "linear-gradient(to bottom, #FF0000, #B02600)"
                : `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            <FlexBetween>
              {isExpired && (
                <Box>
                  {studio?.amcEnabled
                    ? "Your Annual Maintenance Charge"
                    : "Subscription"}{" "}
                  has expired. Please renew to continue enjoying all the great
                  features and benefits. Don’t miss out!
                </Box>
              )}
              <IconButton onClick={handleClose} sx={{ fontWeight: "bold" }}>
                <CloseIcon sx={{ color: "white" }} />
              </IconButton>
            </FlexBetween>
          </DialogTitle>
          <DialogContent>
            <Box
              mt={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PricingPlanCards buttonText="Subscribe" AMC={studio?.amcEnabled} />
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      {isExpired && (
        <Box
          position="absolute"
          top={0}
          left={0}
          zIndex={100}
          backgroundColor="rgba(255,255,255,0.5)"
          width="100%"
          height="100%"
        />
      )}
    </>
  );
};

SubscriptionPopup.propTypes = {
  popupOn: PropTypes.bool,
  setPopup: PropTypes.func,
};

export default SubscriptionPopup;
