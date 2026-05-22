import { membershipPackageCruds } from "../api/all.api";
import { getAllActivitiesAPI } from "../Pages/Management/Activity/Activity.api";
import { setActivities } from "../state/activitySlice";

export const loadInitialDataAPI = () => async (dispatch, getState) => {
    const { branch, auth } = getState();
    const branchId = branch.currentBranch?.branchId;
    const studioId = branch.currentBranch?.studioId;

    const token = auth.token;
    const { success, data } = await getAllActivitiesAPI({ branchId, token });

    if (success) {
        dispatch(setActivities(data));
    }

    dispatch(
        membershipPackageCruds.getAll(
            (...args) => { },
            (...args) => { },
            token,
            { size: 100 },
            studioId,
        ),
    );
};
