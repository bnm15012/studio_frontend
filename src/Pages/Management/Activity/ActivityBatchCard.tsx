import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Chip, Stack, Typography, Box, useTheme } from "@mui/material";

import { membershipTypeColors } from "@/Pages/Management/Activity/Activities.constants";
import { useAppUI } from "@/context/UIContext";
import { alpha } from "@mui/material/styles";

import type { BatchEntry } from "@/api/types";

interface ActivityBatchCardProps {
    batch: BatchEntry;
}

const ActivityBatchCard: React.FC<ActivityBatchCardProps> = ({ batch }) => {
    const { permissions } = useAppUI();
    const theme = useTheme();
    const chipColor =
        membershipTypeColors[Number(batch.batchId || 1) % membershipTypeColors.length];

    return (
        <Box sx={{ py: 1.25 }}>
            {/* Row 1 — name + plan type + price */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ minWidth: 0, flex: 1 }}
                >
                    {/* Plan type pill */}
                    <Chip
                        size="small"
                        label={batch.planType.replace(/_/g, " ") ?? ""}
                        sx={{
                            backgroundColor: alpha(chipColor, 0.12),
                            color: chipColor,
                            fontWeight: 700,
                            fontSize: "0.625rem",
                            height: 20,
                            borderRadius: "6px",
                            border: `1px solid ${alpha(chipColor, 0.25)}`,
                            flexShrink: 0,
                            "& .MuiChip-label": { px: 0.75 },
                        }}
                    />
                    {permissions.BATCH && (
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "text.primary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {batch.name}
                        </Typography>
                    )}
                </Stack>

                {/* Price */}
                <Stack direction="row" spacing={0.2} alignItems="center" flexShrink={0}>
                    <CurrencyRupeeIcon
                        sx={{ fontSize: "0.78rem", color: theme.palette.success.main }}
                    />
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            color: theme.palette.success.main,
                        }}
                    >
                        {batch.price}
                    </Typography>
                </Stack>
            </Stack>

            {/* Row 2 — time + days meta */}
            <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                {permissions.BATCH && (
                    <Stack direction="row" spacing={0.4} alignItems="center">
                        <AccessTimeIcon
                            sx={{ fontSize: "0.7rem", color: theme.palette.text.disabled }}
                        />
                        <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                            {batch.startTime} – {batch.endTime}
                        </Typography>
                    </Stack>
                )}
                <Stack direction="row" spacing={0.4} alignItems="center">
                    <CalendarTodayIcon
                        sx={{ fontSize: "0.7rem", color: theme.palette.text.disabled }}
                    />
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                        {batch.daysPerWeek}×/week
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ActivityBatchCard;
