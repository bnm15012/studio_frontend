import { useAppDispatch } from "@/state";

import { Typography, Box, Button, IconButton } from "@mui/material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "@/core/components/cards/StyledCard";
import PaymentCard from "../Payments/PaymentCardView";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { AddCircleOutline, Edit } from "@mui/icons-material";
import { bookingCruds, paymentCruds } from "../../../api/all.api";
import { useState } from "react";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import Loading from "@/core/components/loading/Loading";
import { useAlert } from "@/core/components/feedback/Alert";
import DialogForm from "@/core/crud/DialogForm";
import { useAppUI } from "@/context/UIContext";

const paymentTypes = ["CASH", "UPI"];
const paymentStatusTypes = ["COMPLETED", "PENDING"];

const PaymentList = ({
    data,
    field,
}: {
    data: Record<string, unknown>;
    field: Record<string, unknown>;
}) => {
    const value = Array.isArray(data?.[field?.name as string])
        ? (data[field.name as string] as Record<string, unknown>[])
        : [];
    const title = String(field?.label || "Payments");
    const paidAmount = value.reduce(
        (acc: number, curr: Record<string, unknown>) => acc + (curr.amount as number),
        0,
    );
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const showAlert = useAlert();
    const { token } = useAppUI();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [paymentFormData, setPaymentFormData] = useState<Record<string, unknown> | undefined>();

    if (!value?.length) {
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
        if ((paymentFormData.id as string) !== "NEW") {
            dispatch(
                paymentCruds.update(
                    paymentFormData.id as string | number,
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
                        status: paymentFormData.status,
                        paymentType: paymentTypes[0],
                        branchId: data.branchId as number,
                        payeeId: data.id as number,
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
                    bookingCruds.getById(data.id as string | number, token, showAlert, setLoading, {
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
                            id: "NEW",
                            amount: (data.totalAmount as number) - paidAmount,
                            paymentDate: getCurrentDateTimeLocal(),
                            status: paymentStatusTypes[0],
                            paymentType: paymentTypes[0],
                        });
                    }}
                    disabled={(data.totalAmount as number) === paidAmount}
                    variant="contained"
                    size="small"
                >
                    Add Payment
                </Button>
            </FlexBetween>

            <StyledCardContainer>
                {value.map((m: Record<string, unknown>) => (
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
            {openPaymentDialog && (
                <DialogForm
                    data={paymentFormData as Record<string, unknown>}
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
                            getValue: (value: unknown) => value && { key: value, value },
                            extraProp: {
                                getOptions: async (search: string, page: number, limit: number) =>
                                    ["PENDING", "COMPLETED"]
                                        .filter((a) =>
                                            a.toLowerCase().includes(search.toLowerCase()),
                                        )
                                        .slice(page * limit, (page + 1) * limit)
                                        .map((a) => ({ key: a, value: a })),
                            },
                        },
                        {
                            name: "paymentType",
                            label: "Payment Category",
                            type: "SELECT",
                            getValue: (value: unknown) => value && { key: value, value },
                            extraProp: {
                                getOptions: async (search: string, page: number, limit: number) =>
                                    ["CASH", "UPI"]
                                        .filter((a) =>
                                            a.toLowerCase().includes(search.toLowerCase()),
                                        )
                                        .slice(page * limit, (page + 1) * limit)
                                        .map((a) => ({ key: a, value: a })),
                            },
                        },
                    ]}
                    handleChange={(value, _, fieldName) => {
                        setPaymentFormData((prev) => ({
                            ...prev,
                            [fieldName]: value,
                        }));
                    }}
                    handleSave={handleSave}
                    setClose={() => setOpenPaymentDialog(false)}
                />
            )}
        </Box>
    );
};

export default PaymentList;
