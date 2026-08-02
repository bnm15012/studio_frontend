import { useAppSelector } from "@/state";
import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, TableCell } from "@mui/material";

import { useAppUI } from "@/context/UIContext";
import type { Activity, BatchEntry } from "@/api/types";

interface SelectedActivityData {
    activity?: Activity;
    membershipType?: string;
    batchName?: string;
    [key: string]: string | number | boolean | Activity | undefined;
}

interface ActivityMembershipSelectorProps {
    onSelect: (
        event: React.SyntheticEvent | null,
        activity: Activity | null,
        membership: string,
        batchName: string,
        batchTime: string,
        daysPerWeek: number | null,
        amount: number | null,
    ) => void;
    selectedData?: SelectedActivityData;
    isMemberSHipToo?: boolean;
}

const ActivityMembershipSelector: React.FC<ActivityMembershipSelectorProps> = ({
    onSelect,
    selectedData,
    isMemberSHipToo = true,
}) => {
    const { permissions } = useAppUI();
    const activities = useAppSelector((state) => state.activities.items);

    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
        activities.find((f: Activity) => f.activityId === selectedData?.activity?.activityId) ||
            null,
    );
    const [selectedMembership, setSelectedMembership] = useState(
        selectedData?.membershipType || "",
    );
    const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null);
    const [batchName, setBatchName] = useState((selectedData?.batchName as string) || "");
    const [batchTime, setBatchTime] = useState("");

    const [availableMemberships, setAvailableMemberships] = useState<string[]>([]); // planTypes
    const [availableDaysOptions, setAvailableDaysOptions] = useState<BatchEntry[]>([]); // filter by membership
    const [availableBatches, setAvailableBatches] = useState<BatchEntry[]>([]); // filter by days

    // when activity changes
    const handleActivityChange = (_event: React.SyntheticEvent, activity: Activity) => {
        setSelectedActivity(activity);
        setSelectedMembership("");
        setDaysPerWeek(null);
        setBatchName("");
        setBatchTime("");
        setAvailableMemberships([
            ...new Set((activity.batchEntries ?? []).map((b: BatchEntry) => String(b.planType))),
        ]);
        setAvailableDaysOptions([]);
        setAvailableBatches([]);

        onSelect(null, activity, "", "", "", null, null);
    };

    // when membership(planType) changes
    const handleMembershipChange = (event: React.SyntheticEvent<Element>) => {
        const membership = String((event as React.ChangeEvent<HTMLInputElement>).target.value);
        const filteredPlans =
            (selectedActivity?.batchEntries ?? []).filter(
                (b: BatchEntry) => b.planType === membership,
            ) || [];

        setSelectedMembership(membership);
        setAvailableDaysOptions(filteredPlans);
        setDaysPerWeek(null);
        setAvailableBatches([]);
        setBatchName("");
        setBatchTime("");

        onSelect(null, selectedActivity, membership, "", "", null, null);
    };

    // when days per week changes
    const handleDaysPerWeekChange = (event: React.SyntheticEvent<Element>) => {
        const selectedDays = Number((event as React.ChangeEvent<HTMLInputElement>).target.value);
        const batches =
            availableDaysOptions.filter((p: BatchEntry) => p.daysPerWeek === selectedDays) || [];

        const firstBatch = batches[0] || {};
        const updatedBatchName = firstBatch.name || "";
        const updatedBatchTime = `${firstBatch.startTime || "00:00"} - ${
            firstBatch.endTime || "00:00"
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
                ...new Set(
                    (selectedActivity.batchEntries ?? []).map((b: BatchEntry) =>
                        String(b.planType),
                    ),
                ),
            ] as string[]);
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
                        value={selectedActivity?.activityId ?? ""}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selected = activities.find(
                                (activity) => activity.activityId === selectedId,
                            );
                            if (selected) {
                                handleActivityChange(
                                    e as unknown as React.SyntheticEvent,
                                    selected,
                                );
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
                                onChange={(e) =>
                                    handleMembershipChange(
                                        e as unknown as React.SyntheticEvent<Element>,
                                    )
                                }
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
                                onChange={(e) =>
                                    handleDaysPerWeekChange(
                                        e as unknown as React.SyntheticEvent<Element>,
                                    )
                                }
                                fullWidth
                                disabled={!selectedMembership}
                            >
                                {availableDaysOptions
                                    .filter((b, index, self) => {
                                        if (!permissions.BATCH) return true;
                                        return (
                                            index ===
                                            self.findIndex((x) => x.daysPerWeek === b.daysPerWeek)
                                        );
                                    })
                                    .map((plan, index) => (
                                        <MenuItem key={index} value={plan.daysPerWeek ?? ""}>
                                            {plan.daysPerWeek ?? ""}{" "}
                                            {(plan.daysPerWeek ?? 0) > 1 ? "days/week" : "day/week"}
                                            {permissions.BATCH ? "" : `- Rs.${plan.price}/-`}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </TableCell>
                    {permissions.BATCH && (
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
                                            <MenuItem key={idx} value={batch?.name}>
                                                {batch?.name} (Rs. {batch?.price})
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

export default ActivityMembershipSelector;
