import { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  TableCell,
} from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ActivityMembershipSelector = ({
  onSelect,
  selectedData,
  isMemberSHipToo = true,
}) => {
  const activities = useSelector((state) => state.activity.activities);
  const [selectedActivity, setSelectedActivity] = useState(
    activities.find((f) => f.activityId === selectedData?.activity?.activityId) || null
  );
  const [selectedMembership, setSelectedMembership] = useState(
    selectedData?.membershipType || ""
  );
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [amount, setAmount] = useState(null);
  const [batchName, setBatchName] = useState(selectedData?.batchName || "default batch");
  const [availableDaysOptions, setAvailableDaysOptions] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchTime, setBatchTime] = useState("00:00 - 00:00");

  useEffect(() => {
    if (onSelect) {
      onSelect(null, selectedActivity, selectedMembership, batchName, batchTime, daysPerWeek, amount);
    }
  }, [selectedActivity, selectedMembership, daysPerWeek, amount, batchName, onSelect, batchTime]);

  const handleActivityChange = (_event, activity) => {
    setSelectedActivity(activity);
    setSelectedMembership("");
    setDaysPerWeek(null);
    setAmount(null);
    setBatchName("default batch");
    setAvailableDaysOptions([]);
    setAvailableBatches([]);
  };

  const handleMembershipChange = (event) => {
    const membership = event.target.value;
    setSelectedMembership(membership);
    setDaysPerWeek(null);

    const plans = selectedActivity?.membershipPlanEntry || [];
    const filteredPlans = plans.filter((p) => p.membershipType === membership);

    const plan = filteredPlans[0];
    setDaysPerWeek(plan?.daysPerWeek || null);
    setAvailableDaysOptions(filteredPlans);

    // Batches for selected plan
    const batches = plan?.activityBatchEntries || [];
    setAvailableBatches(batches);
    setBatchName(batches[0]?.name);
    setBatchTime(`${batches[0]?.startTime || "00:00"} - ${batches[0]?.endTime || "00:00"}`);
    setAmount(batches[0]?.price);
  };

  const handleDaysPerWeekChange = (event) => {
    const selectedDays = event.target.value;
    const selectedPlan = availableDaysOptions.find(
      (p) => p.daysPerWeek === selectedDays
    );

    setDaysPerWeek(selectedDays);
    // Update batches when days change
    const batches = selectedPlan?.activityBatchEntries || [];
    setAvailableBatches(batches);
    setBatchName(batches[0]?.name);
    setBatchTime(`${batches[0]?.startTime || "00:00"} - ${batches[0]?.endTime || "00:00"}`);
    setAmount(batches[0]?.price);

  };

  return (
    <>
      {/* Activity */}
      <TableCell>
        <FormControl fullWidth>
          <Select
            variant="standard"
            value={selectedActivity?.activityId || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selected = activities.find(
                (activity) => activity.activityId === selectedId
              );
              if (selected) {
                handleActivityChange(e, selected);
              }
            }}
            fullWidth
          >
            {activities.map((activity) => (
              <MenuItem key={activity.activityId} value={activity.activityId}>
                {activity.activityType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>

      {isMemberSHipToo && (
        <>
          {/* Membership */}
          <TableCell>
            <FormControl fullWidth>
              <Select
                variant="standard"
                value={selectedMembership || ""}
                onChange={handleMembershipChange}
                fullWidth
                disabled={!selectedActivity}
              >
                {selectedActivity &&
                  [
                    ...new Set(
                      selectedActivity.membershipPlanEntry.map(
                        (plan) => plan.membershipType
                      )
                    ),
                  ].map((membershipType, idx) => (
                    <MenuItem key={idx} value={membershipType}>
                      {membershipType}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </TableCell>

          {/* Days per week */}
          <TableCell>
            <FormControl fullWidth>
              <Select
                variant="standard"
                value={daysPerWeek ?? ""}
                onChange={handleDaysPerWeekChange}
                fullWidth
                disabled={!selectedMembership}
              >
                {availableDaysOptions.map((plan, index) => (
                  <MenuItem key={index} value={plan.daysPerWeek}>
                    {selectedMembership !== "REGISTRATION" && (
                      <>
                        {plan.daysPerWeek}{" "}
                        {plan.daysPerWeek > 1 ? "days/week" : "day/week"}
                      </>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>

          {/* Batch Name */}
          <TableCell>
            <FormControl fullWidth>
              <Select
                variant="standard"
                value={batchName}
                onChange={(e) => {
                  setBatchName(e.target.value);
                  const batch = availableBatches.find(batch => batch.name === e.target.value);
                  const amount = batch?.price;
                  setAmount(typeof amount === "number" ? amount : null)
                  setBatchTime(`${batch?.startTime || "00:00"} - ${batch?.endTime || "00:00"}`);
                }}
                fullWidth
                disabled={availableBatches.length === 0}
              >
                {availableBatches.length > 0 ? (
                  availableBatches.map((batch, idx) => (
                    <MenuItem key={idx} value={batch.name}>
                      {batch.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="default batch">default batch</MenuItem>
                )}
              </Select>
            </FormControl>
          </TableCell>
          <TableCell></TableCell>
        </>
      )}
    </>
  );
};

ActivityMembershipSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedData: PropTypes.shape({
    activity: PropTypes.shape({
      activityId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      activityType: PropTypes.string,
    }),
    membershipType: PropTypes.string,
    batchName: PropTypes.string,
  }),
  isMemberSHipToo: PropTypes.bool,
};

export default ActivityMembershipSelector;
