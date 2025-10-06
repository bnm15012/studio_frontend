import { useMemo } from "react";

export function useFeatureFlags(settings, userAccessEntry) {
    const featureFlags = useMemo(() => {
        const userKeys = userAccessEntry
            ? Object.keys(userAccessEntry).reduce((acc, k) => {
                  acc[k.toUpperCase()] = userAccessEntry[k];
                  return acc;
              }, {})
            : {};

        const flags = {};
        Object.keys(settings).forEach((feature) => {
            const settingEnabled = settings[feature];

            const userLevel = userKeys[feature] ? userKeys[feature] === "FULL" : true;

            flags[feature] = settingEnabled && userLevel;
        });

        return flags;
    }, [settings, userAccessEntry]);

    const isEnabled = (feature) => featureFlags[feature] ?? false;

    return { isEnabled };
}
