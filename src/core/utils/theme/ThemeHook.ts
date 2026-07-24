import { useAppDispatch, useAppSelector } from "@/state";
import { toggleMode } from "@/state/authSlice";

/**
 * Returns the current theme mode and a toggle helper.
 *
 * @example
 * const { mode, isDark, toggle } = useThemeMode();
 */
export const useThemeMode = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.auth.mode);

    return {
        /** "light" | "dark" */
        mode,
        /** true when dark mode is active */
        isDark: mode === "dark",
        /** Dispatches toggleMode to Redux, which flips the mode. */
        toggle: () => dispatch(toggleMode()),
    };
};
