// utils/cacheManager.ts
import { ls, KEYS } from "@/core/utils/localStorageHelper";

/**
 * Call once on app boot (e.g. in main.tsx or App.tsx).
 * Clears all non-essential localStorage keys once per calendar day.
 * Auth tokens and UI preferences are preserved (see PRESERVED_KEYS).
 */
export const clearCacheIfNewDay = (): void => {
    const today = new Date().toDateString();
    const lastClear = ls.get(KEYS.LAST_CACHE_CLEAR, "");

    if (lastClear !== today) {
        ls.clearNonPreserved();
        ls.set(KEYS.LAST_CACHE_CLEAR, today);
    }
};
