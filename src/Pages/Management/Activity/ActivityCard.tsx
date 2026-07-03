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

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "16px",
                border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
                transition: "all 0.2s ease-in-out",
                boxShadow: `0 1px 2px ${alpha(theme.palette.text.primary, 0.05)}`,
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 16px ${alpha(theme.palette.text.primary, 0.07)}`,
                },
            }}
        >
            <Box sx={{ p: 1.75, pb: 1.25 }}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ minWidth: 0, flex: 1 }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "10px",
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.main,
                                fontSize: "1.2rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            {getIcon(activity.activityType)}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "1.0625rem",
                                    color: "text.primary",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    lineHeight: 1.3,
                                }}
                            >
                                {activity.activityType}
                            </Typography>
                            {activity.description && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                    display="block"
                                    sx={{ mt: 0.25 }}
                                >
                                    {activity.description}
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5} flexShrink={0}>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(activity)}
                            sx={{ p: 0.75, color: theme.palette.text.secondary }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => setOpenDeleteDialog(true)}
                            color="error"
                            sx={{ p: 0.75 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>

            <CardContent sx={{ pt: 0, px: 1.75, pb: "14px !important" }}>
                <Stack direction="row" spacing={0.75} alignItems="center" mb={1.25}>
                    <GroupsIcon sx={{ fontSize: "1.05rem" }} color="action" />
                    <Typography variant="caption" fontWeight={500} color="text.secondary">
                        {activity.batchEntries.length}{" "}
                        {isBatchEnabled ? "Batch" : "Membership plan"}
                        {activity.batchEntries.length !== 1
                            ? isBatchEnabled
                                ? "es"
                                : "s"
                            : ""}{" "}
                        available
                    </Typography>
                </Stack>

                <Stack spacing={1}>
                    {activity.batchEntries.slice(0, 2).map((batch: ActivityCardProps["activity"]["batchEntries"][0]) => (
                        <ActivityBatchCard key={batch.batchId} batch={batch} />
                    ))}

                    {activity.batchEntries.length > 2 && (
                        <Box sx={{ mt: 0.5 }}>
                            <Button
                                onClick={() => setShowMoreBatches(true)}
                                variant="text"
                                size="small"
                                startIcon={<ExpandMoreIcon />}
                                fullWidth
                                sx={{
                                    borderRadius: "8px",
                                    fontSize: "0.75rem",
                                    py: 0.5,
                                    textTransform: "none",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                + {activity.batchEntries.length - 2} More
                            </Button>
                        </Box>
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
