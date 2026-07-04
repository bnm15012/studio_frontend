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
    const chipColor = membershipTypeColors[Number(batch.batchId || 1) % membershipTypeColors.length];

    return (
        <Box
            sx={{
                py: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&:last-of-type": {
                    borderBottom: "none",
                    pb: 0,
                },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                    {isBatchEnabled && (
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: "0.8125rem",
                                color: "text.primary",
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {batch.name}
                        </Typography>
                    )}
                    <Chip
                        size="small"
                        label={batch.planType}
                        sx={{
                            backgroundColor: alpha(chipColor, 0.1),
                            color: chipColor,
                            fontWeight: 600,
                            fontSize: "0.6rem",
                            height: 18,
                            borderRadius: "4px",
                            "& .MuiChip-label": { px: 0.75 },
                        }}
                    />
                </Stack>
                <Stack direction="row" spacing={0.25} alignItems="center" flexShrink={0}>
                    <CurrencyRupeeIcon sx={{ fontSize: "0.8125rem", color: theme.palette.success.main }} />
                    <Typography sx={{ fontWeight: 500, fontSize: "0.8125rem", color: "text.primary" }}>
                        {batch.price}
                    </Typography>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                {isBatchEnabled && (
                    <Stack direction="row" spacing={0.4} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: "0.75rem", color: theme.palette.text.secondary }} />
                        <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", fontWeight: 450 }}>
                            {batch.startTime} - {batch.endTime}
                        </Typography>
                    </Stack>
                )}
                <Stack direction="row" spacing={0.4} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: "0.75rem", color: theme.palette.text.secondary }} />
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", fontWeight: 450 }}>
                        {batch.daysPerWeek} days/week
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ActivityBatchCard;
