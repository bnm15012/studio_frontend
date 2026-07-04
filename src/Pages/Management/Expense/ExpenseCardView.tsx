import React from "react";
import { CalendarMonth, Description } from "@mui/icons-material";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { IndianRupee } from "lucide-react";
import { Box } from "@mui/material";
import { Expense } from "@/api/types";

interface ExpenseCardProps {
    row: Expense;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ row }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <CardHeader
            enabled={true}
            badge={row.expenseCategory || ""}
            FieldIcon={IndianRupee}
            fieldValue={Number(row.amount || 0).toLocaleString("en-IN")}
        />
        <Box display="flex" alignItems="center" gap={1.5}>
            <CardChip
                ChipIcon={CalendarMonth}
                value={row.expenseDate ? String(row.expenseDate) : ""}
                type="DATE"
            />
            {row.description && (
                <CardChip ChipIcon={Description} value={row.description} />
            )}
        </Box>
    </Box>
);

export default ExpenseCard;
