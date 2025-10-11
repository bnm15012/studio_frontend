import { Box, Button } from '@mui/material'
import { useDispatch } from 'react-redux';
import PropTypes from "prop-types";
import { openDialog } from '../../state/dialogSlice';

const AuthButtons = ({ isNonMobileScreens }) => {
    const dispatch = useDispatch();
    return (
        <Box display="flex" gap={2} width={isNonMobileScreens ? "auto" : "100%"} mt={isNonMobileScreens ? 0 : 2}>
            <Button
                variant="contained"
                color="primary" sx={{
                    m: "0.2rem",
                    padding: "0 0.5rem !important",
                    textWrap: "nowrap",
                }}
                fullWidth={!isNonMobileScreens}
                onClick={() => dispatch(openDialog("signupDialog"))}
            >
                Register
            </Button>
            <Button
                variant="contained"
                sx={{
                    color: "white",
                    textWrap: "nowrap",
                    m: "0.2rem",
                    padding: "0 0.5rem !important",
                }}
                color="white"
                fullWidth={!isNonMobileScreens}
                onClick={() => dispatch(openDialog("loginDialog"))}
            >
                Log In
            </Button>
        </Box>
    )
}

AuthButtons.propTypes = {
    isNonMobileScreens: PropTypes.bool.isRequired,
};

export default AuthButtons