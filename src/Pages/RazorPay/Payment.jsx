import { useEffect, useState } from "react";
import { DialogContent, Typography, Box, Divider } from "@mui/material";
import { useAlert } from "../../utils/Alert";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, verifyPayment } from "./RazorPay.api";
import PropTypes from "prop-types";
import { setSubscriptionPlan } from "../../state/authSlice";
import { getEndDateBySubscriptionPlan } from "../../utils/SubscriptionPlanUtil";
import { getCurrentDateTimeLocal, getLocalDateTime } from "../../utils/DateUtil";
import StyledDialog from "../../Components/New/StyledDialog";

const PaymentDialog = ({ open, onClose, plan }) => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const subscriptionPlan = useSelector((state) => state.auth.subscriptionPlan);

    useEffect(() => {
        if (!window.Razorpay) {
            console.error("Razorpay SDK is not loaded");
            showAlert("Payment system not available. Please try again later.");
        }
    }, [showAlert]);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Create order with selected dates
            const { data, success } = await createOrder({
                token,
                plan: plan.planType,
                branchId: currentBranch.branchId,
                studioId: studio.studioId,
            });

            if (success) {
                const orderId = data.orderId;

                const options = {
                    key: import.meta.env.VITE_APP_RAZOR_PAY_KEY,
                    amount: plan.amount * 100,
                    currency: "INR",
                    order_id: orderId,
                    handler: async (response) => {
                        try {
                            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
                                response;
                            const paymentDetails = {
                                paymentId: razorpay_payment_id,
                                orderId: razorpay_order_id,
                                signature: razorpay_signature,
                            };

                            const paymentResponse = await verifyPayment(token, paymentDetails);
                            if (paymentResponse.success) {
                                dispatch(
                                    setSubscriptionPlan({ subscriptionPlan: paymentResponse.data }),
                                );
                                showAlert(
                                    paymentResponse.message ||
                                        `Payment successful! Payment ID: ${razorpay_payment_id}`,
                                    "success",
                                );
                            }
                            onClose();
                        } catch (error) {
                            console.error(error);
                            showAlert("Payment processing failed. Please try again.", "error");
                        }
                    },
                    prefill: {
                        name: user.userName,
                        email: user.email,
                    },
                    notes: {
                        plan: "Book & Manage",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                throw new Error("Failed to create order.");
            }
        } catch (error) {
            console.error("Error in payment process:", error);
            showAlert("Payment failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            onConfirm={handlePayment}
            confirmDisabled={loading}
            confirmText={loading ? "Processing..." : "Pay Now"}
            maxWidth="sm"
            fullWidth
            title="Confirm Payment"
        >
            <Divider />
            <DialogContent sx={{ textAlign: "center", p: 3 }}>
                <Typography variant="body1">
                    You are about to purchase the <strong>{plan.planType}</strong> plan for{" "}
                    <strong>
                        Rs.
                        {plan.amount}
                    </strong>
                    .
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    for the duration below.
                </Typography>

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    <Typography variant="body2">
                        <strong>Start Date:</strong>{" "}
                        {subscriptionPlan?.endDate
                            ? getLocalDateTime(subscriptionPlan.endDate)
                            : new Date().toLocaleDateString("en-GB")}
                    </Typography>
                    <Typography variant="body2">
                        <strong>End Date:</strong>{" "}
                        {getLocalDateTime(
                            getEndDateBySubscriptionPlan(
                                subscriptionPlan?.endDate
                                    ? subscriptionPlan.endDate
                                    : getCurrentDateTimeLocal(),
                                plan.planType,
                            ),
                        )}
                    </Typography>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

PaymentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plan: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        planType: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        days: PropTypes.number.isRequired,
    }),
};

export default PaymentDialog;
