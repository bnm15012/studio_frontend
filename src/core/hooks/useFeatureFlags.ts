import { useMemo } from "react";
import { Setting } from "@/state/authSlice";

export function useFeatureFlags(
    settings: Setting,
    userAccessEntry?: Record<string, string | null | undefined> | null,
) {
    const permissions = useMemo<Setting>(() => {
        const userKeys: Record<string, string> = {};

        Object.entries(userAccessEntry ?? {}).forEach(([key, value]) => {
            if (value) {
                userKeys[key.toUpperCase()] = value;
            }
        });

        const flags = {} as Setting;

        Object.entries(settings).forEach(([feature, enabled]) => {
            const userLevel = userKeys[feature] !== undefined ? userKeys[feature] === "FULL" : true;

            flags[feature as keyof Setting] = enabled && userLevel;
        });

        return flags;
    }, [settings, userAccessEntry]);

    return permissions;
}
