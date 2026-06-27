import styled from "@emotion/styled";
import { Typography, Box } from "@mui/material";

export const FieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    paddingBottom: "16px",
    "&:last-child": {
        paddingBottom: 0,
    },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: theme.palette.text.disabled,
    lineHeight: 1.4,
}));

export const FieldValue = styled(Box)(({ theme }) => ({
    fontWeight: 500,
    fontSize: "0.925rem",
    color: theme.palette.text.primary,
    lineHeight: 1.55,
    wordBreak: "break-word",
}));
