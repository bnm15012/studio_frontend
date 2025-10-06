import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const membershipTypesSlice = createSlice({
    name: "membershipTypes",
    initialState,
    reducers: {
        setMemberShipTypes: (state, action) => {
            state.data = action.payload.data || [];
        },
        addMemberShipTypes: (state, action) => {
            state.data.push(action.payload);
        },
        updateMemberShipTypes: (state, action) => {
            const updated = action.payload;
            const index = state.data.findIndex(
                (a) => a.activityMembershipTypeId === updated.activityMembershipTypeId,
            );
            if (index !== -1) {
                state.data[index] = updated;
            }
        },
        deleteMemberShipTypes: (state, action) => {
            state.data = state.data.filter((a) => a.activityMembershipTypeId !== action.payload);
        },
        clearMemberShipTypes: (state) => {
            state.data = [];
        },
    },
});

export const {
    setMemberShipTypes,
    addMemberShipTypes,
    updateMemberShipTypes,
    deleteMemberShipTypes,
    clearMemberShipTypes,
} = membershipTypesSlice.actions;

export default membershipTypesSlice.reducer;
