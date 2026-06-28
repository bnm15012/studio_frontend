import PropTypes from "prop-types";
import { Activity, Calendar, FileText, TimerReset } from "lucide-react";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import ImageDialog from "../../../core/crud/ImageDialog";
import { Box } from "@mui/material";

const InstructorAssignedActivityCard = ({ row }) => {
    const { activityName, assignedDate, startDate, endDate, contractDocument, membershipStatus } =
        row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName}
                FieldIcon={Activity}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={assignedDate} type="DATE" ChipIcon={Calendar} />
                <CardChip value={startDate} type="DATE" ChipIcon={TimerReset} />
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={endDate} type="DATE" ChipIcon={TimerReset} />
                {contractDocument && (
                    <CardChip
                        value={<ImageDialog image={contractDocument} />}
                        ChipIcon={FileText}
                    />
                )}
            </Box>
        </Box>
    );
};

InstructorAssignedActivityCard.propTypes = {
    row: PropTypes.shape({
        assignmentId: PropTypes.number,
        activityName: PropTypes.string,
        assignedDate: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        contractDocument: PropTypes.string,
        membershipStatus: PropTypes.string,
        instructorId: PropTypes.number,
    }).isRequired,
};

export default InstructorAssignedActivityCard;
