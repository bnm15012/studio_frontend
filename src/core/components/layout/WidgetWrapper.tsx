import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const WidgetWrapper = styled(Box)(({ theme }) => ({
    padding: "1.5rem 1.5rem 1.5rem 1.5rem",
    backgroundColor: (theme.palette.background as { alt: string }).alt,
    borderRadius: "0.75rem",
    transition: "height 10s",
}));

export default WidgetWrapper;
