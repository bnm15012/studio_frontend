import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    MenuItem,
    Box,
    Divider,
    Paper,
} from "@mui/material";
import { Add, Delete, AccessTime, AttachMoney } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { validActivityTypes, validMembershipTypes } from "./Activities.constants";
import PropTypes from "prop-types";
import FlexBetween from "../../../Components/FlexBetween";
import { useUI } from "../../../context/UIContext";

const ActivityDialog = ({ open, onOpenChange, activity, onSave }) => {
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const { isBatchEnabled } = useUI();
    const [formData, setFormData] = useState({
        activityId: 0,
        activityType: "ZUMBA",
        description: "",
        branchId: currentBranch.branchId,
        batchEntries: [],
    });

    useEffect(() => {
        if (activity) {
            setFormData(activity);
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
            name: "Batch " + (formData.batchEntries.length + 1),
            planType: "MONTHLY",
            daysPerWeek: 3,
            price: 0,
            startTime: "00:00",
            endTime: "00:00",
        };
        setFormData((prev) => ({
            ...prev,
            batchEntries: [...prev.batchEntries, newBatch],
        }));
    };

    const removeBatch = (batchId) => {
        setFormData((prev) => ({
            ...prev,
            batchEntries: prev.batchEntries.filter((b) => b.batchId !== batchId),
        }));
    };

    const updateBatch = (batchId, updates) => {
        setFormData((prev) => ({
            ...prev,
            batchEntries: prev.batchEntries.map((b) =>
                b.batchId === batchId ? { ...b, ...updates } : b
            ),
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth >
            <DialogTitle>
                {activity ? "Edit Activity" : "Create New Activity"}
            </DialogTitle>
            <DialogContent dividers sx={{ maxHeight: "80vh" }}>
                <Typography variant="h6" gutterBottom>
                    Activity Details
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Activity Type"
                            value={formData.activityType}
                            onChange={(e) =>
                                setFormData({ ...formData, activityType: e.target.value })
                            }
                            fullWidth
                        >
                            {validActivityTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
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
                    <Typography variant="h6"> {isBatchEnabled ? "Batches" : "Membership plans"}</Typography>
                    <Button variant="outlined" size="small" startIcon={<Add />} onClick={addBatch}>
                        Add {isBatchEnabled ? "Batch" : "Membership plan"}
                    </Button>
                </Box>

                {formData.batchEntries.length === 0 ? (
                    <Typography variant="body2" align="center" color="text.secondary" py={4}>
                        No batches added yet. Click &quot;Add {isBatchEnabled ? "Batch" : "Membership plan"}&quot; to create your first {isBatchEnabled ? "batch" : "membership plan"}.
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {formData.batchEntries.map((batch) => (
                            <Paper key={batch.batchId} variant="outlined" sx={{ p: 2 }}>
                                <FlexBetween flexDirection={"row-reverse"} mb={2}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => removeBatch(batch.batchId)}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </FlexBetween>

                                <Grid container spacing={2}>
                                    {
                                        isBatchEnabled &&
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Batch Name"
                                                placeholder="e.g., Morning Zumba"
                                                value={batch.name}
                                                onChange={(e) =>
                                                    updateBatch(batch.batchId, { name: e.target.value })
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                    }
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            label="Plan Type"
                                            value={batch.planType}
                                            onChange={(e) => updateBatch(batch.batchId, { planType: e.target.value })}
                                            fullWidth
                                        >
                                            {validMembershipTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    {
                                        isBatchEnabled &&
                                        <>
                                            <Grid item xs={6} md={3}>
                                                <TextField
                                                    type="time"
                                                    label="Start Time"
                                                    value={batch.startTime}
                                                    onChange={(e) => updateBatch(batch.batchId, { startTime: e.target.value })}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: <AccessTime fontSize="small" />,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <TextField
                                                    type="time"
                                                    label="End Time"
                                                    value={batch.endTime}
                                                    onChange={(e) => updateBatch(batch.batchId, { endTime: e.target.value })}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{
                                                        startAdornment: <AccessTime fontSize="small" />,
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    }
                                    <Grid item xs={6} md={3}>
                                        <TextField
                                            type="number"
                                            label="Days/Week"
                                            value={batch.daysPerWeek}
                                            onChange={(e) =>
                                                updateBatch(batch.batchId, { daysPerWeek: parseInt(e.target.value) || 1 })
                                            }
                                            fullWidth
                                            inputProps={{ min: 0, max: 7 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <TextField
                                            type="number"
                                            label="Price"
                                            value={batch.price}
                                            onChange={(e) =>
                                                updateBatch(batch.batchId, { price: parseFloat(e.target.value) || 0 })
                                            }
                                            fullWidth
                                            inputProps={{ min: 0, step: 0.01 }}
                                            InputProps={{
                                                startAdornment: <AttachMoney fontSize="small" />,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    {activity ? "Update Activity" : "Create Activity"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
ActivityDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    activity: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

export default ActivityDialog;
