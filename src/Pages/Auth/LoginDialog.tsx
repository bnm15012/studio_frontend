import Form from "./Form";
import { Dialog, Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import WidgetWrapper from "@/core/components/layout/WidgetWrapper";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@/state";
import { closeLastDialog, isDialogOnTop } from "../../state/dialogSlice";
import { useAppSelector } from "@/state";

const LoginDialog = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 650px)");

    return (
        <Dialog open={useAppSelector(isDialogOnTop("loginDialog"))} maxWidth="sm">
            <WidgetWrapper
                sx={{ backgroundColor: theme.palette.background.default }}
                width={isNonMobileScreens ? "30rem" : "80vw"}
                p="1rem"
                m={"0rem auto"}
            >
                <FlexBetween>
                    <Box flexGrow={1}></Box>
                    <IconButton onClick={() => dispatch(closeLastDialog())}>
                        <CloseIcon />
                    </IconButton>
                </FlexBetween>
                <Form pageType="Login" />
            </WidgetWrapper>
        </Dialog>
    );
};

export default LoginDialog;
