import { styled, TableContainer, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[900],
    fontWeight: 700,
    fontSize: "1.1rem",
    borderBottom: `2px solid ${theme.palette.grey[300]}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "1rem",
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[100],
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
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.3)",
}));
