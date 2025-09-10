import { useMemo } from "react";

export function useFeatureFlags(settings) {
  const settingsMap = useMemo(
    () =>
      settings?.reduce((acc, { navBarName, enabled }) => {
        acc[navBarName] = enabled;
        return acc;
      }, {}) || {},
    [settings]
  );

  const isEnabled = (feature) => settingsMap[feature] ?? false;

  return { isEnabled, settingsMap };
}