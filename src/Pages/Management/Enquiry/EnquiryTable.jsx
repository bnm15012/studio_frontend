import { useEffect, useState } from "react";
import { TableBody, TableHead, Paper, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import FlexEvenly from "../../../Components/FlexEvenly";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import DeleteDialog from "../../../Components/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import DateTimeField from "../../../Components/DateTimeField";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { enquiryCruds } from "../../../api/all.api";
import { useUI } from "../../../context/UIContext";

const EnquiryTable = ({ initialData, newRow, setNewRow }) => {
    const dispatch = useDispatch();
    const { isMobile } = useUI();
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
        if (newRow) {
            setNewRow(null);
        } else if (editingId && originalRow) {
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
            if (newRow !== null) {
                dispatch(enquiryCruds.add(newRow, token, showAlert, setLoading, true));
                setNewRow(null);
            } else {
                const updatedEnquiry = data.find((e) => e.enquiryId === enquiryId);
                dispatch(
                    enquiryCruds.update(enquiryId, updatedEnquiry, token, showAlert, setLoading),
                );
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
        if (enquiryId === null) {
            setNewRow({ ...newRow, [field]: value });
        } else {
            setData((prev) =>
                prev.map((enq) => (enq.enquiryId === enquiryId ? { ...enq, [field]: value } : enq)),
            );
        }
    };

    return (
        <StyledTableContainer component={Paper}>
            {loading && <Loading />}
            <StyledTable>
                <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                    <StyledTableRow>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            S. No.
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Name
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Contact
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Purpose
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Date
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Actions
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.enquiryId}>
                            {editingId === row.enquiryId ? (
                                <>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    {["name", "contact", "enquiryPurpose"].map((field) => (
                                        <StyledTableCell key={field}>
                                            <TextField
                                                variant="standard"
                                                value={row[field]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e.target.value,
                                                        row.enquiryId,
                                                        field,
                                                    )
                                                }
                                            />
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell>
                                        <DateTimeField
                                            format="DATE"
                                            value={row.enquiryDate}
                                            onChange={(value) =>
                                                handleChange(value, row.enquiryId, "enquiryDate")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            sx={{ color: "blue" }}
                                            onClick={() => handleSave(row.enquiryId)}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                                            <CancelIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </>
                            ) : (
                                <>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    {["name", "contact", "enquiryPurpose"].map((field) => (
                                        <StyledTableCell key={field}>{row[field]}</StyledTableCell>
                                    ))}
                                    <StyledTableCell>
                                        {getLocalDateTime(row.enquiryDate)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            sx={{ color: "blue" }}
                                            onClick={() => handleEdit(row.enquiryId)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: "red" }}
                                            onClick={() => {
                                                setDeleteDialogOpen(true);
                                                setDeleteEnquiryId(row.enquiryId);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </>
                            )}
                        </StyledTableRow>
                    ))}
                    {data.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={6}>
                                <FlexEvenly>
                                    No Enquiry available. Add by clicking the &quot;+&quot; button!
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                    {newRow && (
                        <StyledTableRow>
                            <StyledTableCell>NEW</StyledTableCell>
                            {["name", "contact", "enquiryPurpose"].map((field) => (
                                <StyledTableCell key={field}>
                                    <TextField
                                        variant="standard"
                                        value={newRow[field]}
                                        onChange={(e) => handleChange(e.target.value, null, field)}
                                    />
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <DateTimeField
                                    format="DATE"
                                    value={newRow.enquiryDate}
                                    onChange={(value) => handleChange(value, null, "enquiryDate")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <IconButton sx={{ color: "blue" }} onClick={() => handleSave(null)}>
                                    <SaveIcon />
                                </IconButton>
                                <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                                    <CancelIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
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
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
};
export default EnquiryTable;
