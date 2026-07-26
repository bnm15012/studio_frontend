import CardHeader from "@/core/components/cards/CardHeader";
import { isPast } from "@/core/utils/DateUtil";
import { CreditCard, Hourglass, Target } from "lucide-react";
import CardChip from "@/core/components/cards/CardChip";
import { Person } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { Booking } from "@/api/types";

const BookingCard = ({ row }: { row: Booking }) => {
    const { purpose, clientEntry, totalAmount, startTime, endTime } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={String(purpose)}
                FieldIcon={Target}
                badge={row.state}
                enabled={!isPast(startTime as string)}
            />
            <FlexBetween>
                {!!clientEntry.pocName && (
                    <CardChip ChipIcon={Person} value={String(clientEntry.pocName)} />
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
