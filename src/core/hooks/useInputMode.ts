/** useInputMode — detects pointer type (mouse vs touch) on first load and stores in localStorage.
 * Manual override via setInputMode() persists across page reloads.
 * "auto" = system-detected, "touch" = forced touch, "mouse" = forced mouse.
 */
import { useCallback, useEffect, useState } from "react";

export type InputMode = "auto" | "touch" | "mouse";

const STORAGE_KEY = "studio_input_mode";

function detectTouchCapability(): boolean {
    if (typeof window === "undefined") return false;
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer && !hasCoarsePointer) return false;
    if (hasCoarsePointer) return true;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function readStored(): InputMode {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === "touch" || raw === "mouse" || raw === "auto") return raw;
    } catch {
        /* ignore */
    }
    return "auto";
}

function writeStored(mode: InputMode) {
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch {
        /* ignore */
    }
}

export function useInputMode() {
    const [inputMode, setInputModeState] = useState<InputMode>(readStored);

    useEffect(() => {
        if (inputMode === "auto") {
            writeStored("auto");
            return;
        }
    }, [inputMode]);

    const setInputMode = useCallback((mode: InputMode) => {
        setInputModeState(mode);
        writeStored(mode);
        window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: mode }));
    }, []);

    const isTouchMode: boolean =
        inputMode === "touch" ? true : inputMode === "mouse" ? false : detectTouchCapability();

    return { inputMode, isTouchMode, setInputMode };
}
