import React, { useState, useEffect } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Box,
    Typography,
} from "@mui/material";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import DateTime from "@/core/components/fields/DateTime";
import { Payment, paymentStatus, paymentType } from "@/api/types";

interface PaymentOption {
    label: string;
    value: string;
}

interface PaymentEntryDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Payment) => void;
    initialData: Payment;
    paymentStatus: paymentStatus[];
    paymentType: PaymentOption[];
    refund?: boolean;
    title?: string;
    actualAmount?: number;
    type?: string;
}

const PaymentEntryDialog: React.FC<PaymentEntryDialogProps> = ({
    open,
    onClose,
    onSave,
    initialData,
    paymentStatus,
    paymentType,
    refund = false,
    title,
    actualAmount,
    type,
}) => {
    const [formData, setFormData] = useState<Payment>(initialData);

    useEffect(() => {
        setFormData({ ...initialData });
    }, [initialData]);

    const handleConfirm = () => {
        const data: Payment = { ...formData };
        if (refund && data.amount !== undefined) {
            data.amount = -Math.abs(Number(data.amount));
        }
        onSave(data);
    };

    const displayActualAmount =
        actualAmount ?? (initialData as { actualAmount?: number })?.actualAmount;
    const displayType = type ?? (initialData as { type?: string })?.type;

    const dialogTitle = title || (refund ? "Refund Process" : "Payment Entry");
    const amountLabel = refund
        ? "Refund Amount"
        : displayType === "BOOKING"
          ? "Advance Amount"
          : "Final Amount";

    return (
        <StyledDialog
            onConfirm={handleConfirm}
            confirmText={refund ? "Process Refund" : "Save"}
            title={dialogTitle}
            {...(refund && { titleBgColor: "warning" })}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
                {refund && (
                    <Typography
                        color="warning.main"
                        fontWeight="600"
                        variant="subtitle1"
                        textAlign="center"
                    >
                        Refund Process
                    </Typography>
                )}
                {!!displayActualAmount && (
                    <Typography fontWeight="bolder" variant="h6">
                        {displayType === "BOOKING" ? "Booking Amount" : "Actual Amount"}{" "}
                        {String(displayActualAmount)}
                    </Typography>
                )}

                <TextField
                    label={amountLabel}
                    type="number"
                    value={
                        formData.amount !== undefined
                            ? refund
                                ? Math.abs(formData.amount)
                                : formData.amount
                            : ""
                    }
                    fullWidth
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((prev) => ({
                            ...prev,
                            amount: refund ? -Math.abs(val) : val,
                        }));
                    }}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <Typography sx={{ mr: 1 }}>{refund ? "- ₹" : "₹"}</Typography>
                        ),
                    }}
                />

                <FormControl fullWidth>
                    <InputLabel>Payment Status</InputLabel>
                    <Select<paymentStatus>
                        value={formData.status || "PENDING"}
                        label="Payment Status"
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                status: e.target.value as paymentStatus,
                            }))
                        }
                    >
                        {paymentStatus.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <DateTime
                    value={formData.paymentDate ?? ""}
                    setValue={(value: string | null) =>
                        setFormData((prev) => ({ ...prev, paymentDate: value ?? "" }))
                    }
                    label="Payment Date"
                    format="DATE"
                    variant="outlined"
                    size="medium"
                    includeCurrentTime={false}
                />

                <FormControl fullWidth>
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                        value={formData.paymentType || ""}
                        label="Payment Type"
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                paymentType: e.target.value as paymentType,
                            }))
                        }
                    >
                        {paymentType.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </StyledDialog>
    );
};

export default PaymentEntryDialog;
