/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { useAppSelector } from "../state";
import { useFeatureFlags } from "@/core/hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";

import { createUIContext } from "@/core/context/UIContext";
import { Branch, Studio, User } from "@/api/types";
import { Setting } from "@/state/authSlice";

export interface AppUIContext {
    DEBUG: boolean;

    FEATURE_KEYS: typeof FEATURE_KEYS;

    user: User;
    currentBranch: Branch;
    token: string;
    studio: Studio;

    permissions: Setting;
    isAdmin: boolean;
    isMobile: boolean;
}

export const { UIProvider, useUI, UIContext } = createUIContext<Partial<AppUIContext>>();

export const useAppUI = (): AppUIContext => {
    const ui = useUI();

    if (
        !ui.user ||
        !ui.currentBranch ||
        !ui.token ||
        !ui.studio ||
        !ui.permissions ||
        !ui.FEATURE_KEYS
    ) {
        throw new Error("useAppUI must be used within AppUIProvider.");
    }

    return ui as AppUIContext;
};

export const NonAuthUIProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
    <UIProvider
        value={{
            DEBUG: import.meta.env.VITE_DEBUG === "true",
        }}
    >
        {children}
    </UIProvider>
);

export const AppUIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const studio = useAppSelector((state) => state.auth.studio);
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);
    const isReady = Boolean(user && currentBranch && token && studio);
    const permissions = useFeatureFlags(settings, user?.userAccessEntry);

    if (!isReady) {
        return null;
    }

    return (
        <UIProvider
            value={{
                DEBUG: import.meta.env.VITE_DEBUG === "true",

                FEATURE_KEYS,

                user: user!,
                currentBranch: currentBranch!,
                token: token!,
                studio: studio!,

                permissions,
                isAdmin: user!.role === "ADMIN",
            }}
        >
            {children}
        </UIProvider>
    );
};
