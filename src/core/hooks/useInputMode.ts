/** useInputMode — detects pointer type (mouse vs touch) on first load and stores in localStorage.
 * Manual override via setInputMode() persists across page reloads.
 * "auto" = system-detected, "touch" = forced touch, "mouse" = forced mouse.
 */
import { KEYS, usePref } from "../utils/localStorageHelper";

export type InputMode = "auto" | "touch" | "mouse";

function detectTouchCapability(): boolean {
    if (typeof window === "undefined") return false;
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer && !hasCoarsePointer) return false;
    if (hasCoarsePointer) return true;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function useInputMode() {
    const [inputMode, setInputModeState] = usePref<InputMode>(KEYS.INPUT_MODE, "mouse");

    const isTouchMode: boolean =
        inputMode === "touch" ? true : inputMode === "mouse" ? false : detectTouchCapability();

    return { inputMode, isTouchMode, setInputMode: setInputModeState };
}
