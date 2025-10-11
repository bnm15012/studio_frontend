import { TableBody, TableHead, Paper, IconButton, TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../StyledTableComponents";
import Field from "../Fields/Field";
import PropTypes from "prop-types";
const ListView = ({
    fields,
    data,
    editingId,
    fieldsMeta,
    handleChange,
    handleSave,
    handleCancel,
    handleEdit,
    setDeleteDialogOpen,
    setDeleteId,
    tableState,
    handlePageChange,
}) => (
    <StyledTableContainer component={Paper}>
        <StyledTable>
            <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        S. No.
                    </StyledTableCell>
                    {fields
                        .filter((f) => f.show)
                        .map(({ label }) => (
                            <StyledTableCell
                                key={label}
                                sx={{ fontWeight: "bold", color: "#1976d2" }}
                            >
                                {label}
                            </StyledTableCell>
                        ))}
                    <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Actions
                    </StyledTableCell>
                </StyledTableRow>
            </TableHead>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <StyledTableRow key={rowIndex}>
                        <StyledTableCell>
                            {(parseInt(tableState.currentPage) - 1) * tableState.pageSize +
                                rowIndex +
                                1}
                        </StyledTableCell>
                        {fields
                            .filter((f) => f.show !== false)
                            .map((field) => (
                                <StyledTableCell key={field.name}>
                                    <Field
                                        isEdit={editingId === row[fieldsMeta.primary]}
                                        value={
                                            field?.getValue
                                                ? field.getValue(row[field.name])
                                                : row[field.name]
                                        }
                                        setValue={(v) =>
                                            handleChange(v, row[fieldsMeta.primary], field.name)
                                        }
                                        type={field.type}
                                        extraProp={field.extraProp}
                                    />
                                </StyledTableCell>
                            ))}
                        <StyledTableCell>
                            {editingId === row[fieldsMeta.primary] ? (
                                <>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleSave(row[fieldsMeta.primary])}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                                        <CancelIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleEdit(row[fieldsMeta.primary])}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        sx={{ color: "red" }}
                                        onClick={() => {
                                            setDeleteDialogOpen(true);
                                            setDeleteId(row[fieldsMeta.primary]);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )}
                        </StyledTableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
        </StyledTable>
        <TablePagination
            component="div"
            count={tableState.totalCount}
            page={Math.max(0, tableState.currentPage - 1)}
            onPageChange={(e, p) => handlePageChange(p + 1)}
            rowsPerPage={tableState.pageSize}
            rowsPerPageOptions={[]}
        />
    </StyledTableContainer>
);

ListView.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    tableState: PropTypes.object,
    fields: PropTypes.array,
    editingId: PropTypes.number,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handleEdit: PropTypes.func,
    setDeleteDialogOpen: PropTypes.func,
    setDeleteId: PropTypes.func,
    handlePageChange: PropTypes.func,
};

export default ListView;
