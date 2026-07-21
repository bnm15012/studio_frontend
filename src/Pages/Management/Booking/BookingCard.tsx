import CardHeader from "@/core/components/cards/CardHeader";
import { isPast } from "@/core/utils/DateUtil";
import { CreditCard, Hourglass, Target } from "lucide-react";
import CardChip from "@/core/components/cards/CardChip";
import { Person } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";

const BookingCard = ({ row }: { row: Record<string, unknown> }) => {
    const { purpose, clientEntry, totalAmount, startTime, endTime, paymentEntries } = row;
    const getStatus = () => {
        const dueAmount =
            ((row.totalAmount as number) || 0) -
            ((Array.isArray(paymentEntries) &&
                (paymentEntries as Record<string, unknown>[])
                    .filter((p: Record<string, unknown>) => p.status == "COMPLETED")
                    .map((p: Record<string, unknown>) => p.amount as number)
                    .reduce((a: number, b: number) => a + b, 0)) ||
                0);
        if (dueAmount === 0) {
            return "COMPLETED";
        } else if (dueAmount > 0) {
            return "PARTIALLY PAID";
        }
        return "PENDING";
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={String(purpose)}
                FieldIcon={Target}
                badge={getStatus()}
                enabled={!isPast(startTime as string)}
            />
            <FlexBetween>
                {!!(clientEntry as Record<string, unknown>).pocName && (
                    <CardChip
                        ChipIcon={Person}
                        value={String((clientEntry as Record<string, unknown>).pocName)}
                    />
                )}
                {totalAmount !== undefined && totalAmount !== null && (
                    <CardChip ChipIcon={CreditCard} value={`Rs. ${String(totalAmount)}`} />
                )}
            </FlexBetween>
            <CardChip ChipIcon={Hourglass} value={String(startTime) + " - " + String(endTime)} />
        </Box>
    );
};

export default BookingCard;
