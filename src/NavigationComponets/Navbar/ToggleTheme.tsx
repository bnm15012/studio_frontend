import React from "react";
import { useAppSelector, useAppDispatch } from "@/state";
import { toggleMode } from "@/state/authSlice";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const ToggleTheme: React.FC = () => {
    const mode = useAppSelector((state) => state.auth.mode);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isDark = mode === "dark";

    return (
        <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
                onClick={() => dispatch(toggleMode())}
                sx={{
                    color: isDark ? theme.palette.text.primary : "whitesmoke",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "rotate(30deg)",
                    },
                }}
            >
                {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>
        </Tooltip>
    );
};

export default ToggleTheme;
