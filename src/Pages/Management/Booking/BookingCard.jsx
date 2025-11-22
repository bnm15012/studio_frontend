import PropTypes from "prop-types";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import { isPast } from "../../../utils/DateUtil";
import { CreditCard, Hourglass, Target } from "lucide-react";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";
import { Person } from "@mui/icons-material";

const BookingCard = ({ row }) => {
    const { purpose, clientEntry, totalAmount, startTime, endTime, finalPaymentDate } = row;
    return (
        <>
            <CardHeader
                fieldValue={purpose}
                FieldIcon={Target}
                badge={finalPaymentDate ? "Fully Paid" : "Pending Payment"}
                enabled={!isPast(startTime)}
            />
            <CardChip label={"Client Name"} ChipIcon={Person} value={clientEntry?.pocName} />
            <CardChip label={"Total Amount"} ChipIcon={CreditCard} value={totalAmount} />
            <CardChip
                label={"Meeting Date"}
                ChipIcon={Hourglass}
                value={startTime + " - " + endTime}
            />
        </>
    );
};

BookingCard.propTypes = {
    row: PropTypes.shape({
        purpose: PropTypes.string,
        clientEntry: PropTypes.shape({
            pocName: PropTypes.string,
        }),
        totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        startTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
            PropTypes.number,
        ]),
        endTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
            PropTypes.number,
        ]),
        finalPaymentDate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date),
            PropTypes.number,
        ]),
    }).isRequired,
};

export default BookingCard;
