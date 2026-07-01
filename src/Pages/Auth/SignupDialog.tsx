import Form from "./Form";
import { useMediaQuery, Dialog, Box, IconButton } from "@mui/material";
import WidgetWrapper from "@/core/components/layout/WidgetWrapper";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeLastDialog, isDialogOnTop } from "../../state/dialogSlice";
import { useAppSelector } from "@/state";

const SignupDialog = () => {
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width: 650px)");

    return (
        <Dialog open={useAppSelector(isDialogOnTop("signupDialog"))}>
            <WidgetWrapper width={isNonMobileScreens ? "30rem" : "80vw"} p="1rem" m={"0rem auto"}>
                <FlexBetween>
                    <Box flexGrow={1}></Box>
                    <IconButton
                        onClick={() => {
                            dispatch(closeLastDialog());
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </FlexBetween>
                <Form pageType="Register" />
            </WidgetWrapper>
        </Dialog>
    );
};

export default SignupDialog;
