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
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Delete,
  Add,
  People,
  Schedule,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { BatchCard } from './BatchCard';
import PropTypes from 'prop-types';

const membershipTypeColors = {
  MONTHLY: '#7c3aed',
  QUARTERLY: '#3b82f6',
};


export const MembershipPlanCard = ({
  plan,
  isEditing,
  onUpdate,
  onDelete
}) => {
  const theme = useTheme();
  const [editedPlan, setEditedPlan] = useState(plan);
  const [expanded, setExpanded] = useState(true);

  const updateField = (field, value) => {
    const updated = { ...editedPlan, [field]: value };
    setEditedPlan(updated);
    onUpdate(updated);
  };

  const addBatch = () => {
    const newBatch = {
      batchId: Math.max(...editedPlan.activityBatchEntries.map(b => b.batchId), 0) + 1,
      membershipPlanId: editedPlan.membershipPlanId,
      price: 0,
      name: "New Batch",
      startTime: "09:00",
      endTime: "10:00"
    };

    updateField("activityBatchEntries", [...editedPlan.activityBatchEntries, newBatch]);
  };

  const updateBatch = (updatedBatch) => {
    updateField(
      "activityBatchEntries",
      editedPlan.activityBatchEntries.map(batch =>
        batch.batchId === updatedBatch.batchId ? updatedBatch : batch
      )
    );
  };

  const deleteBatch = (batchId) => {
    updateField(
      "activityBatchEntries",
      editedPlan.activityBatchEntries.filter(batch => batch.batchId !== batchId)
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {isEditing ? (
              <Box display="flex" gap={1}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={editedPlan.membershipType}
                    label="Type"
                    onChange={(e) => updateField("membershipType", e.target.value)}
                  >
                    <MenuItem value="MONTHLY">Monthly</MenuItem>
                    <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                    <MenuItem value="YEARLY">Yearly</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Days/Week"
                  type="number"
                  value={editedPlan.daysPerWeek}
                  onChange={(e) => updateField("daysPerWeek", parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 7 }}
                  sx={{ width: 100 }}
                />
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={plan.membershipType}
                  sx={{
                    backgroundColor: membershipTypeColors[plan.membershipType],
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
                <Box display="flex" alignItems="center" gap={0.5}>
                  <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {plan.daysPerWeek} days/week
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            {isEditing && (
              <Tooltip title="Delete Plan">
                <IconButton
                  size="small"
                  onClick={() => onDelete(plan.membershipPlanId)}
                  color="error"
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Batches ({editedPlan.activityBatchEntries.length})
                </Typography>
              </Box>
              {isEditing && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={addBatch}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Add Batch
                </Button>
              )}
            </Box>

            <Box display="flex" flexDirection="column" gap={1.5}>
              {editedPlan.activityBatchEntries.map((batch) => (
                <BatchCard
                  key={batch.batchId}
                  batch={batch}
                  isEditing={isEditing}
                  onUpdate={updateBatch}
                  onDelete={deleteBatch}
                />
              ))}

              {editedPlan.activityBatchEntries.length === 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  py={3}
                  sx={{
                    backgroundColor: alpha(theme.palette.grey[100], 0.3),
                    borderRadius: 1,
                    border: `1px dashed ${theme.palette.grey[300]}`
                  }}
                >
                  <Schedule sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    No batches available
                  </Typography>
                  {isEditing && (
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Add />}
                      onClick={addBatch}
                      sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Create First Batch
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};


MembershipPlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};