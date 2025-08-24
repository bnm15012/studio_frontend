import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import {
  Add,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../../../Components/FlexBetween";
import { useAlert } from "../../../utils/Alert";
import {
  addActivityAPI,
  deleteActivityAPI,
  getAllActivitiesAPI,
  updateActivityAPI,
} from "./Activity.api";
import { addActivity, deleteActivity, setActivities, updateActivity } from "../../../state/activitySlice";
import ActivityCard from "./ActivityCard";
import ActivityDialog from "./ActivityDialog";
import { useUI } from "../../../context/UIContext";

const Activities = () => {
  const showAlert = useAlert();
  const { isBatchEnabled } = useUI();
  const allActivities = useSelector((state) => state.activity.activities);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [activityData, setActivityData] = useState();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState();

  const handleAddActivity = () => {
    setEditingActivity(undefined);
    setDialogOpen(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setDialogOpen(true);
  };

  const fetchActivityData = useCallback(async () => {
    try {
      const { success, data } = await getAllActivitiesAPI({
        branchId: currentBranch.branchId,
        token,
      });
      if (success) {
        setActivityData(data);
        dispatch(setActivities(data));
      }
    } catch (error) {
      console.error(error);
      showAlert("Error retrieving activities!", "error");
    }
  }, [dispatch, showAlert, currentBranch.branchId, token]);

  useEffect(() => {
    if (allActivities.length == 0 && !activityData) {
      fetchActivityData();
    }
  }, [allActivities.lengh, fetchActivityData, allActivities, activityData]);

  useEffect(() => {
    setActivityData(allActivities);
  }, [allActivities]);

  const handleDeleteActivity = async (activityId) => {
    try {
      const { success } = await deleteActivityAPI({
        token,
        activityId: activityId,
      });
      if (success) {
        const updatedData = activityData.filter(
          (activity) => activity.activityId !== activityId
        );
        setActivityData(updatedData);
        dispatch(deleteActivity(activityId));
        showAlert("Activity deleted successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error deleting activity!", "error");
    }
  };

  const checkUniqueConstraint = (batchEntries) => {
    const duplicates = new Set();
    let isValid = true;
    batchEntries.forEach((batch) => {
      const key = `${batch.name}-${batch.planType}-${batch.daysPerWeek}`;
      if (duplicates.has(key)) {
        isValid = false;
      }
      duplicates.add(key);
    });
    return isValid;
  }

  const handleSaveCard = async (updatedActivity) => {
    if (!updatedActivity.batchEntries.length) {
      showAlert(`You must add at least one ${isBatchEnabled ? "batch" : "membership"}.`, "error");
      return;
    }

    if (!updatedActivity.activityType || updatedActivity.activityType === "NEW") {
      showAlert("Activity type is required.", "error");
      return;
    }

    if (allActivities.some(activity => activity.activityType === updatedActivity.activityType && activity.activityId !== updatedActivity.activityId)) {
      showAlert("Activity type must be unique.", "error");
      return;
    }

    if (!checkUniqueConstraint(updatedActivity.batchEntries)) {
      showAlert(`name, plan type and days per week can not be same for multiple ${isBatchEnabled ? "batch" : "membership"}.`, "error");
      return;
    }

    try {
      if (updatedActivity?.activityId === "NEW") {
        delete updatedActivity.activityId;
        updatedActivity.batchEntries.map((batch) => {
          delete batch.batchId;
        })
        const { success, data, message } = await addActivityAPI({
          activityData: updatedActivity,
          token,
        });
        if (success) {
          setActivityData((prev) => {
            return [...prev.filter(f => f.activityId !== "NEW"), data]
          });
          dispatch(addActivity(data));
          setDialogOpen(false);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
      } else {
        updatedActivity.batchEntries.map((batch) => {
          if ("string" === typeof batch.batchId) delete batch.batchId;
        })
        const { success, data, message } = await updateActivityAPI({
          activityId: updatedActivity.activityId,
          activityData: updatedActivity,
          token,
        });
        if (success) {
          dispatch(updateActivity(data));
          setActivityData((prev) => {
            return [...prev.filter(f => f.activityId !== data.activityId), data]
          });
          setDialogOpen(false);
          showAlert(message, "success");
        } else {
          throw Error();
        }
      }
    } catch (error) {
      console.error(error);
      showAlert("Error updating activity!", "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <FlexBetween paddingBottom={2} gap={1}>
        <Box sx={{ flexGrow: "1" }} />
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: "bold", padding: ".8rem" }}
          onClick={handleAddActivity}
        >
          <Add />
        </Button>
      </FlexBetween>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }}
          gap={3}
        >
          {activityData && activityData.map((activity, index) => (
            <Box key={activity.activityId}>
              <ActivityCard
                index={index}
                cancelEdit={() => {
                  setActivityData((prev) => {
                    return [...prev.filter(f => f.activityId !== undefined)]
                  });
                }}
                activity={activity}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            </Box>
          ))}
        </Box>

        {activityData?.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={12}
            textAlign="center"
          >
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
              🏋️
            </Typography>
            <Typography variant="h3" fontWeight={600} mb={2}>
              No Activities Yet
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Start by creating your first activity
            </Typography>
          </Box>
        )}
      </Container>
      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activity={editingActivity}
        onSave={handleSaveCard}
      />
    </div >
  );
};

export default Activities;
