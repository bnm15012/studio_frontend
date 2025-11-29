import styled from "@emotion/styled";
import { Typography, Box } from "@mui/material";

export const FieldContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 4,
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
    margin: theme.spacing("auto", 0),
    fontWeight: "bolder",
    lineHeight: "3rem",
    color: theme.palette.primary.main,
    textWrap: "nowrap",
    height: "2rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    [theme.breakpoints.down("sm")]: {
        height: "2.2rem",
    },
}));

export const FieldValue = styled(Box)(({ theme }) => ({
    // margin: theme.spacing("auto", 0),
    fontWeight: 500,
    lineHeight: "3rem",
    width: "100%",
    height: "2rem",
    wordBreak: "break-word",
    [theme.breakpoints.down("sm")]: {
        height: "2.2rem",
    },
}));
