import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Stack,
    alpha,
    useTheme,
    Chip,
    Collapse,
    Divider,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { getIcon } from "./Activities.constants";
import { useState } from "react";
import ShowMoreBatches from "./ShowMoreBatches";
import ActivityBatchCard from "./ActivityBatchCard";
import { useAppUI } from "@/context/UIContext";
import DeleteDialog from "@/core/components/dialogs/DeleteDialog";
import { colorTokens } from "@/core/utils/theme/theme";

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
    /** Index used to pick the gradient from the theme's activityCardGradient palette */
    index?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onEdit, onDelete, index = 0 }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [expanded, setExpanded] = useState(false);
    const [showMoreBatches, setShowMoreBatches] = useState(false);
    const { permissions } = useAppUI();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const PREVIEW = 2;
    const visibleBatches = activity.batchEntries.slice(0, PREVIEW);
    const extraBatches = activity.batchEntries.slice(PREVIEW);
    const remaining = extraBatches.length;

    // Pull gradient from theme (populated by themeSettings)
    const gradients: string[] =
        theme.palette.activityCardGradient ??
        colorTokens.activityCardGradient[isDark ? "dark" : "light"];
    const gradient = gradients[index % gradients.length];

    const batchLabel = permissions.BATCH ? "Batch" : "Membership Plan";
    const batchLabelPlural = permissions.BATCH ? "Batches" : "Membership Plans";

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    borderRadius: "16px",
                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    overflow: "hidden",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: theme.shadows[8],
                    },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* ── Gradient header banner ─────────────────────────────── */}
                <Box
                    sx={{
                        background: gradient,
                        px: 2,
                        pt: 2,
                        pb: 3,
                        position: "relative",
                    }}
                >
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        {/* Icon + title */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "12px",
                                    background: isDark
                                        ? "rgba(0,0,0,0.35)"
                                        : "rgba(255,255,255,0.55)",
                                    backdropFilter: "blur(6px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem",
                                    flexShrink: 0,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                }}
                            >
                                {getIcon(activity.activityType)}
                            </Box>
                            <Box>
                                <Typography
                                    fontWeight={700}
                                    fontSize="1rem"
                                    sx={{
                                        color: isDark ? "#fff" : "#fff",
                                        textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {activity.activityType.replace(/_/g, " ")}
                                </Typography>
                                {activity.description && (
                                    <Typography
                                        fontSize="0.75rem"
                                        sx={{
                                            color: isDark
                                                ? "rgba(255,255,255,0.7)"
                                                : "rgba(255,255,255,0.85)",
                                            mt: 0.25,
                                            lineHeight: 1.3,
                                        }}
                                        noWrap
                                    >
                                        {activity.description}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>

                        {/* Action buttons */}
                        <Stack direction="row" spacing={0.25} sx={{ ml: 1 }}>
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(activity)}
                                    sx={{
                                        color: isDark
                                            ? "rgba(255,255,255,0.8)"
                                            : "rgba(255,255,255,0.9)",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            color: "#fff",
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{
                                        color: isDark
                                            ? "rgba(255,255,255,0.8)"
                                            : "rgba(255,255,255,0.9)",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,80,80,0.25)",
                                            color: "#fff",
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    {/* Batch count pill — floated to bottom-right of banner */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -14,
                            right: 16,
                            zIndex: 1,
                        }}
                    >
                        <Chip
                            size="small"
                            label={`${activity.batchEntries.length} ${activity.batchEntries.length === 1 ? batchLabel : batchLabelPlural}`}
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 28,
                                borderRadius: "8px",
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.primary.main,
                                border: `1.5px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                px: 0.5,
                            }}
                        />
                    </Box>
                </Box>

                {/* ── Batch list ────────────────────────────────────────── */}
                <CardContent
                    sx={{
                        pt: 2.5,
                        px: 2,
                        pb: "12px !important",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {activity.batchEntries.length === 0 ? (
                        <Typography
                            variant="body2"
                            color="text.disabled"
                            textAlign="center"
                            sx={{ py: 2 }}
                        >
                            No {batchLabelPlural.toLowerCase()} added yet
                        </Typography>
                    ) : (
                        <Stack spacing={0} divider={<Divider sx={{ opacity: 0.4 }} />}>
                            {visibleBatches.map((batch) => (
                                <ActivityBatchCard key={batch.batchId} batch={batch} />
                            ))}

                            {/* Collapsible extra batches */}
                            {remaining > 0 && (
                                <>
                                    <Collapse in={expanded} unmountOnExit>
                                        <Stack
                                            spacing={0}
                                            divider={<Divider sx={{ opacity: 0.4 }} />}
                                        >
                                            {extraBatches.map((batch) => (
                                                <ActivityBatchCard
                                                    key={batch.batchId}
                                                    batch={batch}
                                                />
                                            ))}
                                        </Stack>
                                    </Collapse>

                                    <Box
                                        onClick={() => setExpanded((v) => !v)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 0.5,
                                            mt: 0.5,
                                            py: 0.75,
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            color: theme.palette.primary.main,
                                            fontSize: "0.78rem",
                                            fontWeight: 600,
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.06),
                                            },
                                            transition: "background 0.15s",
                                        }}
                                    >
                                        {expanded ? (
                                            <>
                                                <ExpandLessIcon sx={{ fontSize: "1rem" }} />
                                                Show less
                                            </>
                                        ) : (
                                            <>
                                                <ExpandMoreIcon sx={{ fontSize: "1rem" }} />+
                                                {remaining} more
                                            </>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Stack>
                    )}
                </CardContent>
            </Card>

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
        </>
    );
};

export default ActivityCard;
