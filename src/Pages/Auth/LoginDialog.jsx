import Form from "./Form";
import {
  Dialog,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WidgetWrapper from "../../Components/WidgetWrapper";
import FlexBetween from "../../Components/FlexBetween";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { closeLastDialog, isDialogOnTop } from "../../state/dialogSlice";

const LoginDialog = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 650px)");

  return (
    <Dialog open={useSelector(isDialogOnTop("loginDialog"))} maxWidth="sm">
      <WidgetWrapper sx={{ backgroundColor: theme.palette.background.default }} width={isNonMobileScreens ? "30rem" : "80vw"} p="1rem" m={"0rem auto"}>
        <FlexBetween>
          <Box flexGrow={1}></Box>
          <IconButton
            onClick={() => dispatch(closeLastDialog())}
          >
            <Close />
          </IconButton>
        </FlexBetween>
        <Form pageType="Login" />
      </WidgetWrapper>
    </Dialog>
  );
};

export default LoginDialog;
