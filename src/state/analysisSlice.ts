import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalysisState {
    data: Record<string, any>;
}

const initialState: AnalysisState = {
    data: {},
};

const analysisSlice = createSlice({
    name: "analysis",
    initialState,
    reducers: {
        setAnalysisData(state, action: PayloadAction<Record<string, any>>) {
            state.data = action.payload;
        },
        clearAnalysisState: () => initialState,
    },
});

export const { setAnalysisData, clearAnalysisState } = analysisSlice.actions;

export default analysisSlice.reducer;
