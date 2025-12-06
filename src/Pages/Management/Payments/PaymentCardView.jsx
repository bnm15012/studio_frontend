import { CurrencyRupee } from "@mui/icons-material";
import PropTypes from "prop-types";
import { IndianRupeeIcon, QrCodeIcon, User2 } from "lucide-react";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";

const PaymentCard = ({ row }) => {
    const { payeeType, status, paymentDate, paymentType, amount, payeeName } = row;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "green";
            default:
                return "red";
        }
    };

    return (
        <>
            <CardHeader
                FieldIcon={IndianRupeeIcon}
                fieldValue={amount}
                enabled={status?.toLowerCase() === "completed"}
                badge={status}
                badgeSx={{ background: getStatusColor(status) }}
            />
            <CardChip
                value={(payeeName || "N/A") + " (" + payeeType + ")"}
                ChipIcon={User2}
                label={"Payee Name"}
            />
            <CardChip
                value={paymentType}
                ChipIcon={paymentType === "CASH" ? CurrencyRupee : QrCodeIcon}
                label={"Payment Type"}
            />
            <CardChip type="DATETIME" value={paymentDate} label={"Payment Date"} />
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
        payeeName: PropTypes.string,
    }).isRequired,
};

export default PaymentCard;
