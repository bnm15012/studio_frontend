import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  TextField,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Delete,
  Schedule,
} from '@mui/icons-material';

export const BatchCard = ({
  batch,
  isEditing,
  onUpdate,
  onDelete
}) => {
  const theme = useTheme();
  const [editedBatch, setEditedBatch] = useState(batch);

  const updateField = (field, value) => {
    const updated = { ...editedBatch, [field]: value };
    setEditedBatch(updated);
    onUpdate(updated);
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          transform: 'translateY(-1px)',
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            {isEditing ? (
              <Box display="grid" gridTemplateColumns="1fr 100px" gap={1} mb={1}>
                <TextField
                  size="small"
                  label="Batch Name"
                  value={editedBatch.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  variant="outlined"
                />
                <TextField
                  size="small"
                  label="Price"
                  type="number"
                  value={editedBatch.price}
                  onChange={(e) => updateField("price", parseFloat(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
                  variant="outlined"
                />
              </Box>
            ) : (
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {batch.name}
                </Typography>
                <Chip
                  label={`Rs. ${batch.price}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            )}

            {isEditing ? (
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                <TextField
                  size="small"
                  label="Start Time"
                  type="time"
                  value={editedBatch.startTime}
                  onChange={(e) => updateField("startTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <TextField
                  size="small"
                  label="End Time"
                  type="time"
                  value={editedBatch.endTime}
                  onChange={(e) => updateField("endTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                </Typography>
              </Box>
            )}
          </Box>

          {isEditing && (
            <Tooltip title="Delete Batch">
              <IconButton
                size="small"
                onClick={() => onDelete(batch.batchId)}
                color="error"
                sx={{
                  ml: 1,
                  opacity: 0.7,
                  '&:hover': { opacity: 1 }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

BatchCard.propTypes = {
  batch: PropTypes.shape({
    batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};