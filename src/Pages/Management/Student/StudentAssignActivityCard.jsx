import PropTypes from "prop-types";
import { Activity, Calendar, Wallet, TimerReset, Clock1 } from "lucide-react";

import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { Class } from "@mui/icons-material";

const StudentAssignActivityCard = ({ row }) => {
    const {
        activityName,
        batchName,
        batchTime,
        registrationDate,
        membershipStartDate,
        membershipEndDate,
        membershipType,
        membershipStatus,
        activityAmount,
        daysPerWeek,
        paymentEntry,
    } = row;

    return (
        <>
            {/* Header */}
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE" ? "Active" : "Inactive"}
                fieldValue={activityName}
                image={null}
                badgeSx={{ backgroundColor: membershipStatus === "ACTIVE" ? "green" : "grey.400" }}
            />
            <CardChip value={batchTime} label="Batch Time" ChipIcon={Clock1} />
            <CardChip value={batchName} label="Batch Name" ChipIcon={Class} />
            <CardChip
                value={registrationDate}
                type="DATE"
                label="Registration Date"
                ChipIcon={Calendar}
            />
            <CardChip
                value={membershipStartDate}
                type="DATE"
                label="Membership Start"
                ChipIcon={TimerReset}
            />
            <CardChip
                value={membershipEndDate}
                type="DATE"
                label="Membership End"
                ChipIcon={TimerReset}
            />
            <CardChip value={membershipType} label="Membership Type" ChipIcon={Activity} />
            <CardChip value={`₹${activityAmount}`} label="Amount" ChipIcon={Wallet} />
            <CardChip value={daysPerWeek} label="Days Per Week" ChipIcon={Calendar} />
            <CardChip
                value={
                    paymentEntry?.paymentDate
                        ? getLocalDateTime(paymentEntry.paymentDate)
                        : "Not Paid"
                }
                label="Last Payment Date"
                ChipIcon={Wallet}
            />
        </>
    );
};

StudentAssignActivityCard.propTypes = {
    row: PropTypes.shape({
        activityName: PropTypes.string,
        batchName: PropTypes.string,
        batchTime: PropTypes.string,
        registrationDate: PropTypes.string,
        membershipStartDate: PropTypes.string,
        membershipEndDate: PropTypes.string,
        membershipType: PropTypes.string,
        membershipStatus: PropTypes.string,
        activityAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        daysPerWeek: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        paymentEntry: PropTypes.object,
    }).isRequired,
};

export default StudentAssignActivityCard;
