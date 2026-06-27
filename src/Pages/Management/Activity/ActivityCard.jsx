import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    Box,
    Stack,
    alpha,
    useTheme,
    Button,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import { getIcon } from "./Activities.constants";
import { useState } from "react";
import ShowMoreBatches from "./ShowMoreBatches";
import ActivityBatchCard from "./ActivityBatchCard";
import { useUI } from "../../../context/UIContext";
import DeleteDialog from "../../../core/components/dialogs/DeleteDialog";

const ActivityCard = ({ activity, onEdit, onDelete }) => {
    const theme = useTheme();
    const [showMoreBatches, setShowMoreBatches] = useState(false);
    const { isBatchEnabled } = useUI();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    return (
        <Card
            elevation={3}
            sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.85),
                backdropFilter: "blur(12px)",
                transition: "0.3s",
                borderRadius: 3,
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: "linear-gradient(90deg, #0288d1, #26c6da, #4dd0e1)",
                }}
            />
            <CardHeader
                sx={{ pb: 1 }}
                title={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                color: "white",
                                fontSize: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: 2,
                            }}
                        >
                            {getIcon(activity.activityType)}
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {activity.activityType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {activity.description || "No description available"}
                            </Typography>
                        </Box>
                    </Stack>
                }
                action={
                    <Stack direction="column" spacing={1}>
                        <IconButton size="small" onClick={() => onEdit(activity)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={() => setOpenDeleteDialog(true)}
                            color="error"
                            size="small"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                }
            />

            <Divider />

            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <GroupsIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={500}>
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

                <Stack spacing={2}>
                    {activity.batchEntries.slice(0, 2).map((batch) => (
                        <ActivityBatchCard key={batch.batchId} batch={batch} />
                    ))}

                    {activity.batchEntries.length > 2 && (
                        <>
                            <Typography variant="body2" color="text.secondary" align="center">
                                +{activity.batchEntries.length - 2} more batch
                                {activity.batchEntries.length - 2 !== 1 ? "es" : ""}
                            </Typography>
                            <Button
                                onClick={() => setShowMoreBatches(true)}
                                variant="outlined"
                                size="small"
                                startIcon={<ExpandMoreIcon />}
                                fullWidth
                                sx={{ borderRadius: 2 }}
                            >
                                Show More
                            </Button>
                        </>
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
                id={activity.activityId}
                open={openDeleteDialog}
                key={activity.activityType}
                onConfirm={() => onDelete(activity.activityId)}
                onClose={() => setOpenDeleteDialog(false)}
            />
        </Card>
    );
};

ActivityCard.propTypes = {
    activity: PropTypes.shape({
        activityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        activityType: PropTypes.string.isRequired,
        description: PropTypes.string,
        batchEntries: PropTypes.arrayOf(
            PropTypes.shape({
                batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                planType: PropTypes.string.isRequired,
                startTime: PropTypes.string.isRequired,
                endTime: PropTypes.string.isRequired,
                price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                daysPerWeek: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            }),
        ).isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ActivityCard;
