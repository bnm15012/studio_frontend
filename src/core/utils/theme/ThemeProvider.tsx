/**
 * theme.tsx — Central theme entry point.
 *
 * Re-exports everything from theme.ts and adds:
 *  - `ThemeContextProvider`  — wraps MUI ThemeProvider + CssBaseline, reads
 *                              mode from Redux `auth.mode`.
 *  - `useThemeMode`          — hook that returns { mode, isDark, toggle }.
 *  - `ThemeToggleButton`     — plug-and-play icon button that switches modes.
 *
 * Usage (replacing the manual ThemeProvider wiring in App.tsx):
 *
 *   import { ThemeContextProvider } from "@/core/utils/theme";
 *
 *   <ThemeContextProvider>
 *     <YourApp />
 *   </ThemeContextProvider>
 *
 * Or keep App.tsx as-is and only import the hook / button where needed.
 */

import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider, Tooltip, IconButton } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useAppSelector } from "@/state";
import { themeSettings } from "./theme";
import { useThemeMode } from "./ThemeHook";

/**
 * Drop-in replacement for the manual ThemeProvider + CssBaseline wiring.
 * Reads `auth.mode` from Redux and keeps the MUI theme in sync automatically.
 *
 * @example
 * // In App.tsx:
 * <ThemeContextProvider>
 *   <Router>…</Router>
 * </ThemeContextProvider>
 */
export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const mode = useAppSelector((state) => state.auth.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

// ─── Toggle Button ─────────────────────────────────────────────────────────────

export interface ThemeToggleButtonProps {
    /** MUI IconButton size. Defaults to "medium". */
    size?: "small" | "medium" | "large";
    /** Tooltip placement. Defaults to "bottom". */
    tooltipPlacement?:
        | "bottom"
        | "bottom-end"
        | "bottom-start"
        | "left"
        | "left-end"
        | "left-start"
        | "right"
        | "right-end"
        | "right-start"
        | "top"
        | "top-end"
        | "top-start";
}

/**
 * Plug-and-play toggle button that switches between light and dark mode.
 * Dispatches `toggleMode` to Redux on click.
 *
 * @example
 * // In Navbar.tsx:
 * import { ThemeToggleButton } from "@/core/utils/theme";
 * <ThemeToggleButton />
 */
export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
    size = "medium",
    tooltipPlacement = "bottom",
}) => {
    const { isDark, toggle } = useThemeMode();

    return (
        <Tooltip
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            placement={tooltipPlacement}
        >
            <IconButton onClick={toggle} size={size} aria-label="toggle theme">
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};
