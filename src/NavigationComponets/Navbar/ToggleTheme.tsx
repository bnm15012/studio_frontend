import React from "react";
import { useAppSelector, useAppDispatch } from "../../state";
import { toggleMode } from "../../state/authSlice";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const ToggleTheme: React.FC = () => {
    const mode = useAppSelector((state: any) => state.auth.mode);
    const dispatch = useAppDispatch();

    return (
        <IconButton sx={{ color: "whitesmoke" }} onClick={() => dispatch(toggleMode())}>
            {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
    );
};

export default ToggleTheme;
