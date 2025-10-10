import { styled, Table, TableContainer, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: "1.1rem",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "1rem",
    },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
        backgroundColor: theme.palette.background.paper,
    },
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.alt,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    "&:hover": {
        backgroundColor: theme.palette.primary.light,
        transition: "background-color 0.3s ease",
    },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: "8px",
    overflowX: "auto",
    boxShadow: theme.shadows[7],
}));

export const StyledTable = styled(Table)(() => ({
    // tableLayout: "fixed",
}));
