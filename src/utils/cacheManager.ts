// utils/cacheManager.ts
export const clearCacheIfNewDay = (): void => {
    const lastClearDate = localStorage.getItem("lastCacheClearDate");
    const today = new Date().toDateString();

    if (lastClearDate !== today) {
        const preservedKeys = ["token", "user"]; // Add any keys you don't want to delete

        // Save preserved values
        const preservedData: Record<string, string | null> = {};
        preservedKeys.forEach((key) => {
            preservedData[key] = localStorage.getItem(key);
        });

        localStorage.clear();

        // Restore preserved values
        Object.entries(preservedData).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
        });

        // Update last clear date
        localStorage.setItem("lastCacheClearDate", today);
    }
};
