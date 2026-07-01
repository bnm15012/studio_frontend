import { CurrencyRupee } from "@mui/icons-material";
import PropTypes from "prop-types";
import { IndianRupeeIcon, QrCodeIcon, User2 } from "lucide-react";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { Box } from "@mui/material";

const PaymentCard = ({ row }) => {
    const { payeeType, status, paymentDate, paymentType, amount, payeeName } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                FieldIcon={IndianRupeeIcon}
                fieldValue={amount}
                enabled={status?.toLowerCase() === "completed"}
                badge={status}
            />
            <CardChip
                value={(payeeName || "N/A") + " (" + payeeType + ")"}
                ChipIcon={User2}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip
                    value={paymentType}
                    ChipIcon={paymentType === "CASH" ? CurrencyRupee : QrCodeIcon}
                />
                <CardChip type="DATETIME" value={paymentDate} />
            </Box>
        </Box>
    );
};

PaymentCard.propTypes = {
    row: PropTypes.shape({
        payeeType: PropTypes.string,
        status: PropTypes.string,
        paymentDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        paymentType: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        payeeName: PropTypes.string,
    }).isRequired,
};

export default PaymentCard;
