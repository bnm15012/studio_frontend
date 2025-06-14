import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Check,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FlexEvenly from "../../../Components/FlexEvenly";
import FlexBetween from "../../../Components/FlexBetween";
import { useAlert } from "../../../utils/Alert";
import {
  addActivityAPI,
  deleteActivityAPI,
  getAllActivitiesAPI,
  updateActivityAPI,
} from "./Activity.api";
import { validateAmount } from "./Activity.constraints"; // Import constraints
import MembershipTable from "./MembershipTable";
import DeleteDialog from "../../../Components/DeleteDialog";
import { getIcon, validActivityTypes, validMembershipTypes, CARD_BG_COLORS } from "./Activities.constants";
import { addActivity, deleteActivity, setActivities, updateActivity } from "../../../state/activitySlice";

const Activities = () => {
  const showAlert = useAlert();
  const allActivities = useSelector((state) => state.activity.activities);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [activityData, setActivityData] = useState(allActivities);
  const [editMode, setEditMode] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [errors, setErrors] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleAddCard = () => {
    if (editMode !== null) {
      showAlert(
        "Please save or cancel the current edit before adding a new activity.",
        "warning"
      );
      return;
    }

    const newActivity = {
      activityType: "NEW",
      description: "",
      membershipPlanRequest: {
        membershipPlanEntryList: [{ membershipType: "", daysPerWeek: 7, amount: "" }],
      },
    };

    setActivityData((prev) => [...prev, newActivity]);
    setEditMode(newActivity.activityType);
    setTempData(newActivity);
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
    allActivities.lengh == 0 && fetchActivityData();
  }, [fetchActivityData]);

  const handleEditCard = (activity) => {
    setEditMode(activity.activityType);
    setTempData({ ...activity });
    setErrors({});
  };

  const handleDeleteActivity = async (idx) => {
    try {
      const { success } = await deleteActivityAPI({
        token,
        activityId: activityData[idx].activityId,
      });
      if (success) {
        const updatedData = activityData.filter(
          (_, activityIdx) => activityIdx !== idx
        );

        setActivityData(updatedData);
        dispatch(deleteActivity(activityData[idx]));
        showAlert("Activity deleted successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error deleting activity!", "error");
    }
  };

  const checkPlanUniqueness = (plans, excludeIndex = null) => {
    const seen = new Set();
    for (let i = 0; i < plans.length; i++) {
      if (i === excludeIndex) continue; // Skip the plan being updated
      const plan = plans[i];
      if (!plan.membershipType || plan.daysPerWeek == null) continue;
      const key = `${plan.membershipType}-${plan.daysPerWeek}`;
      if (seen.has(key)) {
        return {
          isDuplicate: true,
          duplicateType: plan.membershipType,
          duplicateDays: plan.daysPerWeek,
        };
      }
      seen.add(key);
    }
    return { isDuplicate: false };
  };

  const handleSaveCard = async (id) => {
    const validationErrors = {};
    const { isDuplicate, duplicateType, duplicateDays } = checkPlanUniqueness(
      tempData.membershipPlanRequest.membershipPlanEntryList
    );
    if (isDuplicate) {
      showAlert(`Membership plan with type "${duplicateType}" and ${duplicateDays} days/week already exists.`, "error")
      return;
    }

    tempData.membershipPlanRequest.membershipPlanEntryList.map((plan, idx) => {
      if (!validateAmount(plan.amount)) {
        validationErrors[`amount_${idx}`] = "Invalid amount.";
      }
      return plan;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedData = [...activityData];
    updatedData[id] = tempData;

    try {
      if (updatedData[id]?.activityId === undefined) {
        updatedData[id]["branchId"] = currentBranch.branchId;
        const { success, data, message } = await addActivityAPI({
          activityData: updatedData[id],
          token,
        });
        if (success) {
          updatedData[id] = data;
          setActivityData(updatedData);
          dispatch(addActivity(updatedData[id]));
          setEditMode(null);
          setTempData(null);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
      } else {
        const { success, data, message } = await updateActivityAPI({
          activityId: updatedData[id].activityId,
          activityData: updatedData[id],
          token,
        });
        if (success) {
          dispatch(updateActivity(data));
          updatedData[id] = data;
          setActivityData(updatedData);
          setEditMode(null);
          setTempData(null);
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

  const handleCancelEdit = () => {
    if (tempData && tempData?.activityId === undefined) {
      // Remove the newly added unsaved activity
      setActivityData((prev) =>
        prev.filter((activity) => activity?.activityId !== undefined)
      );
    }
    setEditMode(null);
    setTempData(null);
    setErrors({});
  };

  const handleAddNewPlan = () => {
    setTempData((prev) => ({
      ...prev,
      membershipPlanRequest: {
        membershipPlanEntryList: [
          ...prev.membershipPlanRequest.membershipPlanEntryList,
          { membershipType: "", daysPerWeek: 7, amount: "" },
        ],
      },
    }));
  };

  const updateMembershipPlan = (idx, field, value) => {
    setTempData((prev) => {
      const updatedPlans =
        prev.membershipPlanRequest.membershipPlanEntryList.map(
          (plan, planIdx) =>
            planIdx === idx ? { ...plan, [field]: value } : plan
        );

      return {
        ...prev,
        membershipPlanRequest: {
          membershipPlanEntryList: updatedPlans,
        },
      };
    });
  };

  const handleDeletePlan = (idx) => {
    // Constraint: Ensure the plan is not the last one in the list
    const plansList = tempData.membershipPlanRequest.membershipPlanEntryList;

    if (plansList.length === 1) {
      // If there's only one plan left, prevent deletion
      showAlert("You cannot delete the last membership plan.", "warning");
      return;
    }

    setTempData((prev) => ({
      ...prev,
      membershipPlanRequest: {
        membershipPlanEntryList:
          prev.membershipPlanRequest.membershipPlanEntryList.filter(
            (_, planIdx) => planIdx !== idx
          ),
      },
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <FlexBetween paddingBottom={2} gap={1}>
        <Box sx={{ flexGrow: "1" }} />
        <Button
          variant="contained"
          color="primary"
          disabled={editMode !== null}
          sx={{ fontWeight: "bold", padding: ".8rem" }}
          onClick={handleAddCard}
        >
          <Add />
        </Button>
      </FlexBetween>

      <FlexEvenly
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(450px, 1fr))" },
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        flexWrap="wrap">
        {activityData &&
          activityData.map((activity, index) => (
            <Card
              key={index}
              sx={{
                maxWidth: 450,
                textAlign: "center",
                borderRadius: 4,
                p: 1,
                height: "32rem",
                boxShadow: 5,
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
                transition: "transform 0.3s",
                position: "relative",
                background: CARD_BG_COLORS[index % CARD_BG_COLORS.length],
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "0 0px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 0.5,
                }}
              >
                {editMode === activity.activityType ? (
                  <>
                    <IconButton
                      onClick={() => handleSaveCard(index)}
                      color="success"
                    >
                      <Check />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} color="error">
                      <Close />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      disabled={editMode !== null}
                      sx={{ color: "red" }}
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      disabled={editMode !== null}
                      sx={{ color: "blue" }}
                      onClick={() => handleEditCard(activity)}
                    >
                      <Edit />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box sx={{
                flexGrow: "1",
              }}>
                {editMode === activity.activityType ? (
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel>Activity Type</InputLabel>
                      <Select
                        label="Activity Type"
                        value={tempData.activityType}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            activityType: e.target.value,
                          }))
                        }
                        error={!!errors.activityType}
                      >
                        {validActivityTypes.map((m) => {
                          return (
                            <MenuItem value={m} key={m}>
                              {m}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.activityType && (
                        <span style={{ color: "red" }}>
                          {errors.activityType}
                        </span>
                      )}
                    </FormControl>
                    <TextField
                      label="Description"
                      value={tempData.description}
                      onChange={(e) =>
                        setTempData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      error={!!errors.description}
                      helperText={errors.description}
                      fullWidth
                    />
                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                      Membership Plans
                    </Typography>
                    <Box sx={{ overflow: "auto", height: "10rem" }}>
                      {tempData.membershipPlanRequest.membershipPlanEntryList.map(
                        (plan, idx) => (
                          <FlexBetween
                            alignItems={"center"}
                            key={idx}
                            gap={1}
                          >
                            <FormControl variant="standard" fullWidth>
                              <InputLabel>Membership Type</InputLabel>
                              <Select
                                label="Membership Type"
                                value={plan.membershipType}
                                onChange={(e) => {
                                  updateMembershipPlan(
                                    idx,
                                    "membershipType",
                                    e.target.value
                                  )
                                  e.target.value === "REGISTRATION" && updateMembershipPlan(idx, "daysPerWeek", 0)
                                }
                                }
                                error={!!errors[`membershipType_${idx}`]}
                              >
                                {validMembershipTypes.map((m) => {
                                  return (
                                    <MenuItem value={m} key={m}>
                                      {m}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              {errors.activityType && (
                                <span style={{ color: "red" }}>
                                  {errors.activityType}
                                </span>
                              )}
                            </FormControl>
                            <TextField
                              label="Days Per Week"
                              type="number"
                              variant="standard"
                              disabled={plan.membershipType === "REGISTRATION"}
                              value={plan.daysPerWeek}
                              onChange={(e) =>
                                updateMembershipPlan(idx, "daysPerWeek", e.target.value)
                              }
                            />
                            <TextField
                              label="Amount"
                              type="number"
                              variant="standard"
                              value={plan.amount}
                              onChange={(e) =>
                                updateMembershipPlan(idx, "amount", e.target.value)
                              }
                              error={!!errors[`amount_${idx}`]}
                              helperText={errors[`amount_${idx}`]}
                            />
                            <Button
                              sx={{ color: "red" }}
                              onClick={() => handleDeletePlan(idx)}
                            >
                              <Delete />
                            </Button>
                          </FlexBetween>
                        )
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleAddNewPlan}
                    >
                      Add Plan
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent sx={{ height: "100%" }}>
                    <FlexBetween flexDirection="column" height={"100%"}>
                      <Box>
                        <Box>{getIcon(activity.activityType)}</Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "bold" }}
                          gutterBottom
                        >
                          {activity.activityType}
                        </Typography>
                        <Typography variant="body1">
                          {activity.description}
                        </Typography>
                      </Box>
                      <MembershipTable
                        plans={
                          activity.membershipPlanRequest.membershipPlanEntryList
                        }
                        index={index}
                      />
                    </FlexBetween>
                  </CardContent>
                )}
              </Box>
              <DeleteDialog
                displayData={activity.activityType}
                id={activity.activityId}
                open={openDeleteDialog}
                key={activity.activityType}
                onConfirm={() => handleDeleteActivity(index)}
                onClose={() => setOpenDeleteDialog(false)}
              />
            </Card>
          ))}
        {activityData.length === 0 && (
          <Box
            sx={{
              maxWidth: 500,
              width: "100%",
              textAlign: "center",
              p: 10,
              transition: "transform 0.3s",
              position: "relative",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                background: "linear-gradient(45deg, #666666 30%, #999999 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              No Activities Added Yet!
            </Typography>
          </Box>
        )}
      </FlexEvenly>
    </div >
  );
};

export default Activities;
