import {
    FormControl,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Box,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import StyledDialog from "../../../core/components/dialogs/StyledDialog";

const PaymentEntryDialog = ({ open, onClose, onSave, initialData, paymentStatus, paymentType }) => {
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleConfirm = () => {
        if (formData.type === "BOOKING") {
            delete formData.actualAmount;
            delete formData.type;
        }
        onSave(formData);
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
                        setFormData((prev) => ({
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
                            setFormData((prev) => ({ ...prev, status: e.target.value }))
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
                            setFormData((prev) => ({ ...prev, paymentType: e.target.value }))
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

PaymentEntryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        amount: PropTypes.number,
        actualAmount: PropTypes.number,
        status: PropTypes.string,
        paymentType: PropTypes.string,
        paymentDate: PropTypes.string,
    }),
    paymentStatus: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    paymentType: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default PaymentEntryDialog;
