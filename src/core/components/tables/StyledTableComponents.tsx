import { styled, Table, TableContainer, TableRow, alpha } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: "0.825rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        borderBottom: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(2, 2.5),
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: "0.95rem",
        color: theme.palette.text.primary,
        padding: theme.spacing(2, 2.5),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
        backgroundColor: theme.palette.background.paper,
    },
    "&:nth-of-type(odd)": {
        backgroundColor: (theme.palette.background as any).odd || theme.palette.background.default,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    backgroundColor: theme.palette.background.paper,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        backgroundColor: theme.palette.action.hover || alpha(theme.palette.primary.main, 0.02),
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        zIndex: 1,
    },
    "&.Mui-selected": {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
        "&:hover": {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
        },
    },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: "16px",
    overflowX: "auto",
    overflowY: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
    WebkitOverflowScrolling: "touch",
}));

export const StyledTable = styled(Table)(() => ({
    minWidth: 500,
    borderCollapse: "separate",
    borderSpacing: 0,
}));
