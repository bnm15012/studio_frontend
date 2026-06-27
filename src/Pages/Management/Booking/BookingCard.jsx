import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import { isPast } from "../../../core/utils/DateUtil";
import { CreditCard, Hourglass, Target } from "lucide-react";
import CardChip from "../../../core/components/cards/CardChip";
import { Person } from "@mui/icons-material";

const BookingCard = ({ row }) => {
    const { purpose, clientEntry, totalAmount, startTime, endTime, paymentEntries } = row;
    const getStatus = () => {
        const dueAmount =
            (row.totalAmount || 0) -
            ((Array.isArray(paymentEntries) &&
                paymentEntries
                    .filter((p) => p.status == "COMPLETED")
                    .map((p) => p.amount)
                    .reduce((a, b) => a + b, 0)) ||
                0);
        if (dueAmount === 0) {
            return "COMPLETED";
        } else if (dueAmount > 0) {
            return "PARTIALLY PAID";
        }
        return "PENDING";
    };
    return (
        <>
            <CardHeader
                fieldValue={purpose}
                FieldIcon={Target}
                badge={getStatus()}
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
        paymentEntries: PropTypes.array,
    }).isRequired,
};

export default BookingCard;
