import { CardContent, Box, Typography, Chip, Divider, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CalendarMonth, Paid, CreditCard } from "@mui/icons-material";
import PropTypes from "prop-types";
import { format } from "date-fns";

const HeaderGradient = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(2, 3),
    justifyContent: "space-between",
    alignItems: "center",
}));

const PaymentCard = ({ row }) => {
    const theme = useTheme();
    const { payeeType, status, paymentDate, paymentType, amount } = row;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "success";
            case "pending":
                return "warning";
            case "failed":
                return "error";
            default:
                return "default";
        }
    };

    const formattedDate = paymentDate ? format(new Date(paymentDate), "dd MMM yyyy") : "—";

    return (
        <>
            {/* Gradient Header */}
            <HeaderGradient>
                <Typography variant="subtitle1" fontWeight={600}>
                    {payeeType || "Unknown Payee"}
                </Typography>
                <Chip
                    size="small"
                    label={status}
                    color={getStatusColor(status)}
                    sx={{
                        backgroundColor:
                            theme.palette[getStatusColor(status)]?.main + " !important",
                        color: theme.palette.common.white + " !important",
                        fontWeight: 600,
                        textTransform: "capitalize",
                    }}
                />
            </HeaderGradient>

            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Payment Type */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        sx={{
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                            background: theme.palette.primary.main + "15",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CreditCard sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Payment Type
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {paymentType}
                        </Typography>
                    </Box>
                </Box>

                {/* Payment Date */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        sx={{
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                            background: theme.palette.info.main + "15",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CalendarMonth sx={{ color: theme.palette.info.main }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Payment Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {formattedDate}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Amount */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        backgroundColor: theme.palette.action.hover,
                        p: 1.5,
                        borderRadius: 2,
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Paid sx={{ color: theme.palette.success.main }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Amount
                        </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        ₹{Number(amount).toLocaleString()}
                    </Typography>
                </Box>
            </CardContent>
        </>
    );
};

PaymentCard.propTypes = {
    row: PropTypes.shape({
        payeeType: PropTypes.string,
        status: PropTypes.string,
        paymentDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        paymentType: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default PaymentCard;
