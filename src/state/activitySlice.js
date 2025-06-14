import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload || [];
    },
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    updateActivity: (state, action) => {
      const updated = action.payload;
      const index = state.activities.findIndex(a => a.activityId === updated.activityId);
      if (index !== -1) {
        state.activities[index] = updated;
      }
    },
    deleteActivity: (state, action) => {
      state.activities = state.activities.filter(a => a.activityId !== action.payload.activityId);
    },
    clearActivities: (state) => {
      state.activities = [];
    },
  },
});

export const {
  setActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  clearActivities,
} = activitySlice.actions;

export default activitySlice.reducer;
