import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { openDialog } from "../../state/dialogSlice";

const AuthButtons = ({ isNonMobileScreens }) => {
    const dispatch = useDispatch();
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                sx={{
                    m: "0.2rem",
                    padding: isNonMobileScreens ? "0 0.5rem !important" : "",
                    textWrap: "nowrap",
                }}
                fullWidth={!isNonMobileScreens}
                onClick={() => dispatch(openDialog("signupDialog"))}
            >
                Register
            </Button>
            <Button
                variant="outlined"
                sx={{
                    color: "white",
                    textWrap: "nowrap",
                    m: "0.2rem",
                    padding: isNonMobileScreens ? "0 0.5rem !important" : "",
                }}
                color="white"
                fullWidth={!isNonMobileScreens}
                onClick={() => dispatch(openDialog("loginDialog"))}
            >
                Log In
            </Button>
        </>
    );
};

AuthButtons.propTypes = {
    isNonMobileScreens: PropTypes.bool.isRequired,
};

export default AuthButtons;
