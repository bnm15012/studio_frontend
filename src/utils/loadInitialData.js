import { getAllActivitiesAPI } from "../Pages/Management/Activity/Activity.api";
import { setActivities } from "../state/activitySlice";

export const loadInitialDataAPI = () => async (dispatch, getState) => {
    const { branch, auth } = getState();
    const branchId = branch.currentBranch?.branchId;
    const token = auth.token;
    const { success, data } = await getAllActivitiesAPI({ branchId, token });

    if (success) {
        dispatch(setActivities(data));
    }
};
