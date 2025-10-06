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
import StyledDialog from "../../../Components/New/StyledDialog";

const PaymentEntryDialog = ({
    open,
    setOpen,
    onSave,
    paymentEntry,
    setPaymentEntry,
    paymentStatus,
    paymentType,
}) => (
    <StyledDialog
        onConfirm={onSave}
        confirmText="Save"
        title={"Payment Entry"}
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
    >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
            <Typography fontWeight={"bolder"}>
                Actual Amount: {paymentEntry.actualAmount}
            </Typography>
            <TextField
                label="Final Amount"
                type="number"
                value={paymentEntry.amount}
                fullWidth
                onChange={(e) => setPaymentEntry({ ...paymentEntry, amount: e.target.value })}
                variant="outlined"
                InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
            />

            <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                    value={paymentEntry.status}
                    label="Payment Status"
                    onChange={(e) => setPaymentEntry({ ...paymentEntry, status: e.target.value })}
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
                    value={paymentEntry.paymentType}
                    label="Payment Type"
                    onChange={(e) =>
                        setPaymentEntry({ ...paymentEntry, paymentType: e.target.value })
                    }
                >
                    {paymentType?.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* <FormControl>
            <DateTimeField
              format="DATE"
              value={paymentEntry?.paymentDate}
              onChange={value => setPaymentEntry({ ...paymentEntry, paymentDate: value })}
              textFieldVarient={"outlined"}
            />
          </FormControl> */}
        </Box>
    </StyledDialog>
);
PaymentEntryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    paymentEntry: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        actualAmount: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        paymentType: PropTypes.string.isRequired,
        paymentDate: PropTypes.string,
    }).isRequired,
    setPaymentEntry: PropTypes.func.isRequired,
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
