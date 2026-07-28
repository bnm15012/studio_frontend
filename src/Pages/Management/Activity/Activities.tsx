import { useAppSelector, useAppDispatch } from "@/state";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Typography,
    Box,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    Chip,
    Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAlert } from "@/core/components/feedback/Alert";
import { activityCruds } from "@/api/all.api";
import ActivityCard from "@/Pages/Management/Activity/ActivityCard";
import ActivityDialog, { type ActivityFormData } from "@/Pages/Management/Activity/ActivityDialog";
import { useAppUI } from "@/context/UIContext";
import { sortMembershipPlans } from "@/Pages/Management/Activity/Activity.util";
import type { Activity, BatchEntry } from "@/api/types";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";
import { FlexBetween } from "@/core/components/layout/FlexBox";

const Activities = () => {
    const showAlert = useAlert();
    const theme = useTheme();
    const { permissions, currentBranch, token, isMobile } = useAppUI();

    const allActivities = useAppSelector((state) => state.activities.items);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | undefined>();

    const fetchActivities = useCallback(() => {
        dispatch(
            activityCruds.getAll(showAlert, setLoading, token, {}, currentBranch.branchId, true),
        );
    }, [dispatch, showAlert, token, currentBranch.branchId]);

    const refreshActivities = useCallback(() => {
        dispatch(activityCruds.refresh(showAlert, setLoading, token, true));
    }, [dispatch, showAlert, token]);

    useEffect(() => {
        if (!allActivities.length) fetchActivities();
    }, [allActivities.length, fetchActivities]);

    const handleAddActivity = () => {
        setEditingActivity(undefined);
        setDialogOpen(true);
    };

    const handleEditActivity = (activity: Activity) => {
        setEditingActivity(activity);
        setDialogOpen(true);
    };

    const checkUniqueConstraint = (batchEntries: BatchEntry[]) => {
        const seen = new Set();
        for (const batch of batchEntries) {
            const key = `${batch.name}-${batch.planType}-${batch.daysPerWeek}`;
            if (seen.has(key)) return false;
            seen.add(key);
        }
        return true;
    };

    const handleSaveCard = async (updatedActivity: ActivityFormData) => {
        if (!updatedActivity.batchEntries.length) {
            showAlert(
                `You must add at least one ${permissions.BATCH ? "batch" : "membership"}.`,
                "error",
            );
            return;
        }

        if (!updatedActivity.activityType || updatedActivity.activityType === "") {
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

        if (!checkUniqueConstraint(updatedActivity.batchEntries as BatchEntry[])) {
            showAlert(
                `name, plan type and days per week cannot be the same for multiple ${permissions.BATCH ? "batch" : "membership"}.`,
                "error",
            );
            return;
        }

        try {
            const activityId = updatedActivity.activityId;
            if (activityId === 0) {
                const newPayload = { ...updatedActivity };
                delete (newPayload as Partial<ActivityFormData>).activityId;
                newPayload.batchEntries.forEach(
                    (batch) => delete (batch as Partial<BatchEntry>).batchId,
                );
                dispatch(
                    activityCruds.add(
                        newPayload as unknown as Partial<Activity>,
                        token,
                        showAlert,
                        setLoading,
                    ),
                );
                setDialogOpen(false);
            } else {
                updatedActivity.batchEntries.forEach((batch) => {
                    if (typeof batch.batchId === "string")
                        delete (batch as Partial<BatchEntry>).batchId;
                });

                const sortedActivity = sortMembershipPlans(updatedActivity as Activity);
                await dispatch(
                    activityCruds.update(
                        Number(updatedActivity.activityId!),
                        sortedActivity,
                        token,
                        showAlert,
                        setLoading,
                    ),
                );
                setDialogOpen(false);
            }
        } catch (error: unknown) {
            console.error(error);
            showAlert(error instanceof Error ? error.message : "Error saving activity!", "error");
        }
    };

    const handleDeleteActivity = async (activityId: string | number) => {
        await dispatch(activityCruds.remove(Number(activityId), token, showAlert, setLoading));
        showAlert("Activity deleted successfully!", "success");
    };

    // ── Stats ────────────────────────────────────────────────────────────────
    const totalBatches = useMemo(
        () => allActivities.reduce((acc, a) => acc + (a.batchEntries.length ?? 0), 0),
        [allActivities],
    );

    const batchLabel = permissions.BATCH ? "Batches" : "Memberships";

    return (
        <Box>
            {/* ── Page header ─────────────────────────────────────────── */}
            <FlexBetween
                sx={{
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: 2,
                    my: 2,
                    flexWrap: "nowrap",
                    flexGrow: 100,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                        Activities
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.25}
                        sx={{ textWrap: "nowrap" }}
                    >
                        Manage your studio&apos;s offerings
                    </Typography>
                </Box>

                <FlexBetween
                    gap={1}
                    alignItems={"center"}
                    sx={{ width: isMobile ? "100%" : "fit-content" }}
                >
                    <FlexBetween gap={0.5}>
                        <Chip
                            label={`${allActivities.length} ${
                                allActivities.length === 1 ? "Activity" : "Activities"
                            }`}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                borderRadius: "8px",
                            }}
                        />

                        <Chip
                            label={`${totalBatches} ${batchLabel}`}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                borderRadius: "8px",
                            }}
                        />
                    </FlexBetween>
                    <FlexBetween gap={1}>
                        <Tooltip title="Refresh">
                            <IconButton
                                onClick={refreshActivities}
                                sx={iconBtnFilledSx}
                                size="small"
                            >
                                <RefreshIcon sx={{ fontSize: "1.1rem" }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="New Activity">
                            <IconButton
                                onClick={handleAddActivity}
                                sx={iconBtnFilledSx}
                                size="small"
                            >
                                <AddIcon sx={{ fontSize: "1.1rem" }} />
                            </IconButton>
                        </Tooltip>
                    </FlexBetween>
                </FlexBetween>
            </FlexBetween>

            {/* ── Loading skeletons ────────────────────────────────────── */}
            {loading && (
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    }}
                    gap={2}
                >
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={240}
                            sx={{ borderRadius: "16px" }}
                        />
                    ))}
                </Box>
            )}

            {/* ── Activity grid ────────────────────────────────────────── */}
            {!loading && allActivities.length > 0 && (
                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    }}
                    gap={2}
                    alignItems="start"
                >
                    {allActivities.map((activity, i) => (
                        <ActivityCard
                            key={activity.activityId}
                            index={i}
                            activity={activity}
                            onEdit={handleEditActivity}
                            onDelete={handleDeleteActivity}
                        />
                    ))}
                </Box>
            )}

            {/* ── Empty state ──────────────────────────────────────────── */}
            {allActivities.length === 0 && !loading && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 14,
                        textAlign: "center",
                        borderRadius: "20px",
                        border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                        mt: 2,
                    }}
                >
                    <Typography sx={{ fontSize: "4rem", mb: 2, lineHeight: 1 }}>🏋️</Typography>
                    <Typography variant="h5" fontWeight={700} mb={1}>
                        No Activities Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Start by creating your first activity
                    </Typography>
                    <IconButton
                        onClick={handleAddActivity}
                        sx={{
                            ...iconBtnFilledSx,
                            width: "auto",
                            px: 2,
                            borderRadius: "12px",
                            gap: 0.75,
                        }}
                    >
                        <AddIcon sx={{ fontSize: "1.1rem" }} />
                        <Typography fontSize="0.875rem" fontWeight={600} color="inherit">
                            New Activity
                        </Typography>
                    </IconButton>
                </Box>
            )}

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
