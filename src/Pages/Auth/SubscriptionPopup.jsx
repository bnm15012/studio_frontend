import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import PricingPlanCards from "../Pricing/PricingPlanCards";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import FlexBetween from "../../Components/FlexBetween";
import { Close } from "@mui/icons-material";
import { convertUTCToLocal } from "../../utils/DateUtil";

const SubscriptionPopup = ({ popupOn = false, setPopup }) => {
  const [open, setOpen] = useState(popupOn);
  const [isExpired, setIsExpired] = useState(false)
  const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);
  const [isSubscriptionPlanEnded, setIsSubscriptionPlanEnded] = useState(false);
  useEffect(() => {
    const checkSubscription = () => {
      const currentDate = new Date();
      const endDate = subscriptionPlan ? new Date(convertUTCToLocal(subscriptionPlan.endDate)) : null;
      if (currentDate > endDate) {
        setOpen(true)
        setIsExpired(true);
        setIsSubscriptionPlanEnded(true);
      }
    };

    checkSubscription();
    const timer = setInterval(checkSubscription, 60 * 5000);
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
              backgroundColor: "red",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            <FlexBetween>
              {
                isExpired &&
                <Box>
                  Your subscription has expired. Please renew to continue enjoying all the great features and benefits. Don&rsquo;t miss out !!
                </Box>
              }
              <Box flexGrow={1}></Box>
              <IconButton
                onClick={handleClose}
                color="white"
                sx={{ fontWeight: "bold" }}
              >
                <Close />
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
              <PricingPlanCards buttonText={"Subscribe"} />
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
      {
        isSubscriptionPlanEnded &&
        <Box position={"absolute"} top={0} left={0} zIndex={100} backgroundColor="rgba(255,255,255,0.5)" width="100%" height="100%">
        </Box>
      }
    </>
  );
};
SubscriptionPopup.propTypes = {
  popupOn: PropTypes.bool,
  setPopup: PropTypes.func,
};

export default SubscriptionPopup;
