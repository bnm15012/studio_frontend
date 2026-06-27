import { useState, useEffect } from "react";
import { DialogContent, Box } from "@mui/material";
import PricingPlanCards from "../Pricing/PricingPlanCards";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import StyledDialog from "../../core/components/StyledDialog";

const SubscriptionPopup = ({ popupOn = false, setPopup }) => {
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
            const endDate = subscriptionPlan ? new Date(subscriptionPlan.endDate) : null;
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
            <StyledDialog
                cancelText="Close"
                title={
                    isExpired ? (
                        <>
                            Your{" "}
                            {studio?.amcEnabled
                                ? "AMC Service has expired. Please renew it !"
                                : "Subscription has expired. Please renew to continue enjoying all the great features and benefits. Don’t miss out!"}
                        </>
                    ) : (
                        ""
                    )
                }
                titleBgColor={isExpired ? "error" : "success"}
                fullWidth
                open={open}
                onClose={handleClose}
                maxWidth={studio?.amcEnabled ? "sm" : "lg"}
            >
                <Box sx={{ borderRadius: "5px" }}>
                    <DialogContent>
                        <Box mt={5}>
                            <PricingPlanCards buttonText="Subscribe" AMC={studio?.amcEnabled} />
                        </Box>
                    </DialogContent>
                </Box>
            </StyledDialog>

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
