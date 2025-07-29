import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  studio: null,
  subscriptionPlan: null,
  // pricingPlans: null,
  settings: [],
};

export const authState = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const {
        user,
        studio,
        token,
        settings,
      } = action.payload;

      state.user = user || null;
      state.studio = studio || null;
      state.token = token ? `Bearer ${token}` : null;
      state.settings = settings || [];
      state.mode = "light";
    },
    setSettings: (state, action) => {
      state.settings = action.payload.settings || [];
    },
    setSubscriptionPlan: (state, action) => {
      state.subscriptionPlan = action.payload.subscriptionPlan || null;
    },
    // setPricingPlans: (state, action) => {
    //   state.pricingPlans = action.payload.pricingPlans || null;
    // },
    setStudio: (state, action) => {
      state.studio = action.payload.studio || null;
    },
    setToken: (state, action) => {
      state.token = action.payload.token ? `Bearer ${action.payload.token}` : null;
    },
    clearAuthState: () => initialState, // Clear all state on logout
  },
});

export const {
  toggleMode,
  setLogin,
  setToken,
  setSubscriptionPlan,
  setSettings,
  setStudio,
  // setPricingPlans,
  clearAuthState,
} = authState.actions;

export default authState.reducer;
