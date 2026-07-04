import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Stack,
    alpha,
    useTheme,
    Button,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getIcon } from "./Activities.constants";
import { useState } from "react";
import ShowMoreBatches from "./ShowMoreBatches";
import ActivityBatchCard from "./ActivityBatchCard";
import { useUI } from "../../../context/UIContext";
import DeleteDialog from "@/core/components/dialogs/DeleteDialog";

interface ActivityCardProps {
    activity: {
        activityId?: string | number;
        activityType: string;
        description?: string;
        batchEntries: {
            batchId: string | number;
            name: string;
            planType: string;
            startTime: string;
            endTime: string;
            price: string | number;
            daysPerWeek: string | number;
        }[];
    };
    onEdit: (activity: ActivityCardProps["activity"]) => void;
    onDelete: (activityId: string | number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onEdit, onDelete }) => {
    const theme = useTheme();
    const [showMoreBatches, setShowMoreBatches] = useState(false);
    const { isBatchEnabled } = useUI();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const visibleBatches = activity.batchEntries.slice(0, 2);
    const remaining = activity.batchEntries.length - 2;

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "12px",
                border: "none",
                boxShadow: [
                    `0 1px 3px rgba(0,0,0,0.08)`,
                    `0 1px 2px rgba(0,0,0,0.06)`,
                ].join(", "),
                overflow: "visible",
            }}
        >
            <Box sx={{ p: 2, pb: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "10px",
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            fontSize: "1.25rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {getIcon(activity.activityType)}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "0.9375rem",
                                    color: "text.primary",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    lineHeight: 1.4,
                                }}
                            >
                                {activity.activityType}
                            </Typography>
                            <Stack direction="row" spacing={0.25} flexShrink={0}>
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(activity)}
                                    sx={{
                                        p: 0.5,
                                        color: theme.palette.text.secondary,
                                        "&:hover": { color: theme.palette.primary.main },
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{
                                        p: 0.5,
                                        color: theme.palette.text.secondary,
                                        "&:hover": { color: theme.palette.error.main },
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                                </IconButton>
                            </Stack>
                        </Stack>
                        {activity.description && (
                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    fontWeight: 400,
                                    lineHeight: 1.4,
                                    mt: 0.25,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {activity.description}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>

            <CardContent sx={{ pt: 0, px: 2, pb: "12px !important" }}>
                <Stack direction="row" alignItems="center" spacing={0.75} mb={1.25}>
                    <GroupsIcon sx={{ fontSize: "0.9375rem", color: theme.palette.text.secondary }} />
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "text.secondary" }}>
                        {activity.batchEntries.length}{" "}
                        {isBatchEnabled ? "Batch" : "Membership plan"}
                        {activity.batchEntries.length !== 1
                            ? isBatchEnabled
                                ? "es"
                                : "s"
                            : ""}
                    </Typography>
                    <Chip
                        size="small"
                        label={activity.batchEntries.length}
                        sx={{
                            height: 18,
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            borderRadius: "6px",
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            "& .MuiChip-label": { px: 0.75 },
                        }}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    {visibleBatches.map((batch) => (
                        <ActivityBatchCard key={batch.batchId} batch={batch} />
                    ))}

                    {remaining > 0 && (
                        <Button
                            onClick={() => setShowMoreBatches(true)}
                            variant="text"
                            size="small"
                            startIcon={<ExpandMoreIcon />}
                            fullWidth
                            sx={{
                                borderRadius: "8px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                py: 0.5,
                                textTransform: "none",
                                color: theme.palette.text.secondary,
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                },
                            }}
                        >
                            + {remaining} more
                        </Button>
                    )}
                </Stack>
            </CardContent>

            {showMoreBatches && (
                <ShowMoreBatches
                    batchEntries={activity.batchEntries}
                    onClose={() => setShowMoreBatches(false)}
                />
            )}
            <DeleteDialog
                displayData={activity.activityType}
                id={activity.activityId ?? ""}
                open={openDeleteDialog}
                key={activity.activityType}
                onConfirm={() => onDelete(activity.activityId ?? "")}
                onClose={() => setOpenDeleteDialog(false)}
            />
        </Card>
    );
};

export default ActivityCard;
