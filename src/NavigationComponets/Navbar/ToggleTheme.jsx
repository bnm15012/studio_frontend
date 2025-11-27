import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../../state/authSlice";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const ToggleTheme = () => {
    const mode = useSelector((state) => state.auth.mode);
    const dispatch = useDispatch();

    return (
        <IconButton onClick={() => dispatch(toggleMode())}>
            {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
    );
};

export default ToggleTheme;
