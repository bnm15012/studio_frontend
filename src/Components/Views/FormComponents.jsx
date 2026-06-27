import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(min(13em, 100%), 1fr))",

    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(2),
        gridTemplateColumns: "1fr",
    },
}));


export const StyledFieldItem = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),

    padding: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: theme.palette.action.hover,
    transition: "background-color 0.2s ease",

    "&:hover": {
        backgroundColor: `${theme.palette.primary.main}08`,
    },

    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(0.25),
    },
}));
