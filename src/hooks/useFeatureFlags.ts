import { Setting } from "@/state/authSlice";
import { useMemo } from "react";

export function useFeatureFlags(
    settings: Setting,
    userAccessEntry?: Record<string, string | null | undefined> | null,
) {
    const featureFlags = useMemo(() => {
        const userKeys: Record<string, string> = userAccessEntry
            ? Object.keys(userAccessEntry).reduce((acc: Record<string, string>, k) => {
                  const val = userAccessEntry[k];
                  if (val) {
                      acc[k.toUpperCase()] = val;
                  }
                  return acc;
              }, {})
            : {};
        const flags: Record<string, boolean> = {};
        Object.keys(settings).forEach((feature) => {
            const settingEnabled = settings[feature];
            const userLevel = userKeys[feature] ? userKeys[feature] === "FULL" : true;
            flags[feature] = !!(settingEnabled && userLevel);
        });

        return flags;
    }, [settings, userAccessEntry]);

    const isEnabled = (feature: string): boolean => featureFlags[feature] ?? false;

    return { isEnabled };
}
