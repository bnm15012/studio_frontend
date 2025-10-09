import { useEffect, useState } from "react";
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
import { enquiryCruds } from "../../../api/all.api";
import Field from "../../../Components/Fields/Field";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";

const EnquiryTable = ({ initialData, fields, fieldsMeta, onSetAddNewFunc }) => {
    const dispatch = useDispatch();
    // const { isMobile } = useUI();
    const token = useSelector((state) => state.auth.token);
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteEnquiryId, setDeleteEnquiryId] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);

    const handleEdit = (enquiryId) => {
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
        setData(initialData);
    }, [initialData]);

    const handleSave = async (enquiryId) => {
        setLoading(true);

        try {
            const newEnquiry = data.find((e) => e.enquiryId === enquiryId);
            if (enquiryId === "NEW") {
                const { enquiryId, ...withoutId } = newEnquiry;
                dispatch(enquiryCruds.add(withoutId, token, showAlert, setLoading, true));
                setData((prev) => prev.filter((row) => row.enquiryId !== enquiryId));
            } else {
                dispatch(enquiryCruds.update(enquiryId, newEnquiry, token, showAlert, setLoading));
                setEditingId(null);
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (enquiryId) => {
        setLoading(true);

        try {
            dispatch(enquiryCruds.delete(enquiryId, token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert("Failed to delete enquiry!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, enquiryId, field) => {
        setData((prev) =>
            prev.map((enq) => (enq.enquiryId === enquiryId ? { ...enq, [field]: value } : enq)),
        );
    };

    const addNewRow = () => {
        const newRow = {
            enquiryId: "NEW",
            name: "",
            contact: "",
            enquiryPurpose: "",
            enquiryDate: getCurrentDateTimeUTC(),
            branchId: 2,
        };
        setData((prev) => [newRow, ...prev]);
        setEditingId("NEW");
    };

    useEffect(() => {
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
    }, [onSetAddNewFunc]);
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
            {deleteDialogOpen && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={() => handleDelete(deleteEnquiryId)}
                    displayData={`enquiry for ${data.find((d) => d.enquiryId === deleteEnquiryId)?.name}`}
                />
            )}

            <TablePagination
                component="div"
                count={5}
                page={1}
                onPageChange={() => {}}
                rowsPerPage={5}
                rowsPerPageOptions={[5]}
            />
        </StyledTableContainer>
    );
};

EnquiryTable.propTypes = {
    initialData: PropTypes.arrayOf(
        PropTypes.shape({
            enquiryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            contact: PropTypes.string.isRequired,
            enquiryDate: PropTypes.string.isRequired,
            enquiryPurpose: PropTypes.string.isRequired,
        }),
    ).isRequired,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    onSetAddNewFunc: PropTypes.func,
};
export default EnquiryTable;
