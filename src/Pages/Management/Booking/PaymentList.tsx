import { useAppDispatch } from "@/state";

import { Typography, Box, Button, IconButton } from "@mui/material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "@/core/components/cards/StyledCard";
import PaymentCard from "@/Pages/Management/Payments/PaymentCardView";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { AddCircleOutline, Edit } from "@mui/icons-material";
import { bookingCruds, paymentCruds } from "@/api/all.api";
import { useState } from "react";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import { useAlert } from "@/core/components/feedback/Alert";
import PaymentEntryDialog from "@/Pages/Management/Payments/PaymentEntryDialog";
import { useAppUI } from "@/context/UIContext";
import { Booking, Payment, paymentStatus, paymentType } from "@/api/types";
import type { FieldDef } from "@/core/types";

const paymentTypes: paymentType[] = ["CASH", "UPI"];
const paymentStatusTypes: paymentStatus[] = ["COMPLETED", "PENDING"];

const PaymentList = ({ data, field }: { data: Booking; field: FieldDef<Booking> }) => {
    const value: Payment[] = Array.isArray(data.paymentEntries) ? data.paymentEntries : [];
    const title = field.label || "Payments";
    const paidAmount = value.reduce((acc: number, curr: Payment) => acc + curr.amount, 0);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const showAlert = useAlert();
    const { token } = useAppUI();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [paymentFormData, setPaymentFormData] = useState<Partial<Payment> | undefined>();

    const handleSave = async (savedData?: Partial<Payment>) => {
        const formDataToSave = savedData || paymentFormData;
        if (!formDataToSave) return;
        if (formDataToSave.id && formDataToSave.id !== 0) {
            dispatch(
                paymentCruds.update(
                    Number(formDataToSave.id),
                    formDataToSave,
                    token,
                    showAlert,
                    setLoading,
                ),
            );
        } else {
            dispatch(
                paymentCruds.add(
                    {
                        payeeType: "BOOKING",
                        amount: formDataToSave.amount ?? 0,
                        paymentDate: formDataToSave.paymentDate ?? "",
                        status: (formDataToSave.status as paymentStatus) ?? "COMPLETED",
                        paymentType: (formDataToSave.paymentType as paymentType) ?? "CASH",
                        branchId: data.branchId,
                        payeeId: data.id,
                    },
                    token,
                    showAlert,
                    setLoading,
                    true,
                ),
            );
        }
        if (!loading) {
            setTimeout(() => {
                dispatch(
                    bookingCruds.getById(Number(data.id), token, showAlert, setLoading, {
                        forceRefresh: true,
                    }),
                );
            }, 1000);
        }
        setOpenPaymentDialog(false);
        setPaymentFormData(undefined);
    };

    if (!value.length) {
        return (
            <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                    No Payments Found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 1 }}>
            <TopProgressBar loading={loading} />
            <FlexBetween p={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, my: "auto" }}>
                    {title}
                </Typography>
                <Button
                    startIcon={<AddCircleOutline />}
                    onClick={() => {
                        setOpenPaymentDialog(true);
                        setPaymentFormData({
                            id: 0,
                            amount: (data.totalAmount as number) - paidAmount,
                            paymentDate: getCurrentDateTimeLocal() ?? "",
                            status: paymentStatusTypes[0] ?? "COMPLETED",
                            paymentType: paymentTypes[0] ?? "CASH",
                        });
                    }}
                    disabled={
                        (data.totalAmount as number) === paidAmount && data.state !== "CANCELLED"
                    }
                    variant="contained"
                    size="small"
                >
                    Add Payment
                </Button>
            </FlexBetween>

            <StyledCardContainer>
                {value.map((m: Payment) => (
                    <StyledMotionCard key={String(m.id)}>
                        <StyledCardContent>
                            <PaymentCard row={m} />
                        </StyledCardContent>
                        <StyledCardActions>
                            <IconButton
                                onClick={() => {
                                    setOpenPaymentDialog(true);
                                    setPaymentFormData(m);
                                }}
                            >
                                <Edit />
                            </IconButton>
                        </StyledCardActions>
                    </StyledMotionCard>
                ))}
            </StyledCardContainer>
            {openPaymentDialog && paymentFormData && (
                <PaymentEntryDialog
                    open={openPaymentDialog}
                    onClose={() => {
                        setOpenPaymentDialog(false);
                        setPaymentFormData(undefined);
                    }}
                    onSave={handleSave}
                    initialData={paymentFormData}
                    paymentStatus={paymentStatusTypes}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                    actualAmount={data.totalAmount}
                    type="BOOKING"
                    refund={data.state === "CANCELLED" || (paymentFormData.amount ?? 0) < 0}
                />
            )}
        </Box>
    );
};

export default PaymentList;
