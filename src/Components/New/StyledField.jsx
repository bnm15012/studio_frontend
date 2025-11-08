import styled from "@emotion/styled";
import { Typography, Box } from "@mui/material";

export const FieldContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 4,
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
    margin: theme.spacing("auto", 0),
    height: "3rem",
    fontWeight: "bolder",
    textWrap: "nowrap",
    lineHeight: "3rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
}));

export const FieldValue = styled(Box)(({ theme }) => ({
    margin: theme.spacing("auto", 0),
    fontWeight: 500,
    lineHeight: "3rem",
    width: "100%",
    height: "3rem",
    wordBreak: "break-word",
}));
