import { useAppSelector, useAppDispatch } from "@/state";
import { useState, useEffect, useCallback } from "react";
import {
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    MenuItem,
    Box,
    Divider,
    Paper,
    Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { validActivityTypes, validMembershipTypes } from "./Activities.constants";

import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useUI } from "../../../context/UIContext";
import Loading from "@/core/components/loading/Loading";
import { useAlert } from "@/core/components/feedback/Alert";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import Field from "@/core/components/fields/Field";
import { membershipPackageCruds } from "../../../api/all.api";
import type { Activity } from "../../../api/types";

interface BatchFormData {
    batchId: string | number;
    name: string;
    planType: string;
    daysPerWeek: number;
    price: number;
    startTime: string;
    endTime: string;
}
interface ActivityFormData {
    activityId: string | number;
    activityType: string;
    description: string;
    branchId: number;
    batchEntries: BatchFormData[];
}

interface ActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity?: Activity | null;
    onSave: (data: Record<string, unknown>) => void;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({ open, onOpenChange, activity, onSave }) => {
    const showAlert = useAlert();
    const dispatch = useAppDispatch();
    const { token, studio, currentBranch } = useUI()

    const { isBatchEnabled, isEnabled, FEATURE_KEYS } = useUI();
    const isMembershipTableEnabled = isEnabled(FEATURE_KEYS.PACKAGE);

    const [formData, setFormData] = useState<ActivityFormData>({} as ActivityFormData);

    const [loading, setLoading] = useState(false);
    const cachedMembershipTypes = useAppSelector((state) => state.membershipPackages.items);
    const membershipTypes = isMembershipTableEnabled
        ? [...cachedMembershipTypes.map(({ membershipPackage }) => membershipPackage)]
        : [];

    const fetchMembershipTypesData = useCallback(async () => {
        dispatch(
            membershipPackageCruds.getAll(
                showAlert,
                setLoading,
                token,
                { size: 100 },
                studio!.studioId,
            ),
        );
    }, [dispatch, studio!.studioId, token, showAlert]);

    useEffect(() => {
        isMembershipTableEnabled && !cachedMembershipTypes.length && fetchMembershipTypesData();
    }, [isMembershipTableEnabled, fetchMembershipTypesData, cachedMembershipTypes.length]);

    useEffect(() => {
        if (activity) {
            setFormData(activity as unknown as ActivityFormData);
        } else {
            setFormData({
                activityId: "NEW",
                activityType: "ZUMBA",
                description: "",
                branchId: currentBranch.branchId,
                batchEntries: [],
            });
        }
    }, [activity, currentBranch.branchId, open]);

    const addBatch = () => {
        const newBatch = {
            batchId: "NEW" + String(Date.now()),
            name: "New Batch",
            planType: "MONTHLY",
            daysPerWeek: 3,
            price: 0,
            startTime: "00:00",
            endTime: "00:00",
        };
        setFormData((prev) => ({
            ...prev,
            batchEntries: [...(prev.batchEntries ?? []), newBatch],
        }));
    };

    const removeBatch = (batchId: string | number) => {
        setFormData((prev) => ({
            ...prev,
            batchEntries: (prev.batchEntries ?? []).filter((b) => b.batchId !== batchId),
        }));
    };

    const updateBatch = (batchId: string | number, updates: Record<string, unknown>) => {
        setFormData((prev) => ({
            ...prev,
            batchEntries: (prev.batchEntries ?? []).map((b) =>
                b.batchId === batchId ? { ...b, ...updates } : b,
            ),
        }));
    };

    const handleSave = () => {
        onSave(formData as unknown as Record<string, unknown>);
    };

    const isFormValid = () => {
        if (!formData.activityType) return false;
        if ((formData.batchEntries ?? []).length === 0) return false;

        const keys = (formData.batchEntries ?? []).map(
            (b) =>
                `${b.name?.trim().toLowerCase()}|${b.planType}|${String(formData.activityId ?? "")}|${b.daysPerWeek}`,
        );
        const hasDuplicates = new Set(keys).size !== keys.length;
        if (hasDuplicates) return false;

        for (const batch of formData.batchEntries ?? []) {
            if (!batch.planType) return false;
            if (isNaN(batch.daysPerWeek ?? 0) || (batch.daysPerWeek ?? 0) < 0 || (batch.daysPerWeek ?? 0) > 7)
                return false;
            if (isNaN(batch.price ?? 0) || (batch.price ?? 0) < 0) return false;

            if (isBatchEnabled) {
                if (!batch.name?.trim()) return false;
                if (!batch.startTime || !batch.endTime || batch.endTime < batch.startTime)
                    return false;
            }
        }

        return true;
    };

    return (
        <StyledDialog
            maxWidth="md"
            onConfirm={handleSave}
            confirmDisabled={!isFormValid()}
            confirmText={activity ? "Update Activity" : "Create Activity"}
            title={activity ? "Edit Activity" : "Create New Activity"}
            open={open}
            onClose={() => onOpenChange(false)}
        >
            {loading && <Loading />}
            <Box sx={{ maxHeight: "80vh" }}>
                <Typography variant="h6" gutterBottom>
                    Activity Details
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                        <Field
                            type="SELECT"
                            label="Activity Type"
                            value={{ key: formData.activityType, value: formData.activityType }}
                            extraProp={{
                                variant: "outlined",
                                getOptions: async (search, page, limit) =>
                                    validActivityTypes
                                        .filter((a) =>
                                            a.toLowerCase().includes(search.toLowerCase()),
                                        )
                                        .slice(page * limit, (page + 1) * limit)
                                        .map((a) => ({ key: a, value: a })),
                            }}
                            setValue={(value: unknown) => setFormData({ ...formData, activityType: String(value) })}
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Description"
                    placeholder="Enter activity description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />

                <Divider sx={{ my: 3 }} />

                {/* Batches */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                        {" "}
                        {isBatchEnabled ? "Batches" : "Membership plans"}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={addBatch}
                    >
                        Add {isBatchEnabled ? "Batch" : "Membership plan"}
                    </Button>
                </Box>

                {formData.batchEntries?.length === 0 ? (
                    <Typography variant="body2" align="center" color="text.secondary" py={4}>
                        No batches added yet. Click &quot;Add{" "}
                        {isBatchEnabled ? "Batch" : "Membership plan"}&quot; to create your first{" "}
                        {isBatchEnabled ? "batch" : "membership plan"}.
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {formData.batchEntries?.map((batch) => (
                            <Paper key={batch.batchId} variant="outlined" sx={{ p: 2 }}>
                                <FlexBetween flexDirection={"row-reverse"} mb={2}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => removeBatch(batch.batchId)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </FlexBetween>

                                <Grid container spacing={2}>
                                    {isBatchEnabled && (
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Batch Name"
                                                placeholder="e.g., Morning Zumba"
                                                value={batch.name}
                                                error={!batch.name?.trim()}
                                                onChange={(e) =>
                                                    updateBatch(batch.batchId, {
                                                        name: e.target.value,
                                                    })
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <Select
                                            label="Plan Type"
                                            value={batch.planType}
                                            onChange={(e) =>
                                                updateBatch(batch.batchId, {
                                                    planType: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 48 * 3 + 8,
                                                    },
                                                },
                                            }}
                                        >
                                            {![
                                                ...membershipTypes,
                                                ...validMembershipTypes,
                                            ].includes(batch.planType) && (
                                                    <MenuItem
                                                        value={batch.planType}
                                                        key={batch.planType}
                                                    >
                                                        {batch.planType}
                                                    </MenuItem>
                                                )}
                                            {membershipTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                            {validMembershipTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}{" "}
                                                    {isMembershipTableEnabled && <i>(default)</i>}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    {isBatchEnabled && (
                                        <>
                                            <Grid item xs={6} md={3}>
                                                <TextField
                                                    type="time"
                                                    label="Start Time"
                                                    value={batch.startTime ?? ""}
                                                    error={!batch.startTime}
                                                    onChange={(e) =>
                                                        updateBatch(batch.batchId, {
                                                            startTime: e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <AccessTimeIcon fontSize="small" />
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField
                                                    type="time"
                                                    label="End Time"
                                                    value={batch.endTime}
                                                    error={
                                                        !batch.endTime ||
                                                        batch.endTime < (batch.startTime ?? "00:00")
                                                    }
                                                    onChange={(e) =>
                                                        updateBatch(batch.batchId, {
                                                            endTime: e.target.value,
                                                        })
                                                    }
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <AccessTimeIcon fontSize="small" />
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={6} md={3}>
                                        <TextField
                                            type="number"
                                            label="Days/Week"
                                            value={batch.daysPerWeek ?? ""}
                                            onChange={(e) =>
                                                updateBatch(batch.batchId, {
                                                    daysPerWeek: parseInt(e.target.value),
                                                })
                                            }
                                            fullWidth
                                            error={
                                                isNaN(batch.daysPerWeek ?? 0) ||
                                                (batch.daysPerWeek ?? 0) < 0 ||
                                                (batch.daysPerWeek ?? 0) > 7
                                            }
                                            inputProps={{ min: 0, max: 7 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <TextField
                                            type="number"
                                            label="Price"
                                            value={batch.price ?? ""}
                                            onChange={(e) =>
                                                updateBatch(batch.batchId, {
                                                    price: parseFloat(e.target.value),
                                                })
                                            }
                                            fullWidth
                                            error={(batch.price ?? 0) < 0 || isNaN(batch.price ?? 0)}
                                            inputProps={{ min: 0, step: 0.01 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <AttachMoneyIcon fontSize="small" />
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </StyledDialog>
    );
};

export default ActivityDialog;
