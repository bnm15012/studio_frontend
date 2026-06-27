import { activityCruds, membershipPackageCruds } from "../api/all.api";

/**
 * Loads data that is needed immediately after a branch is selected:
 *  - All activities for the current branch
 *  - All membership packages for the current studio
 */
export const loadInitialDataAPI = () => async (dispatch, getState) => {
    const { branch, auth } = getState();
    const branchId = branch.currentBranch?.branchId;
    const studioId = branch.currentBranch?.studioId;
    const token = auth.token;

    const noop = () => {};
    dispatch(activityCruds.getAll(noop, noop, token, { size: 500 }, branchId));
    dispatch(membershipPackageCruds.getAll(noop, noop, token, { size: 100 }, studioId));
};
