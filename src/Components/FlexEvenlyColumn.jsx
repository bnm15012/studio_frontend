import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexEvenlyColumn = styled(Box)({
  display: "flex",
  justifyContent: "space-evenly",
  position:"relative",
  flexDirection: "column",
  height:"100%"
});

export default FlexEvenlyColumn;
