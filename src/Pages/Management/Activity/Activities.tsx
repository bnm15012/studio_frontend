import { useCallback, useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { FlexBetween } from "../../../core/components/layout/FlexBox";
import { useAlert } from "../../../core/components/feedback/Alert";
import { activityCruds } from "../../../api/all.api";
import ActivityCard from "./ActivityCard";
import ActivityDialog from "./ActivityDialog";
import { useUI } from "../../../context/UIContext";
import { sortMembershipPlans } from "./Activity.util";

const Activities = () => {
    const showAlert = useAlert();
    const { isBatchEnabled } = useUI();

    const allActivities = useSelector((state) => state.activities.items);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState();

    const fetchActivities = useCallback(() => {
        dispatch(
            activityCruds.getAll(
                showAlert,
                setLoading,
                token,
                { size: 500 },
                currentBranch.branchId,
            ),
        );
    }, [dispatch, showAlert, token, currentBranch.branchId]);

    useEffect(() => {
        if (!allActivities.length) fetchActivities();
    }, [allActivities.length, fetchActivities]);

    const handleAddActivity = () => {
        setEditingActivity(undefined);
        setDialogOpen(true);
    };

    const handleEditActivity = (activity) => {
        setEditingActivity(activity);
        setDialogOpen(true);
    };

    const checkUniqueConstraint = (batchEntries) => {
        const seen = new Set();
        for (const batch of batchEntries) {
            const key = `${batch.name}-${batch.planType}-${batch.daysPerWeek}`;
            if (seen.has(key)) return false;
            seen.add(key);
        }
        return true;
    };

    const handleSaveCard = async (updatedActivity) => {
        if (!updatedActivity.batchEntries.length) {
            showAlert(
                `You must add at least one ${isBatchEnabled ? "batch" : "membership"}.`,
                "error",
            );
            return;
        }

        if (!updatedActivity.activityType || updatedActivity.activityType === "NEW") {
            showAlert("Activity type is required.", "error");
            return;
        }

        if (
            allActivities.some(
                (a) =>
                    a.activityType === updatedActivity.activityType &&
                    a.activityId !== updatedActivity.activityId,
            )
        ) {
            showAlert("Activity type must be unique.", "error");
            return;
        }

        if (!checkUniqueConstraint(updatedActivity.batchEntries)) {
            showAlert(
                `name, plan type and days per week cannot be the same for multiple ${isBatchEnabled ? "batch" : "membership"}.`,
                "error",
            );
            return;
        }

        try {
            if (updatedActivity?.activityId === "NEW") {
                delete updatedActivity.activityId;
                updatedActivity.batchEntries.forEach((batch) => delete batch.batchId);
                dispatch(activityCruds.add(updatedActivity, token, showAlert, setLoading));
                setDialogOpen(false);
            } else {
                updatedActivity.batchEntries.forEach((batch) => {
                    if (typeof batch.batchId === "string") delete batch.batchId;
                });

                const sortedActivity = sortMembershipPlans(updatedActivity);
                await dispatch(
                    activityCruds.update(
                        updatedActivity.activityId,
                        sortedActivity,
                        token,
                        showAlert,
                        setLoading,
                    ),
                );
                setDialogOpen(false);
            }
        } catch (error) {
            console.error(error);
            showAlert("Error saving activity!", "error");
        }
    };

    const handleDeleteActivity = async (activityId) => {
        await dispatch(activityCruds.remove(activityId, token, showAlert, setLoading));
        showAlert("Activity deleted successfully!", "success");
    };

    return (
        <Box>
            <FlexBetween paddingBottom={2} gap={1}>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                    onClick={handleAddActivity}
                >
                    <AddIcon />
                    New Activity
                </Button>
            </FlexBetween>

            <Box sx={{ py: 2 }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap={2}
                >
                    {allActivities.map((activity, index) => (
                        <Box key={activity.activityId}>
                            <ActivityCard
                                index={index}
                                cancelEdit={() => {
                                    setDialogOpen(false);
                                }}
                                activity={activity}
                                onEdit={handleEditActivity}
                                onDelete={handleDeleteActivity}
                            />
                        </Box>
                    ))}
                </Box>

                {allActivities.length === 0 && !loading && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={12}
                        textAlign="center"
                    >
                        <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>
                            🏋️
                        </Typography>
                        <Typography variant="h3" fontWeight={600} mb={2}>
                            No Activities Yet
                        </Typography>
                        <Typography variant="h6" color="text.secondary" mb={4}>
                            Start by creating your first activity
                        </Typography>
                    </Box>
                )}
            </Box>

            <ActivityDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                activity={editingActivity}
                onSave={handleSaveCard}
            />
        </Box>
    );
};

export default Activities;
