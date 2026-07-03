import React from "react";
import { Activity, Calendar, Wallet, TimerReset, Clock1 } from "lucide-react";
import { useTheme, Box } from "@mui/material";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { Class, Task } from "@mui/icons-material";
import ShowMoreDialog from "@/core/crud/ShowMoreDialog";

interface StudentAssignActivityCardProps {
    row: {
        activityName?: string;
        batchName?: string;
        batchTime?: string;
        registrationDate?: string;
        membershipStartDate?: string;
        membershipEndDate?: string;
        membershipType?: string;
        membershipStatus?: string;
        activityAmount?: number | string;
        daysPerWeek?: number | string;
        paymentEntry?: any;
    };
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
    } = row;

    const amountDisplay =
        paymentEntry?.amount !== paymentEntry?.actualAmount ? (
            <>
                Rs. {paymentEntry?.amount}{" "}
                <span
                    style={{
                        textDecoration: "line-through",
                        color: theme.palette.error.main,
                    }}
                >
                    Rs. {paymentEntry?.actualAmount}
                </span>
            </>
        ) : (
            `Rs. ${paymentEntry?.amount || 0}`
        );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={membershipStatus || ""}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName || ""}
                FieldIcon={Activity}
                image={undefined}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={registrationDate || ""} type="DATE" ChipIcon={Calendar} />
                <CardChip value={amountDisplay as any} ChipIcon={Wallet} />
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={`${daysPerWeek || 0} days/week`} ChipIcon={Calendar} />
                <ShowMoreDialog title={"More Activity Details"}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, py: 1 }}>
                        <CardChip value={`Batch: ${batchName || "-"}`} ChipIcon={Class} />
                        <CardChip value={`Time: ${batchTime || "-"}`} ChipIcon={Clock1} />
                        <CardChip value={membershipStartDate || ""} type="DATE" ChipIcon={TimerReset} />
                        <CardChip value={membershipEndDate || ""} type="DATE" ChipIcon={TimerReset} />
                        <CardChip value={`Type: ${membershipType || "-"}`} ChipIcon={Task} />
                        <CardChip
                            value={
                                paymentEntry?.paymentDate
                                    ? getLocalDateTime(paymentEntry.paymentDate)
                                    : "Not Paid"
                            }
                            ChipIcon={Wallet}
                        />
                    </Box>
                </ShowMoreDialog>
            </Box>
        </Box>
    );
};

export default StudentAssignActivityCard;
