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

const EnquiryTable = ({
    tableName,
    size,
    rootId,
    tableCruds,
    fields,
    fieldsMeta,
    onSetAddNewFunc,
}) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const tableState = useSelector((state) => state[tableName]);

    const [page, setPage] = useState(0);
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteEnquiryId, setDeleteEnquiryId] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);

    const handleEdit = (enquiryId) => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        const original = data.find((d) => d.enquiryId === enquiryId);
        setOriginalRow({ ...original });
        setEditingId(enquiryId);
    };

    const handleCancel = () => {
        if (editingId === "NEW") {
            setData((prev) => prev.filter((row) => row.enquiryId !== editingId));
        } else if (originalRow) {
            setData((prev) => prev.map((row) => (row.enquiryId === editingId ? originalRow : row)));
        }
        setEditingId(null);
        setOriginalRow(null);
    };

    useEffect(() => {
        setSearchTerm(""); // TODO
        setData(tableState.items ?? []);
    }, [tableState]);

    const handleSave = async (enquiryId) => {
        try {
            const newEnquiry = data.find((e) => e.enquiryId === enquiryId);
            if (enquiryId === "NEW") {
                const { enquiryId, ...withoutId } = newEnquiry;
                dispatch(tableCruds.add(withoutId, token, showAlert, setLoading, true));
                setData((prev) => prev.filter((row) => row.enquiryId !== enquiryId));
            } else {
                dispatch(tableCruds.update(enquiryId, newEnquiry, token, showAlert, setLoading));
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (enquiryId) => {
        try {
            dispatch(tableCruds.delete(enquiryId, token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert("Failed to delete enquiry!", "error");
        }
    };

    const handleChange = (value, enquiryId, field) => {
        setData((prev) =>
            prev.map((enq) => (enq.enquiryId === enquiryId ? { ...enq, [field]: value } : enq)),
        );
    };

    const fetchData = useCallback(
        async (page = 1) => {
            dispatch(
                tableCruds.getAll(
                    tableState,
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size },
                    rootId,
                ),
            );
        },
        [dispatch, tableCruds, tableState, showAlert, token, searchTerm, size, rootId],
    );

    useEffect(() => {
        !tableState.items.length && fetchData();
    }, [tableState.items.length, fetchData]);

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
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
    }, [addNewRow, onSetAddNewFunc]);
    return (
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
                                                handleChange(v, row[fieldsMeta.primary], field.name)
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
                                                setDeleteEnquiryId(row[fieldsMeta.primary]);
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
            {deleteDialogOpen && deleteEnquiryId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={() => handleDelete(deleteEnquiryId)}
                    displayData={`enquiry for ${data.find((d) => d.enquiryId === deleteEnquiryId)?.name}`}
                />
            )}
            <TablePagination
                component="div"
                count={tableState.totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={size}
                rowsPerPageOptions={[]}
            />
        </StyledTableContainer>
    );
};

EnquiryTable.propTypes = {
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
};
export default EnquiryTable;
