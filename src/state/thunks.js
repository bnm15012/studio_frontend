import {
    branchCruds,
    clientCruds,
    enquiryCruds,
    expenseCruds,
    instructorsCruds,
    paymentCruds,
} from "../api/all.api";
import { clearMemberShipTypes } from "./activityMembershipTypeSlice";
import { clearActivities } from "./activitySlice";
import { clearAnalysisState } from "./analysisSlice";
import { clearAuthState } from "./authSlice";
import { clearBookingPages } from "./bookingSlice";
import { clearAllDialogs } from "./dialogSlice";

export const logoutUser = () => (dispatch) => {
    dispatch(clearAuthState());
    dispatch(branchCruds.removeAll());
    dispatch(clearAllDialogs());
};

export const clearAllstate = () => (dispatch) => {
    dispatch(clearAllDialogs());
    dispatch(clientCruds.removeAll());
    dispatch(clearBookingPages());
    dispatch(clearActivities());
    dispatch(paymentCruds.removeAll());
    dispatch(expenseCruds.removeAll());
    dispatch(clearAnalysisState());
    dispatch(clearMemberShipTypes());
    dispatch(instructorsCruds.removeAll());
    dispatch(enquiryCruds.removeAll());
};
