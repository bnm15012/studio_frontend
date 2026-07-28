import { isPast } from "@/core/utils/DateUtil";
import { CreditCard, Clock, Target, CheckCircle2, XCircle, Circle } from "lucide-react";
import { Person } from "@mui/icons-material";
import { Box, Chip, Typography, alpha, useTheme } from "@mui/material";
import { Booking } from "@/api/types";

const STATE_CONFIG = {
    CONFIRMED: {
        color: "#22c55e",
        icon: <Circle size={10} fill="#22c55e" />,
    },
    CANCELLED: {
        color: "#ef4444",
        icon: <XCircle size={10} />,
    },
    COMPLETED: {
        color: "#3b82f6",
        icon: <CheckCircle2 size={10} />,
    },
} as const;

const PAYMENT_CONFIG = {
    COMPLETED: { label: "Paid", color: "#22c55e" },
    "PARTIALLY PAID": { label: "Partial", color: "#f59e0b" },
    PENDING: { label: "Due", color: "#ef4444" },
} as const;

const fmt = (dt: string | undefined | null) => {
    if (!dt) return "";
    try {
        return new Date(dt).toLocaleString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return String(dt);
    }
};

const BookingCard = ({ row }: { row: Booking }) => {
    const theme = useTheme();
    const { purpose, clientEntry, totalAmount, startTime, endTime, state, paymentEntries } = row;

    // Derive payment status
    const paidAmount = Array.isArray(paymentEntries)
        ? paymentEntries
              .filter((p) => p.status === "COMPLETED")
              .reduce((acc, p) => acc + (p.amount as number), 0)
        : 0;
    const dueAmount = ((totalAmount as number) || 0) - paidAmount;
    const paymentStatus =
        dueAmount === 0
            ? "COMPLETED"
            : dueAmount < (totalAmount as number)
              ? "PARTIALLY PAID"
              : "PENDING";

    const stateConf = STATE_CONFIG[state as keyof typeof STATE_CONFIG];
    const payConf = PAYMENT_CONFIG[paymentStatus as keyof typeof PAYMENT_CONFIG];
    const isExpired = isPast(startTime as string);
    const stateColor = stateConf?.color ?? "#9e9e9e";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderLeft: `3px solid ${stateColor}`,
                pl: 1.25,
            }}
        >
            {/* ── Header row: purpose + state chip ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
                    <Target size={14} color={stateColor} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {String(purpose || "—")}
                    </Typography>
                </Box>
                <Chip
                    size="small"
                    label={state}
                    icon={stateConf?.icon as React.ReactElement}
                    sx={{
                        height: 22,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 0.5,
                        color: stateColor,
                        backgroundColor: alpha(stateColor, 0.12),
                        border: `1.5px solid ${alpha(stateColor, 0.35)}`,
                        "& .MuiChip-icon": { color: stateColor, ml: 0.5 },
                        flexShrink: 0,
                    }}
                />
            </Box>

            {/* ── Client + Amount row ── */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {!!clientEntry?.pocName && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Person sx={{ fontSize: 13, color: "text.secondary" }} />
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                            {clientEntry.pocName}
                        </Typography>
                    </Box>
                )}
                {totalAmount != null && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CreditCard size={12} color={theme.palette.text.secondary} />
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                            ₹{totalAmount}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── Time row ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Clock
                    size={12}
                    color={isExpired ? theme.palette.text.disabled : theme.palette.text.secondary}
                />
                <Typography
                    variant="caption"
                    sx={{
                        color: isExpired ? "text.disabled" : "text.secondary",
                        fontStyle: isExpired ? "italic" : "normal",
                        fontSize: 11,
                    }}
                >
                    {fmt(startTime as string)} — {fmt(endTime as string)}
                </Typography>
            </Box>

            {/* ── Payment status badge ── */}
            <Box>
                <Chip
                    size="small"
                    label={payConf?.label ?? paymentStatus}
                    sx={{
                        height: 18,
                        fontSize: 9.5,
                        fontWeight: 800,
                        letterSpacing: 0.4,
                        color: payConf?.color ?? "#9e9e9e",
                        backgroundColor: alpha(payConf?.color ?? "#9e9e9e", 0.1),
                        border: `1px solid ${alpha(payConf?.color ?? "#9e9e9e", 0.3)}`,
                    }}
                />
                {dueAmount > 0 && state !== "CANCELLED" && (
                    <Typography
                        variant="caption"
                        sx={{ ml: 0.75, fontSize: 10, color: "text.disabled" }}
                    >
                        ₹{dueAmount} due
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default BookingCard;
