import { clientCruds, enquiryCruds, expenseCruds } from "../api/all.api";
import { clearMemberShipTypes } from "./activityMembershipTypeSlice";
import { clearActivities } from "./activitySlice";
import { clearAnalysisState } from "./analysisSlice";
import { clearAuthState } from "./authSlice";
import { clearBookingPages } from "./bookingSlice";
import { clearBranchState } from "./branchSlice";
import { clearAllDialogs } from "./dialogSlice";
import { clearPaymentPages } from "./paymentSlice";

export const logoutUser = () => (dispatch) => {
    dispatch(clearAuthState());
    dispatch(clearBranchState());
    dispatch(clearAllDialogs());
};

export const clearAllstate = () => (dispatch) => {
    dispatch(clearAllDialogs());
    dispatch(clientCruds.removeAll());
    dispatch(clearBookingPages());
    dispatch(clearActivities());
    dispatch(clearPaymentPages());
    dispatch(expenseCruds.removeAll());
    dispatch(clearAnalysisState());
    dispatch(clearMemberShipTypes());
    dispatch(enquiryCruds.removeAll());
};
