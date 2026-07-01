import React from "react";
import { useAppSelector } from "../state";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";

import {
    createUIContext,
    UIContextType,
} from "@/core/context/UIContext";

export interface AppUIContext extends UIContextType {
    isBatchEnabled: boolean;
    isEnabled: (feature: string) => boolean;
    isAdmin: boolean;
    FEATURE_KEYS: Record<string, string>;
    DEBUG: boolean;
}

export const { UIProvider, useUI, UIContext } = createUIContext<AppUIContext>();

export const AppUIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const user = useAppSelector((state) => state.auth.user);

    const isAdmin = user?.role === "ADMIN";
    const DEBUG = import.meta.env.VITE_DEBUG === "true";

    const { isEnabled } = useFeatureFlags(settings, user?.userAccessEntry);
    const isBatchEnabled = isEnabled(FEATURE_KEYS.BATCH);

    return (
        <UIProvider
            value={{
                isBatchEnabled,
                isEnabled,
                isAdmin,
                FEATURE_KEYS,
                DEBUG,
            }}
        >
            {children}
        </UIProvider>
    );
};
