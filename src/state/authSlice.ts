import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Studio, SubscriptionPlan } from "@/api/types";

export interface Setting {
    [key: string]: boolean;
}

export interface AuthState {
    mode: "light" | "dark";
    user: User | null;
    token: string | null;
    studio: Studio | null;
    subscriptionPlan: SubscriptionPlan | null;
    settings: Setting;
}

const initialState: AuthState = {
    mode: "light",
    user: null,
    token: null,
    studio: null,
    subscriptionPlan: null,
    settings: {},
};

export const authState = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (
            state,
            action: PayloadAction<{
                user: User | null;
                studio: Studio | null;
                token: string | null;
                settings?: Setting;
            }>,
        ) => {
            const { user, studio, token, settings } = action.payload;

            state.user = user || null;
            state.studio = studio || null;
            state.token = token ? `Bearer ${token}` : null;
            state.settings = settings || {};
            state.mode = "light";
        },
        setSettings: (state, action: PayloadAction<{ settings?: Setting }>) => {
            state.settings = action.payload.settings || {};
        },
        setSubscriptionPlan: (
            state,
            action: PayloadAction<{ subscriptionPlan: SubscriptionPlan | null }>,
        ) => {
            state.subscriptionPlan = action.payload.subscriptionPlan || null;
        },
        setStudio: (state, action: PayloadAction<{ studio: Studio | null }>) => {
            state.studio = action.payload.studio || null;
        },
        setToken: (state, action: PayloadAction<{ token: string | null }>) => {
            state.token = action.payload.token ? `Bearer ${action.payload.token}` : null;
        },
        clearAuthState: () => initialState,
    },
});

export const {
    toggleMode,
    setLogin,
    setToken,
    setSubscriptionPlan,
    setSettings,
    setStudio,
    clearAuthState,
} = authState.actions;

export default authState.reducer;
