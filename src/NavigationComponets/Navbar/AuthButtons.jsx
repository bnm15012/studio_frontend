import { Button, IconButton, Tooltip } from "@mui/material";
import { UserRound } from "lucide-react";
// import { useState } from "react";
import { useDispatch } from "react-redux";
import { openDialog } from "../../state/dialogSlice";
import PropTypes from "prop-types";

const AuthButtons = ({ isNonMobileScreens }) => {
    const dispatch = useDispatch();
    // const [anchorEl, setAnchorEl] = useState(null);

    // const handleOpen = (e) => setAnchorEl(e.currentTarget);
    // const handleClose = () => setAnchorEl(null);

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
                    // onClick={handleOpen}
                >
                    <UserRound />
                </IconButton>
            </Tooltip>

            {/* <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ color: "#fff", borderRadius: 2, mt: 1 }}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        dispatch(openDialog("loginDialog"));
                    }}
                >
                    Log In
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        dispatch(openDialog("signupDialog"));
                        handleClose();
                    }}
                >
                    Register
                </MenuItem>
            </Menu> */}
        </>
    );
};

AuthButtons.propTypes = {
    isNonMobileScreens: PropTypes.bool.isRequired,
};

export default AuthButtons;
