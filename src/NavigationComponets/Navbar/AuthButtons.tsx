import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { UserRound } from "lucide-react";
import { useAppDispatch } from "../../state";
import { openDialog } from "../../state/dialogSlice";

interface AuthButtonsProps {
    isNonMobileScreens: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isNonMobileScreens }) => {
    const dispatch = useAppDispatch();

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
                    sx={{ color: "white", padding: "0 0.5rem !important", m: "0.2rem" }}
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
                >
                    <UserRound />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default AuthButtons;
