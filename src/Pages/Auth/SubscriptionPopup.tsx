import React, { useState, useEffect } from "react";
import { DialogContent, Box } from "@mui/material";
import PricingPlanCards from "../Pricing/PricingPlanCards";
import { useSelector } from "react-redux";
import StyledDialog from "@/core/components/dialogs/StyledDialog";

interface SubscriptionPopupProps {
    popupOn?: boolean;
    setPopup?: (val: boolean) => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ popupOn = false, setPopup }) => {
    const [open, setOpen] = useState(popupOn);
    const [isExpired, setIsExpired] = useState(false);

    const studio = useAppSelector((state) => state.auth.studio) as any;
    const subscriptionPlan = useAppSelector((state) => state.auth.subscriptionPlan) as any;

    useEffect(() => {
        setOpen(popupOn);
    }, [popupOn]);

    useEffect(() => {
        const checkSubscription = () => {
            const currentDate = new Date();
            const endDate = subscriptionPlan ? new Date(subscriptionPlan.endDate) : null;
            if (endDate && currentDate.getTime() > endDate.getTime()) {
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
        if (setPopup) setPopup(false);
    };

    return (
        <>
            <StyledDialog
                cancelText="Close"
                title={
                    isExpired
                        ? `Your ${studio?.amcEnabled ? "AMC Service has expired. Please renew it !" : "Subscription has expired. Please renew to continue enjoying all the great features and benefits. Don\u2019t miss out!"}`
                        : ""
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
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        bgcolor: "rgba(255,255,255,0.5)",
                        width: "100%",
                        height: "100%",
                    }}
                />
            )}
        </>
    );
};

export default SubscriptionPopup;
