// src/store/analysisSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {},
};

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        setAnalysisData(state, action) {
            state.data = action.payload;
        },
        clearAnalysisState: () => initialState,
    },
});

export const {
    setAnalysisData,
    clearAnalysisState
} = analysisSlice.actions;

export default analysisSlice.reducer;
