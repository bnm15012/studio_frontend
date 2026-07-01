import { useMediaQuery } from "@mui/material";
import React from "react";
import { useAppSelector } from "../state";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";
import { UIContext, useUI } from "../core/context/UIContext";

export { useUI };

export interface UIProviderProps {
    children: React.ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const user = useAppSelector((state) => state.auth.user);
    const isMobile = useMediaQuery("(max-width: 1000px)");
    const isAdmin = user?.role === "ADMIN";
    const DEBUG = import.meta.env.VITE_DEBUG === "true";

    const { isEnabled } = useFeatureFlags(settings, user?.userAccessEntry);
    const isBatchEnabled = isEnabled(FEATURE_KEYS.BATCH);

    return (
        <UIContext.Provider
            value={{ isMobile, isBatchEnabled, isEnabled, isAdmin, FEATURE_KEYS, DEBUG }}
        >
            {children}
        </UIContext.Provider>
    );
};
