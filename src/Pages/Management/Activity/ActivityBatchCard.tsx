import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Chip, Stack, Typography, Box, useTheme } from "@mui/material";

import { membershipTypeColors } from "./Activities.constants";
import { useUI } from "../../../context/UIContext";
import { alpha } from "@mui/material/styles";

interface ActivityBatchCardProps {
    batch: {
        batchId: string | number;
        name: string;
        planType: string;
        startTime: string;
        endTime: string;
        price: string | number;
        daysPerWeek: string | number;
    };
}

const ActivityBatchCard: React.FC<ActivityBatchCardProps> = ({ batch }) => {
    const { isBatchEnabled } = useUI();
    const theme = useTheme();

    return (
        <Box
            key={batch.batchId}
            sx={{
                p: 1.25,
                borderRadius: "10px",
                backgroundColor: alpha(theme.palette.action.hover, 0.4),
                border: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    {isBatchEnabled && (
                        <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            color="text.primary"
                            noWrap
                        >
                            {batch.name}
                        </Typography>
                    )}
                    <Chip
                        size="small"
                        label={batch.planType}
                        sx={{
                            backgroundColor:
                                membershipTypeColors[
                                Number(batch.batchId || 1) % membershipTypeColors.length
                                ] || "primary.main",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.625rem",
                            height: 18,
                        }}
                    />
                </Stack>
                <Stack direction="row" spacing={0.25} alignItems="center" flexShrink={0}>
                    <CurrencyRupeeIcon sx={{ fontSize: "0.85rem" }} color="success" />
                    <Typography variant="body2" fontWeight="500" fontSize="0.8125rem">
                        {batch.price}
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={2}>
                {isBatchEnabled && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: "0.85rem" }} color="action" />
                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                            {batch.startTime} - {batch.endTime}
                        </Typography>
                    </Stack>
                )}
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: "0.85rem" }} color="primary" />
                    <Typography
                        variant="caption"
                        fontWeight="500"
                        color="text.secondary"
                        fontSize="0.75rem"
                    >
                        {batch.daysPerWeek} days/week
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ActivityBatchCard;
