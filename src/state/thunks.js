import {
    bookingCruds,
    branchCruds,
    clientCruds,
    enquiryCruds,
    expenseCruds,
    instructorsCruds,
    membershipPackageCruds,
    paymentCruds,
} from "../api/all.api";
import { clearActivities } from "./activitySlice";
import { clearAnalysisState } from "./analysisSlice";
import { clearAuthState } from "./authSlice";
import { clearAllDialogs } from "./dialogSlice";

/**
 * Logs the user out and clears auth + branch state.
 * Call this on explicit logout — does NOT clear branch-scoped data
 * (use `clearAllstate` after switching branches or for a full reset).
 */
export const logoutUser = () => (dispatch) => {
    dispatch(clearAuthState());
    dispatch(branchCruds.removeAll());
    dispatch(clearAllDialogs());
};

/**
 * Clears all branch-scoped data from the store.
 * Intended for branch-switching or for a complete app reset.
 *
 * NOTE: Does NOT clear users, students assignments, or instructors assignments —
 * those are global/settings-level slices that survive branch changes.
 */
export const clearAllstate = () => (dispatch) => {
    dispatch(clearAllDialogs());
    dispatch(clearActivities());
    dispatch(clearAnalysisState());
    dispatch(clientCruds.removeAll());
    dispatch(bookingCruds.removeAll());
    dispatch(paymentCruds.removeAll());
    dispatch(expenseCruds.removeAll());
    dispatch(membershipPackageCruds.removeAll());
    dispatch(instructorsCruds.removeAll());
    dispatch(enquiryCruds.removeAll());
};
