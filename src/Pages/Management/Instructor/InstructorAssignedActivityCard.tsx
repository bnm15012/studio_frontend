import React from "react";
import { Activity, Calendar, FileText, TimerReset } from "lucide-react";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import ImageDialog from "@/core/crud/ImageDialog";
import { Box } from "@mui/material";
import { InstructorAssignment } from "@/api/types";

interface InstructorAssignedActivityCardProps {
    row: InstructorAssignment;
}

const InstructorAssignedActivityCard: React.FC<InstructorAssignedActivityCardProps> = ({ row }) => {
    const { activityName, assignedDate, startDate, endDate, contractDocument, membershipStatus } =
        row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={membershipStatus || ""}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName || ""}
                FieldIcon={Activity}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={assignedDate || ""} type="DATE" ChipIcon={Calendar} />
                <CardChip value={startDate || ""} type="DATE" ChipIcon={TimerReset} />
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={endDate || ""} type="DATE" ChipIcon={TimerReset} />
                {contractDocument && (
                    <CardChip
                        value={<ImageDialog image={contractDocument} setImage={() => {}} />}
                        ChipIcon={FileText}
                    />
                )}
            </Box>
        </Box>
    );
};

export default InstructorAssignedActivityCard;
