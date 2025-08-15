import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Collapse,
    Divider,
    alpha,
    useTheme,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    Edit,
    Save,
    Close,
    Delete,
    Add,
    CalendarToday,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { MembershipPlanCard } from './MembershipPlanCard';
import { getIcon, validActivityTypes } from './Activities.constants';
import PropTypes from 'prop-types';

export const ActivityCard = ({
    activity,
    index,
    cancelEdit,
    onUpdate,
    onDelete,
    isEditing,
    setIsEditing,
}) => {
    const theme = useTheme();
    const [editedActivity, setEditedActivity] = useState(activity);
    const [expanded, setExpanded] = useState(false);

    const handleSave = () => {
        onUpdate(editedActivity);
    };

    const handleCancel = () => {
        setEditedActivity(activity);
        cancelEdit();
        setIsEditing(false);
    };

    const addMembershipPlan = () => {
        const newPlan = {
            membershipPlanId: Math.max(...editedActivity.membershipPlanEntry.map(p => p.membershipPlanId), 0) + 1,
            membershipType: "MONTHLY",
            daysPerWeek: 3,
            activityId: editedActivity.activityId,
            activityBatchEntries: []
        };

        setEditedActivity({
            ...editedActivity,
            membershipPlanEntry: [...editedActivity.membershipPlanEntry, newPlan]
        });
    };

    const updateMembershipPlan = (updatedPlan) => {
        setEditedActivity({
            ...editedActivity,
            membershipPlanEntry: editedActivity.membershipPlanEntry.map(plan =>
                plan.membershipPlanId === updatedPlan.membershipPlanId ? updatedPlan : plan
            )
        });
    };

    const deleteMembershipPlan = (planId) => {
        setEditedActivity({
            ...editedActivity,
            membershipPlanEntry: editedActivity.membershipPlanEntry.filter(plan =>
                plan.membershipPlanId !== planId
            )
        });
    };

    return (
        <Fade in timeout={600}>
            <Card
                sx={{
                    // height: "100%",
                    position: 'relative',
                    overflow: 'visible',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: theme.palette.activityCardGradient[index % theme.palette.activityCardGradient.length],
                        borderRadius: '12px 12px 0 0',
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                                {getIcon(activity.activityType)}
                            </Typography>
                            <Box>
                                {isEditing === activity.activityType ? (
                                    <Box display="flex" flexDirection="column" gap={1}>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={editedActivity.activityType}
                                                label="Type"
                                                onChange={(e) => setEditedActivity({
                                                    ...editedActivity,
                                                    activityType: e.target.value
                                                })}
                                            >
                                                {validActivityTypes.map((m) => {
                                                    return (
                                                        <MenuItem value={m} key={m}>
                                                            {m}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                ) : (
                                    <>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Chip
                                                label={activity.activityType}
                                                sx={{
                                                    background: theme.palette.activityCardGradient[index % theme.palette.activityCardGradient.length],
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>

                        <Box display="flex" gap={1}>
                            {isEditing === activity.activityType ? (
                                <>
                                    <Tooltip title="Save">
                                        <IconButton onClick={handleSave} color="success" size="small">
                                            <Save />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <IconButton onClick={handleCancel} size="small">
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <Tooltip title="Edit Activity">
                                        <IconButton onClick={() => setIsEditing(activity.activityType)} size="small">
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Activity">
                                        <IconButton
                                            onClick={() => onDelete(activity.activityId)}
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Description */}
                    <Box mb={3}>
                        {isEditing === activity.activityType ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Description"
                                value={editedActivity.description}
                                onChange={(e) => setEditedActivity({
                                    ...editedActivity,
                                    description: e.target.value
                                })}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {activity.description}
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Membership Plans */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday sx={{ fontSize: 20, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight={600}>
                                    Membership Plans ({editedActivity.membershipPlanEntry.length})
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>
                            {isEditing === activity.activityType && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={addMembershipPlan}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Add Plan
                                </Button>
                            )}
                        </Box>

                        <Collapse in={expanded}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                {editedActivity.membershipPlanEntry.map((plan) => (
                                    <MembershipPlanCard
                                        key={plan.membershipPlanId}
                                        plan={plan}
                                        isEditing={isEditing === activity.activityType}
                                        onUpdate={updateMembershipPlan}
                                        onDelete={deleteMembershipPlan}
                                    />
                                ))}

                                {editedActivity.membershipPlanEntry.length === 0 && (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        py={4}
                                        sx={{
                                            backgroundColor: alpha(theme.palette.grey[100], 0.5),
                                            borderRadius: 2,
                                            border: `2px dashed ${theme.palette.grey[300]}`
                                        }}
                                    >
                                        <CalendarToday sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            No membership plans available
                                        </Typography>
                                        {isEditing === activity.activityType && (
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<Add />}
                                                onClick={addMembershipPlan}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Create First Plan
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Box>
                </CardContent>
            </Card>
        </Fade>
    );
};

ActivityCard.propTypes = {
    activity: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    cancelEdit: PropTypes.func.isRequired,
    index: PropTypes.number,
    isEditing: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    setIsEditing: PropTypes.func.isRequired,
};
