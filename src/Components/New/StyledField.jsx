import styled from "@emotion/styled";
import { Typography, Box } from "@mui/material";

export const FieldContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 4,
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
    margin: theme.spacing("auto", 0),
    fontWeight: 500,
    minWidth: "40%",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
}));

export const FieldValue = styled(Typography)({
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#fff",
    wordBreak: "break-word",
});
