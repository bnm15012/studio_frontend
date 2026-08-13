import {
    activityCruds,
    bookingCruds,
    branchCruds,
    clientCruds,
    enquiryCruds,
    expenseCruds,
    instructorsCruds,
    membershipPackageCruds,
    paymentCruds,
} from "@/api/all.api";
import { clearAnalysisState } from "@/state/analysisSlice";
import { clearAuthState, setAuthLoading } from "@/state/authSlice";
import { clearAllDialogs } from "@/state/dialogSlice";
import { AppDispatch } from "@/state/index";

/**
 * Logs the user out and clears auth + branch state.
 * Call this on explicit logout — does NOT clear branch-scoped data
 * (use `clearAllstate` after switching branches or for a full reset).
 */
export const logoutUser = () => (dispatch: AppDispatch) => {
    dispatch(setAuthLoading({ loading: true }));
    dispatch(clearAuthState());
    dispatch(branchCruds.removeAll());
    dispatch(clearAllDialogs());

    setTimeout(() => {
        dispatch(setAuthLoading({ loading: false }));
    }, 600);
};

/**
 * Clears all branch-scoped data from the store.
 * Intended for branch-switching or for a complete app reset.
 *
 * NOTE: Does NOT clear users, students assignments, or instructors assignments —
 * those are global/settings-level slices that survive branch changes.
 */
export const clearAllstate = () => (dispatch: AppDispatch) => {
    dispatch(clearAllDialogs());
    dispatch(activityCruds.removeAll());
    dispatch(clearAnalysisState());
    dispatch(clientCruds.removeAll());
    dispatch(bookingCruds.removeAll());
    dispatch(paymentCruds.removeAll());
    dispatch(expenseCruds.removeAll());
    dispatch(membershipPackageCruds.removeAll());
    dispatch(instructorsCruds.removeAll());
    dispatch(enquiryCruds.removeAll());
};
