// Components/CustomTable/index.jsx
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import PropTypes from "prop-types";

const CustomTable = ({ rows, columns, renderCell }) => {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow hover key={row.branchId || rowIndex}>
                            {columns.map((col) => (
                                <TableCell key={col.id}>
                                    {renderCell ? renderCell(row, col.id) : row[col.id]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
CustomTable.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            minWidth: PropTypes.number,
        })
    ).isRequired,
    renderCell: PropTypes.func,
};

export default CustomTable;
