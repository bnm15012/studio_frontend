import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const FieldContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    paddingBottom: "16px",

    "&:last-child": {
        paddingBottom: 0,
    },
});

export const FieldLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: theme.palette.text.disabled,
    lineHeight: 1.4,
    animation: `${fadeIn} 0.3s ease-out`,
}));

export const FieldValue = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: "0.925rem",
    color: theme.palette.text.primary,
    lineHeight: 1.55,
    wordBreak: "break-word",
    animation: `${fadeIn} 0.3s ease-out`,
}));
