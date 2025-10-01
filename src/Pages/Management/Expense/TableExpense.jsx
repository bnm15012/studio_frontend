import { useEffect, useState } from "react";
import {
    TableBody,
    TableHead,
    Paper,
    IconButton,
    TextField,
    MenuItem,
    Select,
    FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
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
import DateTimeField from "../../../Components/DateTimeField";
import DeleteDialog from "../../../Components/DeleteDialog";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { useDispatch } from "react-redux";
import { expenseCruds } from "../../../api/all.api";

const TableWithEditAddDelete = ({
    initialData,
    token,
    categories,
    newRow,
    setNewRow,
    branchId,
    showMore,
}) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);

    const handleEdit = (index) => setEditingRowIndex(index);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const validateRow = (row) => {
        if (!row.amount || !row.expenseDate || !row.expenseCategory) {
            showAlert("All fields are required!", "error");
            return false;
        }
        if (isNaN(row.amount) || row.amount <= 0) {
            showAlert("Amount must be a positive number!", "error");
            return false;
        }
        return true;
    };

    const handleSave = async (index) => {
        setLoading(true);

        try {
            if (newRow !== null) {
                if (!validateRow(newRow)) return;
                const newExpense = { ...newRow, branchId };
                dispatch(expenseCruds.add(newExpense, token, showAlert, setLoading, true));
                setNewRow(null);
            } else {
                const updatedExpense = data[index];
                if (!validateRow(updatedExpense)) return;
                dispatch(
                    expenseCruds.update(
                        updatedExpense.expenseId,
                        { ...updatedExpense, branchId },
                        token,
                        showAlert,
                        setLoading,
                    ),
                );
                setEditingRowIndex(null);
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setNewRow(null);
        setEditingRowIndex(null);
    };

    const handleDelete = async (index) => {
        setLoading(true);

        try {
            dispatch(expenseCruds.delete(data[index].expenseId, token, showAlert, setLoading));
            setDeleteDialogOpen(false);
            setDeleteDialogIndex(null);
        } catch (error) {
            console.error(error);
            showAlert("Failed to delete expense!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index, field) => {
        if (index === null) {
            setNewRow({ ...newRow, [field]: value });
        } else {
            setData((prev) =>
                prev.map((expense, i) => (i === index ? { ...expense, [field]: value } : expense)),
            );
        }
    };
    return (
        <StyledTableContainer sx={{ overflowX: "auto" }} component={Paper}>
            {loading && <Loading />}
            <StyledTable>
                <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                    <StyledTableRow>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            S. No.
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Description
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Amount
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Expense Date
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Category
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Actions
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.expenseId}>
                            {editingRowIndex === index ? (
                                <>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.description}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "description")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            type="number"
                                            value={row.amount}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "amount")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <DateTimeField
                                            format="DATE"
                                            value={row.expenseDate}
                                            onChange={(value) =>
                                                handleChange(value, index, "expenseDate")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                variant="standard"
                                                value={row.expenseCategory}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e.target.value,
                                                        index,
                                                        "expenseCategory",
                                                    )
                                                }
                                            >
                                                {categories.map((category) => (
                                                    <MenuItem key={category} value={category}>
                                                        {category}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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
                                    <StyledTableCell>{row.description}</StyledTableCell>
                                    <StyledTableCell>{row.amount}</StyledTableCell>
                                    <StyledTableCell>
                                        {getLocalDateTime(row.expenseDate)}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.expenseCategory}</StyledTableCell>
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
                                    No expense data available. Add by clicking the &quot;+&quot;
                                    button!
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                    {newRow && (
                        <StyledTableRow>
                            <StyledTableCell>NEW</StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.description}
                                    onChange={(e) =>
                                        handleChange(e.target.value, null, "description")
                                    }
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    type="number"
                                    value={newRow.amount}
                                    onChange={(e) => handleChange(e.target.value, null, "amount")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <DateTimeField
                                    format="DATE"
                                    value={newRow.expenseDate}
                                    onChange={(value) => handleChange(value, null, "expenseDate")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <FormControl fullWidth>
                                    <Select
                                        variant="standard"
                                        value={newRow.expenseCategory}
                                        onChange={(e) =>
                                            handleChange(e.target.value, null, "expenseCategory")
                                        }
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                    <StyledTableRow>
                        <StyledTableCell
                            colSpan={6}
                            sx={{ m: "auto", textAlign: "center", cursor: "pointer" }}
                            onClick={showMore}
                        >
                            Show More
                        </StyledTableCell>
                    </StyledTableRow>
                </TableBody>
            </StyledTable>
            {deleteDialogOpen && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    displayData={`expense entry with amount ${data[deleteDialogIndex].amount}`}
                    id={deleteDialogIndex}
                />
            )}
        </StyledTableContainer>
    );
};

TableWithEditAddDelete.propTypes = {
    initialData: PropTypes.arrayOf(
        PropTypes.shape({
            expenseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            description: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            expenseDate: PropTypes.string.isRequired,
            expenseCategory: PropTypes.string.isRequired,
        }),
    ).isRequired,
    token: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
    showMore: PropTypes.func.isRequired,
    branchId: PropTypes.number.isRequired,
};
export default TableWithEditAddDelete;
