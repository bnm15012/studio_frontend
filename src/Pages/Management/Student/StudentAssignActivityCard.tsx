import React from "react";
import { Activity, Calendar, Wallet, TimerReset, Clock1, Layers, Sparkles } from "lucide-react";
import { useTheme, Box, Typography, Divider, Stack } from "@mui/material";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import ShowMoreDialog from "@/core/crud/ShowMoreDialog";
import { StudentAssignment } from "@/api/types";

interface StudentAssignActivityCardProps {
    row: StudentAssignment;
}

const StudentAssignActivityCard: React.FC<StudentAssignActivityCardProps> = ({ row }) => {
    const theme = useTheme();
    const {
        activityName,
        batchName,
        batchTime,
        registrationDate,
        membershipStartDate,
        membershipEndDate,
        membershipType,
        membershipStatus,
        daysPerWeek,
        paymentEntry,
        activityAmount,
    } = row;

    const actualAmount = paymentEntry?.actualAmount ?? activityAmount;
    const finalAmount = paymentEntry?.amount ?? activityAmount ?? 0;
    const hasDiscount =
        actualAmount !== undefined &&
        finalAmount !== undefined &&
        Number(actualAmount) > Number(finalAmount);

    const amountDisplay = hasDiscount ? (
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <Typography
                component="span"
                sx={{ fontWeight: 600, color: "text.primary", fontSize: "inherit" }}
            >
                ₹{Number(finalAmount).toLocaleString("en-IN")}
            </Typography>
            <Typography
                component="span"
                sx={{
                    textDecoration: "line-through",
                    color: theme.palette.error.main,
                    fontSize: "0.75rem",
                    opacity: 0.85,
                }}
            >
                ₹{Number(actualAmount).toLocaleString("en-IN")}
            </Typography>
        </Box>
    ) : (
        `₹${Number(finalAmount).toLocaleString("en-IN")}`
    );

    const subtitleText = [membershipType, daysPerWeek ? `${daysPerWeek} days/wk` : null]
        .filter(Boolean)
        .join(" • ");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName || "Activity"}
                FieldIcon={Activity}
                subtitle={subtitleText || undefined}
            />

            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                <CardChip
                    value={membershipStartDate || registrationDate}
                    type="DATE"
                    ChipIcon={Calendar}
                />
                <CardChip value={amountDisplay} ChipIcon={Wallet} />
            </Box>

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                flexWrap="wrap"
            >
                {batchName || batchTime ? (
                    <CardChip
                        value={`${batchName || ""}${batchName && batchTime ? " • " : ""}${batchTime || ""}`}
                        ChipIcon={Clock1}
                    />
                ) : (
                    <CardChip value={membershipEndDate} type="DATE" ChipIcon={TimerReset} />
                )}

                <ShowMoreDialog title={`${activityName || "Activity"} Details`}>
                    <Stack spacing={1.75} sx={{ minWidth: { xs: 260, sm: 360 }, py: 0.5 }}>
                        {/* Membership & Validity Section */}
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                    fontWeight: 700,
                                    color: "text.secondary",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 1,
                                }}
                            >
                                <Sparkles size={13} /> Validity & Plan
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                                <CardChip
                                    value={`Plan: ${membershipType || "-"}`}
                                    ChipIcon={Layers}
                                />
                                <CardChip
                                    value={`${daysPerWeek || 0} Days per week`}
                                    ChipIcon={Calendar}
                                />
                                <CardChip
                                    value={`Registered: ${getLocalDateTime(registrationDate, "DATE")}`}
                                    ChipIcon={Calendar}
                                />
                                <CardChip
                                    value={`Starts: ${getLocalDateTime(membershipStartDate, "DATE")}`}
                                    ChipIcon={TimerReset}
                                />
                                <CardChip
                                    value={`Expires: ${getLocalDateTime(membershipEndDate, "DATE")}`}
                                    ChipIcon={TimerReset}
                                />
                            </Box>
                        </Box>

                        <Divider />

                        {/* Batch & Schedule Section */}
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                    fontWeight: 700,
                                    color: "text.secondary",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 1,
                                }}
                            >
                                <Clock1 size={13} /> Batch & Schedule
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                                <CardChip
                                    value={`Batch: ${batchName || "Not assigned"}`}
                                    ChipIcon={Clock1}
                                />
                                <CardChip value={`Timing: ${batchTime || "-"}`} ChipIcon={Clock1} />
                            </Box>
                        </Box>

                        {/* Payment Details Section */}
                        {paymentEntry && (
                            <>
                                <Divider />
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            textTransform: "uppercase",
                                            letterSpacing: 0.8,
                                            fontWeight: 700,
                                            color: "text.secondary",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mb: 1,
                                        }}
                                    >
                                        <Wallet size={13} /> Payment Info
                                    </Typography>
                                    <Box
                                        sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
                                    >
                                        <CardChip value={amountDisplay} ChipIcon={Wallet} />
                                        {paymentEntry.paymentType && (
                                            <CardChip
                                                value={`Method: ${paymentEntry.paymentType}`}
                                                ChipIcon={Wallet}
                                            />
                                        )}
                                        {paymentEntry.paymentDate && (
                                            <CardChip
                                                value={`Paid on: ${getLocalDateTime(String(paymentEntry.paymentDate), "DATE")}`}
                                                ChipIcon={Calendar}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Stack>
                </ShowMoreDialog>
            </Box>
        </Box>
    );
};

export default StudentAssignActivityCard;
