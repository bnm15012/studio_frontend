import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  studio: null,
  subscriptionPlan: null,
  settings: [],
  currentBranch: null,
  branches: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { user, token, studio, settings } = action.payload;
      state.user = user;
      state.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      state.studio = studio;
      state.settings = settings || [];
      if (studio?.branchList?.length > 0) {
        state.branches = studio.branchList;
        state.currentBranch = studio.branchList.find((b) => b.isActive) || studio.branchList[0];
      }
    },
    setToken: (state, action) => {
      const { token } = action.payload;
      state.token = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    },
    setStudio: (state, action) => {
      state.studio = action.payload.studio;
    },
    setSettings: (state, action) => {
      state.settings = action.payload.settings;
    },
    setSubscriptionPlan: (state, action) => {
      state.subscriptionPlan = action.payload.subscriptionPlan;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.studio = null;
      state.subscriptionPlan = null;
      state.settings = [];
      state.currentBranch = null;
      state.branches = [];
    },
  },
});

export const {
  setLogin,
  setToken,
  setStudio,
  setSettings,
  setSubscriptionPlan,
  setCurrentBranch,
  setBranches,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
