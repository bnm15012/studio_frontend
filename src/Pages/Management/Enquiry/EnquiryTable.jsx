import { useCallback, useEffect, useState } from "react";
import { TableBody, TableHead, Paper, IconButton, TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import DeleteDialog from "../../../Components/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import Field from "../../../Components/Fields/Field";
import { usePageSearch } from "../../../hooks/useSearch";

const ListView = ({
    tableName,
    size,
    rootId,
    tableCruds,
    fields,
    fieldsMeta,
    onSetAddNewFunc,
    fieldToDisplayOnDelete = "name",
}) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const { subscribe } = usePageSearch();

    const token = useSelector((state) => state.auth.token);
    const tableState = useSelector((state) => state[tableName]);

    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);

    const handleEdit = (id) => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        const original = data.find((d) => d[fieldsMeta.primary] === id);
        setOriginalRow({ ...original });
        setEditingId(id);
    };

    const handleCancel = () => {
        if (editingId === "NEW") {
            setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== editingId));
        } else if (originalRow) {
            setData((prev) =>
                prev.map((row) => (row[fieldsMeta.primary] === editingId ? originalRow : row)),
            );
        }
        setEditingId(null);
        setOriginalRow(null);
    };

    const handleSave = async (id) => {
        try {
            const newRow = data.find((e) => e[fieldsMeta.primary] === id);
            if (id === "NEW") {
                const { [fieldsMeta.primary]: id, ...withoutId } = newRow;
                dispatch(tableCruds.add(withoutId, token, showAlert, setLoading, true));
                setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== id));
            } else {
                dispatch(tableCruds.update(id, newRow, token, showAlert, setLoading));
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            dispatch(tableCruds.delete(id, token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        }
    };

    const handleChange = (value, id, field) => {
        setData((prev) =>
            prev.map((enq) => (enq[fieldsMeta.primary] === id ? { ...enq, [field]: value } : enq)),
        );
    };

    const fetchData = useCallback(
        async (page = 1, searchTerm = "") => {
            console.log("page fetch", page);
            dispatch(
                tableCruds.getAll(
                    tableName,
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size },
                    rootId,
                ),
            );
        },
        [dispatch, tableCruds, tableName, showAlert, token, size, rootId],
    );

    const handlePageChange = async (e, p) => {
        setPage(p);
        await fetchData(p + 1);
    };

    const addNewRow = useCallback(() => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        const newRow = fields.reduce(
            (acc, f) => {
                acc[f.name] = f.defaultValue ?? "";
                return acc;
            },
            { [fieldsMeta.primary]: "NEW", [fieldsMeta.root]: rootId },
        );

        setData((prev) => [newRow, ...prev]);
        setEditingId("NEW");
    }, [editingId, fields, fieldsMeta.primary, fieldsMeta.root, rootId, showAlert]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const unsubscribe = subscribe((term) => {
            console.log("search for ", term);
            fetchData(page + 1, term);
        });

        return unsubscribe;
    }, [fetchData, page, subscribe]);

    useEffect(() => {
        setData(tableState.items ?? []);
    }, [tableState]);

    useEffect(() => {
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
    }, [addNewRow, onSetAddNewFunc]);
    return (
        <>
            <StyledTableContainer component={Paper}>
                {loading && <Loading />}
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
                                <StyledTableCell>{rowIndex + 1}</StyledTableCell>
                                {fields
                                    .filter((f) => f.show !== false)
                                    .map((field) => (
                                        <StyledTableCell key={field.name}>
                                            <Field
                                                isEdit={editingId === row[fieldsMeta.primary]}
                                                value={row[field.name]}
                                                setValue={(v) =>
                                                    handleChange(
                                                        v,
                                                        row[fieldsMeta.primary],
                                                        field.name,
                                                    )
                                                }
                                                type={field.type}
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
                                            <IconButton
                                                sx={{ color: "red" }}
                                                onClick={handleCancel}
                                            >
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
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={size}
                    rowsPerPageOptions={[]}
                />
            </StyledTableContainer>
            {deleteDialogOpen && deleteId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={() => handleDelete(deleteId)}
                    displayData={`${tableName} for ${data.find((d) => d[fieldsMeta.primary] === deleteId)?.[fieldToDisplayOnDelete]}`}
                />
            )}
        </>
    );
};

ListView.propTypes = {
    tableName: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    rootId: PropTypes.number,
    tableCruds: PropTypes.any,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    onSetAddNewFunc: PropTypes.func,
    fieldToDisplayOnDelete: PropTypes.string,
};
export default ListView;
