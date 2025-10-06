import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pages: {}, // { 1: [...], 2: [...] }
    totalCount: 0,
    isLoading: false,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingPage: (state, action) => {
            const { page, bookings, totalCount } = action.payload;
            state.pages[page] = bookings;
            state.totalCount = totalCount;
        },
        clearBookingPages: (state) => {
            state.pages = {};
        },
    },
});

export const { setBookingPage, setTotalCount, setBookingLoading, clearBookingPages } =
    bookingSlice.actions;

export default bookingSlice.reducer;
