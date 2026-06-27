import PropTypes from "prop-types";
import { Activity, Calendar, FileText, TimerReset } from "lucide-react";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import ImageDialog from "../../../core/crud/ImageDialog";

const InstructorAssignedActivityCard = ({ row }) => {
    const { activityName, assignedDate, startDate, endDate, contractDocument, membershipStatus } =
        row;

    return (
        <>
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName}
                FieldIcon={Activity}
            />
            <CardChip value={assignedDate} type="DATE" label="Assigned Date" ChipIcon={Calendar} />
            <CardChip value={startDate} type="DATE" label="Start Date" ChipIcon={TimerReset} />
            <CardChip value={endDate} type="DATE" label="End Date" ChipIcon={TimerReset} />
            <CardChip
                value={contractDocument ? <ImageDialog image={contractDocument} /> : "Not Provided"}
                label="Contract Document"
                ChipIcon={FileText}
            />
        </>
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
