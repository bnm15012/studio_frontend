import React, { useEffect, useState } from "react";
import { DialogContent, Typography, Box, Divider } from "@mui/material";
import { useAlert } from "@/core/components/feedback/Alert";
import { createOrder, PaymentDetails, verifyPayment } from "./RazorPay.api";
import { setSubscriptionPlan } from "../../state/authSlice";
import { getEndDateBySubscriptionPlan } from "../../utils/SubscriptionPlanUtil";
import { getCurrentDateTimeLocal, getLocalDateTime } from "@/core/utils/DateUtil";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { useAppDispatch, useAppSelector } from "@/state";
import { useAppUI } from "@/context/UIContext";

interface RazorpayInstance {
    open: () => void;
}

interface RazorpayConstructor {
    new (options: Record<string, unknown>): RazorpayInstance;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface PlanItem {
    id: string;
    name: string;
    planType: string;
    amount: number;
    days: number;
}

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    plan: PlanItem;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, plan }) => {
    const showAlert = useAlert();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const { token, user, studio, currentBranch } = useAppUI();
    const subscriptionPlan = useAppSelector((state) => state.auth.subscriptionPlan);

    useEffect(() => {
        const RazorpayCtor = (window as unknown as Record<string, unknown>).Razorpay;
        if (!RazorpayCtor) {
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
                studioId: studio.studioId!,
            });

            if (success) {
                const orderId = data.orderId;

                const options = {
                    key: (import.meta.env as Record<string, string>).VITE_APP_RAZOR_PAY_KEY || "",
                    amount: plan.amount * 100,
                    currency: "INR" as const,
                    order_id: orderId,
                    handler: async (response: RazorpayResponse) => {
                        try {
                            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
                                response;
                            const paymentDetails: PaymentDetails = {
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
                        } catch (error: unknown) {
                            console.error(error);
                            showAlert("Payment processing failed. Please try again.", "error");
                        }
                    },
                    prefill: {
                        name: user.userName || "",
                        email: user.email || "",
                    },
                    notes: {
                        plan: "Book & Manage",
                    },
                };

                const RazorpayCtor = (window as unknown as Record<string, unknown>)
                    .Razorpay as unknown as RazorpayConstructor;
                const razorpay = new RazorpayCtor(options);
                razorpay.open();
            } else {
                throw new Error("Failed to create order.");
            }
        } catch (error: unknown) {
            console.error(
                "Error in payment process:",
                error instanceof Error ? error.message : String(error),
            );
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
                                (subscriptionPlan?.endDate
                                    ? subscriptionPlan.endDate!
                                    : getCurrentDateTimeLocal()) as string,
                                plan.planType,
                            ),
                        )}
                    </Typography>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

export default PaymentDialog;
