import {
    activityMembershipTypeCruds,
    bookingCruds,
    branchCruds,
    clientCruds,
    enquiryCruds,
    expenseCruds,
    instructorsCruds,
    paymentCruds,
} from "../api/all.api";
import { clearActivities } from "./activitySlice";
import { clearAnalysisState } from "./analysisSlice";
import { clearAuthState } from "./authSlice";
import { clearAllDialogs } from "./dialogSlice";

export const logoutUser = () => (dispatch) => {
    dispatch(clearAuthState());
    dispatch(branchCruds.removeAll());
    dispatch(clearAllDialogs());
};

export const clearAllstate = () => (dispatch) => {
    dispatch(clearAllDialogs());
    dispatch(clearActivities());
    dispatch(clearAnalysisState());
    dispatch(clientCruds.removeAll());
    dispatch(bookingCruds.removeAll());
    dispatch(paymentCruds.removeAll());
    dispatch(expenseCruds.removeAll());
    dispatch(activityMembershipTypeCruds.removeAll());
    dispatch(instructorsCruds.removeAll());
    dispatch(enquiryCruds.removeAll());
};
