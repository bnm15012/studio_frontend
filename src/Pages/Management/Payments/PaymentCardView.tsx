import React from "react";
import { CurrencyRupee } from "@mui/icons-material";
import { IndianRupeeIcon, QrCodeIcon, User2 } from "lucide-react";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { Box } from "@mui/material";
import { Payment } from "@/api/types";

interface PaymentCardProps {
    row: Payment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ row }) => {
    const { payeeType, status, paymentDate, paymentType, amount, payeeName } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                FieldIcon={IndianRupeeIcon}
                fieldValue={Number(amount || 0).toLocaleString("en-IN")}
                enabled={status?.toLowerCase() === "completed"}
                badge={status || ""}
            />
            <CardChip
                value={(payeeName || "N/A") + " (" + (payeeType || "") + ")"}
                ChipIcon={User2}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip
                    value={paymentType || ""}
                    ChipIcon={paymentType === "CASH" ? CurrencyRupee : QrCodeIcon}
                />
                <CardChip type="DATETIME" value={paymentDate ? String(paymentDate) : ""} />
            </Box>
        </Box>
    );
};

export default PaymentCard;
