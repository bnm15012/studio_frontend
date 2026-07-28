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
import Loading from "@/core/components/loading/Loading";
import { useAlert } from "@/core/components/feedback/Alert";
import DialogForm from "@/core/crud/DialogForm";
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

    const handleSave = async () => {
        if (!paymentFormData) return;
        if (paymentFormData.id !== 0) {
            dispatch(
                paymentCruds.update(
                    Number(paymentFormData.id),
                    paymentFormData,
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
                        amount: paymentFormData.amount,
                        paymentDate: paymentFormData.paymentDate,
                        status: "COMPLETED",
                        paymentType: "CASH",
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
    return (
        <Box sx={{ mt: 1 }}>
            {loading && <Loading />}
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
                            status: paymentStatusTypes[0],
                            paymentType: paymentTypes[0],
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
                <DialogForm<Partial<Payment>>
                    data={paymentFormData}
                    fieldsMeta={{ primary: "id", root: "branchId" }}
                    fields={[
                        {
                            name: "amount",
                            label: "Amount",
                            type: "NUMBER",
                        },
                        {
                            name: "paymentDate",
                            label: "Payment Date",
                            type: "DATE",
                        },
                        {
                            name: "status",
                            label: "Status",
                            type: "SELECT",
                            getValue: (value: paymentStatus) => ({ key: String(value), value }),
                            getOptions: async (search: string, page: number, limit: number) =>
                                ["PENDING", "COMPLETED"]
                                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                                    .slice((page - 1) * limit, page * limit)

                                    .map((a) => ({ key: a, value: a })),
                        },
                        {
                            name: "paymentType",
                            label: "Payment Category",
                            type: "SELECT",
                            getValue: (value: paymentType) => ({ key: String(value), value }),
                            getOptions: async (search: string, page: number, limit: number) =>
                                ["CASH", "UPI"]
                                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                                    .slice((page - 1) * limit, page * limit)

                                    .map((a) => ({ key: a, value: a })),
                        },
                    ]}
                    handleChange={(value, _, fieldName) => {
                        setPaymentFormData(
                            (prev) =>
                                ({
                                    ...prev,
                                    [fieldName]: value,
                                }) as Payment,
                        );
                    }}
                    handleSave={handleSave}
                    setClose={() => setOpenPaymentDialog(false)}
                />
            )}
        </Box>
    );
};

export default PaymentList;
