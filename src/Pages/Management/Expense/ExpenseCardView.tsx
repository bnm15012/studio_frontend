import { CalendarMonth, Description } from "@mui/icons-material";
import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { IndianRupee } from "lucide-react";
import { Box } from "@mui/material";

const ExpenseCard = ({ row }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <CardHeader
            enabled={true}
            badge={row.expenseCategory}
            FieldIcon={IndianRupee}
            fieldValue={Number(row.amount).toLocaleString("en-IN")}
        />
        <Box display="flex" alignItems="center" gap={1.5}>
            <CardChip
                ChipIcon={CalendarMonth}
                value={row.expenseDate}
                type="DATE"
            />
            {row.description && (
                <CardChip ChipIcon={Description} value={row.description} />
            )}
        </Box>
    </Box>
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
