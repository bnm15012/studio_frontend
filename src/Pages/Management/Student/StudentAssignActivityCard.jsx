import PropTypes from "prop-types";
import { Activity, Calendar, Wallet, TimerReset, Clock1 } from "lucide-react";
import { useTheme } from "@mui/material";

import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { getLocalDateTime } from "../../../core/utils/DateUtil";
import { Class, Task } from "@mui/icons-material";
import ShowMoreDialog from "../../../core/crud/ShowMoreDialog";

const StudentAssignActivityCard = ({ row }) => {
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

    return (
        <>
            {/* Header */}
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={activityName}
                FieldIcon={Activity}
                image={null}
            />
            <CardChip
                value={registrationDate}
                type="DATE"
                label="Registration Date"
                ChipIcon={Calendar}
            />
            <CardChip value={paymentEntry?.amount !== paymentEntry?.actualAmount ? (
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
                `Rs. ${paymentEntry?.amount}`
            )
            } label="Amount" ChipIcon={Wallet} />
            <CardChip value={daysPerWeek} label="Days Per Week" ChipIcon={Calendar} />
            <ShowMoreDialog title={"More Activity Details"}>
                <CardChip value={batchTime} label="Batch Time" ChipIcon={Clock1} />
                <CardChip value={batchName} label="Batch Name" ChipIcon={Class} />
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
                <CardChip value={membershipType} label="Membership Type" ChipIcon={Task} />
                <CardChip
                    value={
                        paymentEntry?.paymentDate
                            ? getLocalDateTime(paymentEntry.paymentDate)
                            : "Not Paid"
                    }
                    label="Last Payment Date"
                    ChipIcon={Wallet}
                />
            </ShowMoreDialog>
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
