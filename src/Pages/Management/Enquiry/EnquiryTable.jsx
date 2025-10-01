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
import { useDispatch } from "react-redux";
import { addEnquiryAPI, deleteEnquiryAPI, updateEnquiryAPI } from "./enquiry.api";
import { addEnquiry, deleteEnquiry, updateEnquiry } from "../../../state/enquirySlice";
import DateTimeField from "../../../Components/DateTimeField";
import { getLocalDateTime } from "../../../utils/DateUtil";

const EnquiryTable = ({ initialData, token, newRow, setNewRow, studioId }) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);

    const handleEdit = (index) => {
        setOriginalRow({ ...data[index] });
        setEditingRowIndex(index);
    };

    const handleCancel = () => {
        if (newRow) {
            setNewRow(null);
        } else if (editingRowIndex !== null && originalRow) {
            setData((prev) => prev.map((row, i) => (i === editingRowIndex ? originalRow : row)));
        }
        setEditingRowIndex(null);
        setOriginalRow(null);
    };

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleSave = async (index) => {
        setLoading(true);

        try {
            if (newRow !== null) {
                const newEnquiry = { ...newRow, studioId };
                const {
                    data: addedEnquiry,
                    success,
                    message,
                } = await addEnquiryAPI({
                    newData: newEnquiry,
                    token,
                });
                if (success) {
                    setData((prev) => [...prev, addedEnquiry]);
                    dispatch(addEnquiry(addedEnquiry));
                    showAlert(message, "success");
                } else {
                    showAlert(message, "error");
                }
                setNewRow(null);
            } else {
                const updatedEnquiry = data[index];
                const {
                    data: updatedData,
                    success,
                    message,
                } = await updateEnquiryAPI({
                    enquiryData: updatedEnquiry,
                    token,
                });
                if (success) {
                    setData((prev) =>
                        prev.map((enq, i) => (i === index ? { ...enq, ...updatedData } : enq)),
                    );
                    dispatch(updateEnquiry(updatedData));
                    showAlert(message, "success");
                } else {
                    showAlert(message, "error");
                }
                setEditingRowIndex(null);
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        setLoading(true);

        try {
            const enquiryId = data[index].enquiryId;
            const { success, message } = await deleteEnquiryAPI({ enquiryId, token });
            if (success) {
                setData((prev) => prev.filter((_, i) => i !== index));
                dispatch(deleteEnquiry(enquiryId));
                showAlert(message, "success");
            } else {
                showAlert(message, "error");
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to delete enq!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index, field) => {
        if (index === null) {
            setNewRow({ ...newRow, [field]: value });
        } else {
            setData((prev) =>
                prev.map((enq, i) => (i === index ? { ...enq, [field]: value } : enq)),
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
                            {editingRowIndex === index ? (
                                <>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    {["name", "contact", "enquiryPurpose"].map((field) => (
                                        <StyledTableCell key={field}>
                                            <TextField
                                                variant="standard"
                                                value={row[field]}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index, field)
                                                }
                                            />
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell>
                                        <DateTimeField
                                            format="DATE"
                                            value={row.enquiryDate}
                                            onChange={(value) =>
                                                handleChange(value, index, "enquiryDate")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            sx={{ color: "blue" }}
                                            onClick={() => handleSave(index)}
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
                                            onClick={() => handleEdit(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: "red" }}
                                            onClick={() => {
                                                setDeleteDialogOpen(true);
                                                setDeleteDialogIndex(index);
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
                    onConfirm={handleDelete}
                    displayData={`enq entry with amount ${data[deleteDialogIndex].name}`}
                    id={deleteDialogIndex}
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
    token: PropTypes.string.isRequired,
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
    studioId: PropTypes.number.isRequired,
};
export default EnquiryTable;
