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
import { ActivityCard } from "./ActivityCard";
import { useAlert } from "../../../utils/Alert";
import {
  addActivityAPI,
  deleteActivityAPI,
  getAllActivitiesAPI,
  updateActivityAPI,
} from "./Activity.api";
import DeleteDialog from "../../../Components/DeleteDialog";
import { addActivity, deleteActivity, setActivities, updateActivity } from "../../../state/activitySlice";

const Activities = () => {
  const showAlert = useAlert();
  const allActivities = useSelector((state) => state.activity.activities);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [activityData, setActivityData] = useState(allActivities);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleAddCard = () => {
    if (editMode) {
      showAlert(
        "Please save or cancel the current edit before adding a new activity.",
        "warning"
      );
      return;
    }

    const newActivity = {
      activityType: "NEW",
      description: "",
      branchId: currentBranch.branchId,
      membershipPlanEntry: [
        {
          membershipType: "MONTHLY",
          daysPerWeek: 5,
          activityBatchEntries: [
            {
              price: 0.0,
              name: "Default Batch",
              startTime: "00:00",
              endTime: "00:00"
            }
          ]
        }
      ]
    }
    setActivityData((prev) => {
      return [...prev, newActivity]
    });
    setEditMode(newActivity.activityType);
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
    if (allActivities.lengh == 0 && !activityData) {
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

  const handleSaveCard = async (updatedActivity) => {
    if (!updatedActivity.membershipPlanEntry?.length) {
      showAlert("You must add at least one membership plan.", "error");
      return;
    }

    for (let i = 0; i < updatedActivity.membershipPlanEntry.length; i++) {
      const plan = updatedActivity.membershipPlanEntry[i];

      if (!plan.activityBatchEntries || plan.activityBatchEntries.length === 0) {
        showAlert(
          `Membership plan "${plan.membershipType}" must have at least one batch.`,
          "error"
        );
        return;
      }
    }

    if (!updatedActivity.activityType || updatedActivity.activityType === "NEW") {
      showAlert("Activity type is required.", "error");
      return;
    }

    if(allActivities.some(activity => activity.activityType === updatedActivity.activityType && activity.activityId !== updatedActivity.activityId)) {
      showAlert("Activity type must be unique.", "error");
      return;
    }

    try {
      if (updatedActivity?.activityId === undefined) {
        const { success, data, message } = await addActivityAPI({
          activityData: updatedActivity,
          token,
        });
        if (success) {
          setActivityData((prev) => {
            return [...prev.filter(f => f.activityId !== undefined), data]
          });
          dispatch(addActivity(data));
          setEditMode(false);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
      } else {
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
          setEditMode(false);
          showAlert(message, "success");
        } else {
          throw Error();
        }
      }
    } catch (error) {
      setEditMode(false);
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
          disabled={editMode}
          sx={{ fontWeight: "bold", padding: ".8rem" }}
          onClick={handleAddCard}
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
                  setEditMode(false);
                  setActivityData((prev) => {
                    return [...prev.filter(f => f.activityId !== undefined)]
                  });
                }}
                activity={activity}
                onUpdate={handleSaveCard}
                onDelete={() => setOpenDeleteDialog(true)}
                isEditing={editMode}
                setIsEditing={setEditMode}
              />
              <DeleteDialog
                displayData={activity.activityType}
                id={activity.activityId}
                open={openDeleteDialog}
                key={activity.activityType}
                onConfirm={handleDeleteActivity}
                onClose={() => setOpenDeleteDialog(false)}
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
    </div >
  );
};

export default Activities;
