import React from "react";
import { useAppSelector } from "../state";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";

import { createUIContext } from "@/core/context/UIContext";
import { Branch, Studio, User } from "@/api/types";

export interface AppUIContext {
    user: User;
    currentBranch: Branch;
    token: string;
    studio: Studio;

    isBatchEnabled: boolean;
    isEnabled: (feature: string) => boolean;
    isAdmin: boolean;

    FEATURE_KEYS: Record<string, string>;
    DEBUG: boolean;
}

export const { UIProvider, useUI, UIContext } = createUIContext<AppUIContext>();

export const NonAuthUIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <UIProvider value={{} as AppUIContext}>{children}</UIProvider>;
};

export const AppUIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((s) => s.auth.token);
    const studio = useAppSelector((s) => s.auth.studio);
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);

    if (!user || !currentBranch || !token || !studio) {
        throw new Error(
            "AppUIProvider requires an authenticated user and currentBranch."
        );
    }
 
    const isAdmin = user.role === "ADMIN";
    const DEBUG = import.meta.env.VITE_DEBUG === "true";

    const { isEnabled } = useFeatureFlags(settings as unknown as Record<string, unknown>, user.userAccessEntry);
    const isBatchEnabled = isEnabled(FEATURE_KEYS.BATCH);

    return (
        <NonAuthUIProvider>
            <UIProvider
                value={{
                    user,
                    currentBranch,
                    isBatchEnabled,
                    isEnabled,
                    isAdmin,
                    FEATURE_KEYS,
                    DEBUG,
                    token,
                    studio,
                }}
            >
                {children}
            </UIProvider>
        </NonAuthUIProvider>
    );
};
