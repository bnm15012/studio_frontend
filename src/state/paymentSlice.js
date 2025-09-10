import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: {}, // { 1: [...], 2: [...] }
  totalPages: 0,
  isLoading: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentPage: (state, action) => {
      const { page, data, totalPages } = action.payload;
      state.pages[page] = data;
      state.totalPages = totalPages;
    },
    clearPaymentPages: (state) => {
      state.pages = {};
    },
  },
});

export const { setPaymentPage, setTotalCount, setPaymentLoading, clearPaymentPages } = paymentSlice.actions;

export default paymentSlice.reducer;
