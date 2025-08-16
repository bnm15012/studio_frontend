import { useState } from "react";
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
  const [batchName, setBatchName] = useState(selectedData?.batchName);
  const [availableDaysOptions, setAvailableDaysOptions] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchTime, setBatchTime] = useState("");

  const handleActivityChange = (_event, activity) => {
    const updatedActivity = activity;
    const updatedMembership = "";
    const updatedDaysPerWeek = null;
    const updatedAmount = null;
    const updatedBatchName = "default batch";
    const updatedBatchTime = "";

    setSelectedActivity(updatedActivity);
    setSelectedMembership(updatedMembership);
    setDaysPerWeek(updatedDaysPerWeek);
    setAmount(updatedAmount);
    setBatchName(updatedBatchName);
    setAvailableDaysOptions([]);
    setAvailableBatches([]);

    onSelect(
      null,
      updatedActivity,
      updatedMembership,
      updatedBatchName,
      updatedBatchTime,
      updatedDaysPerWeek,
      updatedAmount
    );
  };

  const handleMembershipChange = (event) => {
    const membership = event.target.value;
    const plans = selectedActivity?.membershipPlanEntry || [];
    const filteredPlans = plans.filter((p) => p.membershipType === membership);

    const plan = filteredPlans[0] || {};
    const updatedDaysPerWeek = plan.daysPerWeek || 0;
    const updatedDaysOptions = filteredPlans;
    const batches = plan.activityBatchEntries || [];
    const updatedBatchName = batches[0]?.name || "";
    const updatedBatchTime = `${batches[0]?.startTime || "00:00"} - ${batches[0]?.endTime || "00:00"}`;
    const updatedAmount = batches[0]?.price || 0;

    setSelectedMembership(membership);
    setDaysPerWeek(updatedDaysPerWeek);
    setAvailableDaysOptions(updatedDaysOptions);
    setAvailableBatches(batches);
    setBatchName(updatedBatchName);
    setBatchTime(updatedBatchTime);
    setAmount(updatedAmount);

    onSelect(
      null,
      selectedActivity,
      membership,
      updatedBatchName,
      updatedBatchTime,
      updatedDaysPerWeek,
      updatedAmount
    );
  };

  const handleDaysPerWeekChange = (event) => {
    const selectedDays = event.target.value;
    const selectedPlan = availableDaysOptions.find(
      (p) => p.daysPerWeek === selectedDays
    ) || {};

    const batches = selectedPlan.activityBatchEntries || [];
    const updatedBatchName = batches[0]?.name || "";
    const updatedBatchTime = `${batches[0]?.startTime || "00:00"} - ${batches[0]?.endTime || "00:00"}`;
    const updatedAmount = batches[0]?.price || 0;

    setDaysPerWeek(selectedDays);
    setAvailableBatches(batches);
    setBatchName(updatedBatchName);
    setBatchTime(updatedBatchTime);
    setAmount(updatedAmount);

    onSelect(
      null,
      selectedActivity,
      selectedMembership,
      updatedBatchName,
      updatedBatchTime,
      selectedDays,
      updatedAmount
    );
  };

  return (
    <>
      {amount == null}
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
                disabled={!selectedMembership || selectedMembership === "REGISTRATION"}
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
                  setAmount(amount || 0)
                  setBatchTime(`${batch?.startTime || "00:00"} - ${batch?.endTime || "00:00"}`);
                }}
                fullWidth
                disabled={availableBatches.length === 0 || selectedMembership === "REGISTRATION"}
              >
                {availableBatches &&
                  availableBatches.map((batch, idx) => (
                    <MenuItem key={idx} value={batch.name}>
                      {batch.name} (Rs. {batch.price} )
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </TableCell>
          <TableCell>{selectedMembership === "REGISTRATION" ? "-" : batchTime}</TableCell>
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
