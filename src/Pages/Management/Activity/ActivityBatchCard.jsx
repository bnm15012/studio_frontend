import { AccessTime, CurrencyRupee, CalendarToday } from '@mui/icons-material'
import { Chip, Stack, Typography, Card, CardContent } from '@mui/material'
import PropTypes from 'prop-types'
import { membershipTypeColors } from './Activities.constants'
import { useUI } from '../../../context/UIContext'

const ActivityBatchCard = ({ batch }) => {
    const { isBatchEnabled } = useUI();

    return (
        <Card
            key={batch.batchId}
            sx={{
                bgcolor: "background.paper",
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {isBatchEnabled && (
                            <Typography variant="h6" fontWeight="600" color="text.primary">
                                {batch.name}
                            </Typography>
                        )}
                        <Chip
                            size="small"
                            label={batch.planType}
                            sx={{
                                backgroundColor: membershipTypeColors[(batch.batchId || 1) % membershipTypeColors.length] || "primary.main",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CurrencyRupee fontSize="small" color="success" />
                        <Typography variant="body2" fontWeight="500">
                            {batch.price}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction="row" spacing={3} mb={1}>
                    {isBatchEnabled && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                                {batch.startTime} - {batch.endTime}
                            </Typography>
                        </Stack>
                    )}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarToday fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight="500">
                            {batch.daysPerWeek} days/week
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

ActivityBatchCard.propTypes = {
    batch: PropTypes.shape({
        batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        planType: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        daysPerWeek: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
};

export default ActivityBatchCard
