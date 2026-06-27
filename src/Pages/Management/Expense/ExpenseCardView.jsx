import { CalendarMonth, Description } from "@mui/icons-material";
import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { IndianRupee } from "lucide-react";

const ExpenseCard = ({ row }) => (
    <>
        <CardHeader
            enabled={true}
            badge={row.expenseCategory}
            FieldIcon={IndianRupee}
            fieldValue={Number(row.amount).toLocaleString("en-IN")}
        />

        <CardChip ChipIcon={Description} label={"Description"} value={row.description} />
        <CardChip
            ChipIcon={CalendarMonth}
            label={"Expense Date"}
            value={row.expenseDate}
            type="DATE"
        />
    </>
);

ExpenseCard.propTypes = {
    row: PropTypes.shape({
        expenseCategory: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        expenseDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    }).isRequired,
};

export default ExpenseCard;
