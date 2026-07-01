import { useAppSelector } from "@/state";
import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, TableCell } from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useUI } from "../../../context/UIContext";

interface ActivityMembershipSelectorProps {
    onSelect: (...args: any[]) => void;
    selectedData?: any;
    isMemberSHipToo?: boolean;
}

const ActivityMembershipSelector: React.FC<ActivityMembershipSelectorProps> = ({ onSelect, selectedData, isMemberSHipToo = true }) => {
    const { isBatchEnabled } = useUI();
    const activities = useAppSelector((state: any) => state.activities.items);

    const [selectedActivity, setSelectedActivity] = useState<any>(
        activities.find((f: any) => f.activityId === selectedData?.activity?.activityId) || null,
    );
    const [selectedMembership, setSelectedMembership] = useState(
        selectedData?.membershipType || "",
    );
    const [daysPerWeek, setDaysPerWeek] = useState<any>(null);
    const [batchName, setBatchName] = useState(selectedData?.batchName || "");
    const [batchTime, setBatchTime] = useState("");

    const [availableMemberships, setAvailableMemberships] = useState<any[]>([]); // planTypes
    const [availableDaysOptions, setAvailableDaysOptions] = useState<any[]>([]); // filter by membership
    const [availableBatches, setAvailableBatches] = useState<any[]>([]); // filter by days

    // when activity changes
    const handleActivityChange = (_event, activity) => {
        setSelectedActivity(activity);
        setSelectedMembership("");
        setDaysPerWeek(null);
        setBatchName("");
        setBatchTime("");
        setAvailableMemberships([...new Set(activity.batchEntries.map((b) => b.planType))]);
        setAvailableDaysOptions([]);
        setAvailableBatches([]);

        onSelect(null, activity, "", "", "", null, null);
    };

    // when membership(planType) changes
    const handleMembershipChange = (event) => {
        const membership = event.target.value;
        const filteredPlans =
            selectedActivity?.batchEntries.filter((b) => b.planType === membership) || [];

        setSelectedMembership(membership);
        setAvailableDaysOptions(filteredPlans);
        setDaysPerWeek(null);
        setAvailableBatches([]);
        setBatchName("");
        setBatchTime("");

        onSelect(null, selectedActivity, membership, "", "", null, null);
    };

    // when days per week changes
    const handleDaysPerWeekChange = (event) => {
        const selectedDays = event.target.value;
        const batches = availableDaysOptions.filter((p) => p.daysPerWeek === selectedDays) || [];

        const firstBatch = batches[0] || {};
        const updatedBatchName = firstBatch.name || "";
        const updatedBatchTime = `${firstBatch.startTime || "00:00"} - ${firstBatch.endTime || "00:00"
            }`;
        const updatedAmount = firstBatch.price || 0;

        setDaysPerWeek(selectedDays);
        setAvailableBatches(batches);
        setBatchName(updatedBatchName);
        setBatchTime(updatedBatchTime);

        onSelect(
            null,
            selectedActivity,
            selectedMembership,
            updatedBatchName,
            updatedBatchTime,
            selectedDays,
            updatedAmount,
        );
    };

    useEffect(() => {
        if (selectedActivity) {
            setAvailableMemberships([
                ...new Set(selectedActivity.batchEntries.map((b) => b.planType)),
            ]);
        }
    }, [selectedActivity]);

    return (
        <>
            {" "}
            {/* Activity */}
            <TableCell>
                <FormControl fullWidth>
                    <Select
                        variant="standard"
                        value={selectedActivity?.activityId || ""}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selected = activities.find(
                                (activity) => activity.activityId === selectedId,
                            );
                            if (selected) {
                                handleActivityChange(e, selected);
                            }
                        }}
                        fullWidth
                    >
                        {activities.map((activity) => (
                            <MenuItem key={activity.activityId} value={activity.activityId}>
                                {activity.activityType}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </TableCell>
            {isMemberSHipToo && (
                <>
                    {/* Membership (PlanType) */}
                    <TableCell>
                        <FormControl fullWidth>
                            <Select
                                variant="standard"
                                value={selectedMembership || ""}
                                onChange={handleMembershipChange}
                                fullWidth
                                disabled={!selectedActivity}
                            >
                                {availableMemberships.map((membershipType, idx) => (
                                    <MenuItem key={idx} value={membershipType}>
                                        {membershipType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </TableCell>

                    {/* Days per week */}
                    <TableCell>
                        <FormControl fullWidth>
                            <Select
                                variant="standard"
                                value={daysPerWeek ?? ""}
                                onChange={handleDaysPerWeekChange}
                                fullWidth
                                disabled={!selectedMembership}
                            >
                                {availableDaysOptions
                                    .filter((b, index, self) => {
                                        if (!isBatchEnabled) return true;
                                        return (
                                            index ===
                                            self.findIndex((x) => x.daysPerWeek === b.daysPerWeek)
                                        );
                                    })
                                    .map((plan, index) => (
                                        <MenuItem key={index} value={plan.daysPerWeek}>
                                            {plan.daysPerWeek}{" "}
                                            {plan.daysPerWeek > 1 ? "days/week" : "day/week"}
                                            {isBatchEnabled ? "" : `- Rs.${plan.price}/-`}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </TableCell>
                    {isBatchEnabled && (
                        <>
                            {/* Batch Name */}
                            <TableCell>
                                <FormControl fullWidth>
                                    <Select
                                        variant="standard"
                                        value={batchName}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            setBatchName(selectedName);
                                            const batch = availableBatches.find(
                                                (b) => b.name === selectedName,
                                            );
                                            const amount = batch?.price || 0;
                                            setBatchTime(
                                                `${batch?.startTime || "00:00"} - ${batch?.endTime || "00:00"}`,
                                            );

                                            onSelect(
                                                null,
                                                selectedActivity,
                                                selectedMembership,
                                                selectedName,
                                                `${batch?.startTime || "00:00"} - ${batch?.endTime || "00:00"}`,
                                                daysPerWeek,
                                                amount,
                                            );
                                        }}
                                        fullWidth
                                        disabled={availableBatches.length === 0}
                                    >
                                        {availableBatches.map((batch, idx) => (
                                            <MenuItem key={idx} value={batch.name}>
                                                {batch.name} (Rs. {batch.price})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>

                            {/* Batch time */}
                            <TableCell>{batchTime || "-"}</TableCell>
                        </>
                    )}
                </>
            )}
        </>
    );
};

ActivityMembershipSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selectedData: PropTypes.shape({
        activity: PropTypes.shape({
            activityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            activityType: PropTypes.string,
        }),
        membershipType: PropTypes.string,
        batchName: PropTypes.string,
    }),
    isMemberSHipToo: PropTypes.bool,
};

export default ActivityMembershipSelector;
