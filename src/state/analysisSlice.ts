import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalysisReportResult } from "@/Pages/Analysis/analysis.api";

export interface AnalysisState {
    data: Partial<AnalysisReportResult>;
}

const initialState: AnalysisState = {
    data: {},
};

const analysisSlice = createSlice({
    name: "analysis",
    initialState,
    reducers: {
        setAnalysisData(state, action: PayloadAction<Partial<AnalysisReportResult>>) {
            return { ...state, data: action.payload };
        },
        clearAnalysisState: () => initialState,
    },
});

export const { setAnalysisData, clearAnalysisState } = analysisSlice.actions;

export default analysisSlice.reducer;
