import { activityCruds, membershipPackageCruds } from "../api/all.api";
import { AppDispatch, RootState } from "../state";

/**
 * Loads data that is needed immediately after a branch is selected:
 *  - All activities for the current branch
 *  - All membership packages for the current studio
 */
export const loadInitialDataAPI = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { auth } = state;
    const currentBranch = state.branch.currentBranch!;
    const branchId = currentBranch.branchId;
    const studioId = currentBranch.studioId;
    const token = auth.token;

    const noop = () => { };
    dispatch(activityCruds.getAll(noop, noop, token, { size: 500 }, branchId));
    dispatch(membershipPackageCruds.getAll(noop, noop, token, { size: 100 }, studioId));
};
