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
import StyledDialog from "../../../core/components/dialogs/StyledDialog";

interface PaymentEntryDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
    paymentStatus: Array<{ value: string; label: string }>;
    paymentType: Array<{ value: string; label: string }>;
}

const PaymentEntryDialog: React.FC<PaymentEntryDialogProps> = ({
    open,
    onClose,
    onSave,
    initialData,
    paymentStatus,
    paymentType,
}) => {
    const [formData, setFormData] = useState<any>(initialData || {});

    useEffect(() => {
        if (initialData) setFormData({ ...initialData });
    }, [initialData]);

    const handleConfirm = () => {
        const data = { ...formData };
        if (data.type === "BOOKING") {
            delete data.actualAmount;
            delete data.type;
        }
        onSave(data);
    };

    return (
        <StyledDialog
            onConfirm={handleConfirm}
            confirmText="Save"
            title="Payment Entry"
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
                {!!formData.actualAmount && (
                    <Typography fontWeight="bolder" variant="h6">
                        {formData.type === "BOOKING" ? "Booking Amount" : "Actual Amount"}{" "}
                        {formData.actualAmount}
                    </Typography>
                )}

                <TextField
                    label={formData.type === "BOOKING" ? "Advance Amount" : "Final Amount"}
                    type="number"
                    value={formData.amount ?? ""}
                    fullWidth
                    onChange={(e) =>
                        setFormData((prev: any) => ({
                            ...prev,
                            amount: Number(e.target.value),
                        }))
                    }
                    variant="outlined"
                    InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                    }}
                />

                <FormControl fullWidth>
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                        value={formData.status || ""}
                        label="Payment Status"
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, status: e.target.value }))
                        }
                    >
                        {paymentStatus?.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                                {status.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                        value={formData.paymentType || ""}
                        label="Payment Type"
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, paymentType: e.target.value }))
                        }
                    >
                        {paymentType?.map((type) => (
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
