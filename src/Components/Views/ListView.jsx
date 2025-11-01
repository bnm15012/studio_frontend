import { TableBody, TableHead, Paper, IconButton, TablePagination, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

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
    actions,
    handleChange,
    handleSave,
    handleCancel,
    tableState,
    handlePageChange,
    handleViewOpen,
}) => (
    <StyledTableContainer component={Paper}>
        <StyledTable>
            <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                <StyledTableRow>
                    <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        S. No.
                    </StyledTableCell>
                    {fields
                        .filter((f) => f.show || f.view)
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
                            .filter((f) => f.show || f.view)
                            .map((field) => (
                                <StyledTableCell key={field.name}>
                                    {field.view ? (
                                        <Button
                                            size="small"
                                            variant="text"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewOpen(row);
                                            }}
                                        >
                                            View
                                        </Button>
                                    ) : (
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
                                    )}
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
                                    {actions
                                        .filter((a) => !a.hide)
                                        .map(({ name, enabled, onClick, icon, sx }) => (
                                            <IconButton
                                                disabled={
                                                    typeof enabled === "function"
                                                        ? !enabled(row)
                                                        : !enabled
                                                }
                                                key={name}
                                                sx={sx}
                                                onClick={() => onClick(row)}
                                            >
                                                {icon || name}
                                            </IconButton>
                                        ))}
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
    handlePageChange: PropTypes.func,
    isActionDisabled: PropTypes.func,
    handleViewOpen: PropTypes.func,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.bool,
        }),
    ),
};

export default ListView;
