import styled from "@emotion/styled";
import { Typography, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export const FieldContainer = styled(Box)(({ theme }: { theme?: Theme }) => ({
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "6px",
    paddingBottom: "16px",
    "&:last-child": {
        paddingBottom: 0,
    },
}));

export const FieldLabel = styled(Typography)(({ theme }: { theme?: Theme }) => ({
    fontWeight: 600,
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    color: theme?.palette?.text?.disabled,
    lineHeight: 1.4,
}));

export const FieldValue = styled(Box)(({ theme }: { theme?: Theme }) => ({
    fontWeight: 500,
    fontSize: "0.925rem",
    color: theme?.palette?.text?.primary,
    lineHeight: 1.55,
    wordBreak: "break-word" as const,
}));
