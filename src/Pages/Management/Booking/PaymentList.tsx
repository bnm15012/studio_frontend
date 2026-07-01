import PropTypes from "prop-types";
import { Typography, Box, Button, IconButton } from "@mui/material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "../../../core/components/cards/StyledCard";
import PaymentCard from "../Payments/PaymentCardView";
import { FlexBetween } from "../../../core/components/layout/FlexBox";
import { AddCircleOutline, Edit } from "@mui/icons-material";
import { bookingCruds, paymentCruds } from "../../../api/all.api";
import { useState } from "react";
import { getCurrentDateTimeLocal } from "../../../core/utils/DateUtil";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../core/components/loading/Loading";
import { useAlert } from "../../../core/components/feedback/Alert";
import DialogForm from "../../../core/crud/DialogForm";

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
    const [paymentFormData, setPaymentFormData] = useState();

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
        if (paymentFormData.id !== "NEW") {
            dispatch(paymentCruds.update(paymentFormData.id, paymentFormData, token, showAlert, setLoading, true));
        } else {
            dispatch(paymentCruds.add({
                payeeType: "BOOKING",
                amount: paymentFormData.amount,
                paymentDate: paymentFormData.paymentDate,
                status: paymentFormData.status,
                paymentType: paymentTypes[0],
                branchId: data.branchId,
                payeeId: data.id,
            }, token, showAlert, setLoading, true));
        }
        if (!loading) {
            setTimeout(() => {
                dispatch(bookingCruds.getById(data.id, token, showAlert, setLoading, { forceRefresh: true }))
            }, 1000);
        }
        setOpenPaymentDialog(false);
        setPaymentFormData(null);
    }
    return (
        <Box sx={{ mt: 1 }}>
            {loading && <Loading />}
            <FlexBetween p={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, my: "auto" }}>
                    {title}
                </Typography>
                <Button startIcon={<AddCircleOutline />} onClick={() => {
                    setOpenPaymentDialog(true);
                    setPaymentFormData({
                        id: "NEW",
                        amount: data.totalAmount - paidAmount,
                        paymentDate: getCurrentDateTimeLocal(),
                        status: paymentStatusTypes[0],
                        paymentType: paymentTypes[0]
                    });
                }} disabled={data.totalAmount === paidAmount} variant="contained" size="small" >
                    Add Payment
                </Button>
            </FlexBetween>

            <StyledCardContainer>
                {value.map((m) => (
                    <StyledMotionCard key={m.id}>
                        <StyledCardContent>
                            <PaymentCard row={m} />
                        </StyledCardContent>
                        <StyledCardActions>
                            <IconButton onClick={() => { setOpenPaymentDialog(true); setPaymentFormData(m); }}>
                                <Edit />
                            </IconButton>
                        </StyledCardActions>
                    </StyledMotionCard>
                ))}
            </StyledCardContainer>
            {openPaymentDialog && (
                <DialogForm
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
                            getValue: (value) => value && ({ key: value, value }),
                            extraProp: {
                                getOptions: async (search, page, limit) =>
                                    ["PENDING", "COMPLETED"].filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                                        .slice(page * limit, (page + 1) * limit)
                                        .map((a) => ({ key: a, value: a })),
                            },
                        },
                        {
                            name: "paymentType",
                            label: "Payment Category",
                            type: "SELECT",
                            getValue: (value) => value && ({ key: value, value }),
                            extraProp: {
                                getOptions: async (search, page, limit) =>
                                    ["CASH", "UPI"].filter((a) => a.toLowerCase().includes(search.toLowerCase()))
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

PaymentList.propTypes = {
    data: PropTypes.object.isRequired,
    field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    }).isRequired,
};

export default PaymentList;
