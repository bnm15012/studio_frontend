// src/store/branchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentBranch: null,
    branches: [],
    selectedBranch: null,
};

const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        setCurrentBranch(state, action) {
            state.currentBranch = action.payload;
        },
        setBranches(state, action) {
            state.branches = action.payload;
        },
        setSelectedBranch(state, action) {
            state.selectedBranch = action.payload;
        },
        addBranch(state, action) {
            state.branches.push(action.payload);
        },
        updateBranch(state, action) {
            const updatedBranch = action.payload;
            const index = state.branches.findIndex(
                (branch) => branch.branchId === updatedBranch.branchId,
            );
            if (index !== -1) {
                state.branches[index] = updatedBranch;
            }
        },
        deleteBranch(state, action) {
            const branchId = action.payload;
            state.branches = state.branches.filter((branch) => branch.branchId !== branchId);
        },
        clearBranchState(state) {
            state.currentBranch = null;
            state.branches = [];
            state.selectedBranch = null;
        },
    },
});

export const {
    setCurrentBranch,
    setBranches,
    setSelectedBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    clearBranchState,
} = branchSlice.actions;

export default branchSlice.reducer;
