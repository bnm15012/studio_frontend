import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: {}, // { 1: [...], 2: [...] }
  totalPages: 0,
  isLoading: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientPage: (state, action) => {
      const { page, data, totalPages } = action.payload;
      state.pages[page] = data;
      state.totalPages = totalPages;
    },
    addClient: (state, action) => {
      state.pages[1].push(action.payload);
    },
    clearClientPages: (state) => {
      state.pages = {};
    },
  },
});

export const { setClientPage, setTotalCount, setClientLoading, addClient, clearClientPages } = clientSlice.actions;

export default clientSlice.reducer;
