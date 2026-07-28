import React from "react";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { UserRound } from "lucide-react";
import { useAppDispatch } from "@/state";
import { openDialog } from "@/state/dialogSlice";

interface AuthButtonsProps {
    isNonMobileScreens: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isNonMobileScreens }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (isNonMobileScreens) {
        return (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: "0 0.5rem !important", m: "0.2rem" }}
                    onClick={() => dispatch(openDialog("signupDialog"))}
                >
                    Register
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        color: isDark ? theme.palette.text.primary : "white",
                        borderColor: isDark
                            ? theme.palette.text.secondary
                            : "rgba(255, 255, 255, 0.5)",
                        padding: "0 0.5rem !important",
                        m: "0.2rem",
                        "&:hover": {
                            borderColor: isDark ? theme.palette.text.primary : "white",
                        },
                    }}
                    onClick={() => dispatch(openDialog("loginDialog"))}
                >
                    Log In
                </Button>
            </>
        );
    }

    return (
        <>
            <Tooltip title="Sign In">
                <IconButton
                    color="inherit"
                    onClick={() => dispatch(openDialog("loginDialog"))}
                    sx={{
                        color: isDark ? theme.palette.text.primary : "inherit",
                    }}
                >
                    <UserRound />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default AuthButtons;
