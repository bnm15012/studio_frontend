import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: {}, // { 1: [...], 2: [...] }
  totalCount: 0,
  isLoading: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientPage: (state, action) => {
      const { page, clients, totalCount } = action.payload;
      state.pages[page] = clients;
      state.totalCount = totalCount;
    },
    clearClientPages: (state) => {
      state.pages = {};
    },
  },
});

export const { setClientPage, setTotalCount, setClientLoading, clearClientPages } = clientSlice.actions;

export default clientSlice.reducer;
