import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(22em, 1fr))",

    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(3),
        gridTemplateColumns: "1fr",
    },
}));

export const StyledFieldItem = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(0),
        flexDirection: "column",
    },
}));
