import { clearActivities } from "./activitySlice";
import { clearAnalysisState } from "./analysisSlice";
import { clearAuthState } from "./authSlice";
import { clearBookingPages } from "./bookingSlice";
import { clearBranchState } from "./branchSlice";
import { clearClientPages } from "./clientSlice";
import { clearAllDialogs } from "./dialogSlice";
import { clearExpensePages } from "./expenseSlice";
import { clearPaymentPages } from "./paymentSlice";

export const logoutUser = () => (dispatch) => {
    dispatch(clearAuthState());
    dispatch(clearBranchState());
    dispatch(clearAllDialogs());
};

export const clearAllstate = () => (dispatch) =>{
    dispatch(clearAllDialogs())
    dispatch(clearClientPages())
    dispatch(clearBookingPages())
    dispatch(clearActivities())
    dispatch(clearPaymentPages())
    dispatch(clearExpensePages())
    dispatch(clearAnalysisState())
}
