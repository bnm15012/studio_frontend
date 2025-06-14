import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: {}, // { 1: [...], 2: [...] }
  totalCount: 0,
  isLoading: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentPage: (state, action) => {
      const { page, payments, totalCount } = action.payload;
      state.pages[page] = payments;
      state.totalCount = totalCount;
    },
    clearPaymentPages: (state) => {
      state.pages = {};
    },
  },
});

export const { setPaymentPage, setTotalCount, setPaymentLoading, clearPaymentPages } = paymentSlice.actions;

export default paymentSlice.reducer;
