import PropTypes from "prop-types";
import { Typography, Box, Button } from "@mui/material";
import {
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "../../../Components/New/StyledCard";
import PaymentCard from "../Payments/PaymentCardView";
import FlexBetween from "../../../Components/FlexBetween";
import { AddCircleOutline } from "@mui/icons-material";
import { bookingCruds, paymentCruds } from "../../../api/all.api";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog";
import { useState } from "react";
import { getCurrentDateTimeLocal } from "../../../utils/DateUtil";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";

const paymentTypes = ["CASH", "UPI"];
const paymentStatusTypes = ["COMPLETED", "PENDING"];

const PaymentList = ({ data, field }) => {
    const value = Array.isArray(data?.[field?.name]) ? data[field.name] : [];
    const title = field?.label || "Payments";
    const paidAmount = value.reduce((acc, curr) => acc + curr.amount, 0);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

    const addPayment = async (paymentData) => {
        dispatch(paymentCruds.add({
            payeeType: "BOOKING",
            amount: paymentData.amount,
            paymentDate: paymentData.paymentDate,
            status: paymentData.status,
            paymentType: paymentTypes[0],
            branchId: data.branchId,
            payeeId: data.id,
        }, token, showAlert, setLoading, true));
        if (!loading) {
            setTimeout(() => {
                dispatch(bookingCruds.getById(data.id, token, showAlert, setLoading, { forceRefresh: true }))
            }, 2000);
        }
        setOpenPaymentDialog(false);
    }
    return (
        <Box sx={{ mt: 1 }}>
            {loading && <Loading />}
            <FlexBetween p={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, my: "auto" }}>
                    {title}
                </Typography>
                <Button startIcon={<AddCircleOutline />} onClick={() => setOpenPaymentDialog(true)} disabled={data.totalAmount === paidAmount} variant="contained" size="small" >
                    Add Payment
                </Button>
            </FlexBetween>

            <StyledCardContainer>
                {value.map((m) => (
                    <StyledMotionCard key={m.id}>
                        <StyledCardContent>
                            <PaymentCard row={m} />
                        </StyledCardContent>
                    </StyledMotionCard>
                ))}
            </StyledCardContainer>
            {openPaymentDialog && (
                <PaymentEntryDialog
                    open={true}
                    onSave={addPayment}
                    onClose={() => setOpenPaymentDialog(false)}
                    initialData={{ amount: data.totalAmount - paidAmount, paymentDate: getCurrentDateTimeLocal(), status: paymentStatusTypes[0], paymentType: paymentTypes[0] }}
                    paymentStatus={paymentStatusTypes.map((ps) => ({ label: ps, value: ps }))}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
        </Box>
    );
};

PaymentList.propTypes = {
    data: PropTypes.object.isRequired,
    field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    }).isRequired,
};

export default PaymentList;
