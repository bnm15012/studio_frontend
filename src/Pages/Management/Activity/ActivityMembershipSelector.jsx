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
    activities.find((f) => f.activityId === selectedData?.activity?.activityId)
  );
  const [selectedMembership, setSelectedMembership] = useState(
    selectedData?.membershipType
  );
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [amount, setAmount] = useState(null);
  const [availableDaysOptions, setAvailableDaysOptions] = useState([]);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedActivity, selectedMembership, daysPerWeek, amount);
    }
  }, [selectedActivity, selectedMembership, daysPerWeek, amount]);

  const handleActivityChange = (_event, activity) => {
    setSelectedActivity(activity);
    setSelectedMembership("");
    setDaysPerWeek(null);
    setAmount(null);
    setAvailableDaysOptions([]);
  };

  const handleMembershipChange = (event) => {
    const membership = event.target.value;
    setSelectedMembership(membership);
    setDaysPerWeek(null);
    setAmount(null);

    const plans =
      selectedActivity?.membershipPlanRequest?.membershipPlanEntryList || [];

    const filteredPlans = plans.filter(
      (p) => p.membershipType === membership
    );

    const plan = filteredPlans[0];
    setDaysPerWeek(plan.daysPerWeek);
    setAmount(plan.amount);
    setAvailableDaysOptions(filteredPlans);
  };

  const handleDaysPerWeekChange = (event) => {
    const selectedDays = event.target.value;
    const selectedPlan = availableDaysOptions.find(
      (p) => p.daysPerWeek === selectedDays
    );

    setDaysPerWeek(selectedDays);
    setAmount(selectedPlan?.amount ?? null);
  };

  return (
    <>
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
                      selectedActivity.membershipPlanRequest.membershipPlanEntryList.map(
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
          <TableCell>
            {(
              <FormControl fullWidth>
                <Select
                  variant="standard"
                  value={daysPerWeek === null ? "" : daysPerWeek}
                  onChange={handleDaysPerWeekChange}
                  fullWidth
                  disabled={!selectedMembership}
                >
                  {availableDaysOptions.map((plan, index) => (
                    <MenuItem key={index} value={plan.daysPerWeek}>
                      ₹{plan.amount} {selectedMembership !== "REGISTRATION" && <> - {plan.daysPerWeek} {plan.daysPerWeek > 1 ? "days/week" : "day/week"} </>}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </TableCell>
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
      ]).isRequired,
      activityType: PropTypes.string.isRequired,
    }),
    membershipType: PropTypes.string,
  }),
  isMemberSHipToo: PropTypes.bool,
};

export default ActivityMembershipSelector;
