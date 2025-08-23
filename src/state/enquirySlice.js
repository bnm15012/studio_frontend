import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    setEnquiries: (state, action) => {
      state.data = action.payload || [];
    },
    addEnquiry: (state, action) => {
      state.data.push(action.payload);
    },
    updateEnquiry: (state, action) => {
      const updated = action.payload;
      const index = state.data.findIndex(a => a.enquiryId === updated.enquiryId);
      if (index !== -1) {
        state.data[index] = updated;
      }
    },
    deleteEnquiry: (state, action) => {
      state.data = state.data.filter(a => a.enquiryId !== action.payload);
    },
    clearEnquiry: (state) => {
      state.data = [];
    },
  },
});

export const {
  setEnquiries,
  addEnquiry,
  updateEnquiry,
  deleteEnquiry,
  clearEnquiry,
} = enquirySlice.actions;

export default enquirySlice.reducer;
