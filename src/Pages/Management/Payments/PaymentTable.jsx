import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    TableBody,
    TableHead,
    Paper,
    IconButton,
    TextField,
    MenuItem,
    Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAlert } from "../../../utils/Alert.jsx";
import Loading from "../../../Components/Loading/Loading";
import {
    addPaymentAPI,
    // deletePaymentAPI,
    updatePaymentAPI,
} from "./payment.api.js";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../Components/StyledTableComponents.jsx";
import FlexEvenly from "../../../Components/FlexEvenly.jsx";
import DateTimeField from "../../../Components/DateTimeField.jsx";
import { getLocalDateTime } from "../../../utils/DateUtil.js";
// import DeleteDialog from "../../../Components/DeleteDialog.jsx";

const PaymentTable = ({ initialData, token, newRow, setNewRow, branchId, startIndex }) => {
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);

    const handleEdit = (index) => setEditingRowIndex(index);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const validateRow = (row) => {
        if (!row.payeeType || !row.amount || !row.paymentType || !row.status || !row.paymentDate) {
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
                const newPayment = { ...newRow, branchId };
                const {
                    data: addedPayment,
                    success,
                    message,
                } = await addPaymentAPI({ paymentData: newPayment, token });
                if (success) {
                    setData((prev) => [...prev, addedPayment]);
                    showAlert(message, "success");
                    setNewRow(null);
                } else {
                    showAlert(message, "error");
                }
            } else {
                const updatedPayment = data[index];
                if (!validateRow(updatedPayment)) return;
                const {
                    data: updatedData,
                    success,
                    message,
                } = await updatePaymentAPI({
                    paymentId: updatedPayment.paymentId,
                    paymentData: updatedPayment,
                    token,
                });
                if (success) {
                    setData((prev) =>
                        prev.map((payment, i) =>
                            i === index ? { ...payment, ...updatedData } : payment,
                        ),
                    );
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

    const handleCancel = () => {
        setNewRow(null);
        setEditingRowIndex(null);
    };

    // const handleDelete = async (index) => {
    //   setLoading(true);
    //   try {
    //     const paymentId = data[index].paymentId;
    //     const { success, message } = await deletePaymentAPI({ paymentId, token });
    //     if (success) {
    //       setData((prev) => prev.filter((_, i) => i !== index));
    //       showAlert(message, "success");
    //     } else {
    //       showAlert(message, "error");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     showAlert("Failed to delete payment!", "error");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const handleChange = (value, index, field) => {
        if (index === null) {
            setNewRow({ ...newRow, [field]: value });
        } else {
            setData((prev) =>
                prev.map((obj, i) => (i === index ? { ...obj, [field]: value } : obj)),
            );
        }
    };

    return (
        <StyledTableContainer component={Paper}>
            {loading && <Loading />}
            <StyledTable>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>S no.</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Payee Type</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Payee Name</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Amount</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Mode</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Status</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Date</StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold" }}>Actions</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.paymentId}>
                            {editingRowIndex === index ? (
                                <>
                                    <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        {/* <Select
                      variant="standard"
                      value={row.payeeType}
                      onChange={(e) => handleChange(e.target.value, index, "payeeType")}
                    >
                      <MenuItem value="CLIENT">CLIENT</MenuItem>
                      <MenuItem value="STUDENT">STUDENT</MenuItem>
                    </Select> */}
                                        {row.payeeType}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.clientEntry?.groupName || row.studentEntry?.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {/* <TextField
                      variant="standard"
                      value={row.amount}
                      onChange={(e) => handleChange(e.target.value, index, "amount")}
                    /> */}
                                        {row.amount}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Select
                                            variant="standard"
                                            value={row.paymentType}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "paymentType")
                                            }
                                        >
                                            <MenuItem value="UPI">UPI</MenuItem>
                                            <MenuItem value="CASH">Cash</MenuItem>
                                        </Select>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Select
                                            variant="standard"
                                            value={row.status}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "status")
                                            }
                                        >
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                        </Select>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <DateTimeField
                                            format="DATE"
                                            value={row.paymentDate}
                                            onChange={(value) =>
                                                handleChange(value, index, "paymentDate")
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
                                    <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.payeeType}</StyledTableCell>
                                    <StyledTableCell>
                                        {row.clientEntry?.groupName || row.studentEntry?.name}
                                    </StyledTableCell>
                                    <StyledTableCell>{row.amount}</StyledTableCell>
                                    <StyledTableCell>{row.paymentType}</StyledTableCell>
                                    <StyledTableCell>{row.status}</StyledTableCell>
                                    <StyledTableCell>
                                        {getLocalDateTime(row.paymentDate)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            disabled={row.status === "COMPLETED"}
                                            sx={{ color: "blue" }}
                                            onClick={() => handleEdit(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        {/* <IconButton
                      sx={{ color: "red" }}
                      onClick={() => {
                        setDeleteDialogIndex(index);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                                    </StyledTableCell>
                                </>
                            )}
                        </StyledTableRow>
                    ))}
                    {newRow && (
                        <StyledTableRow>
                            <StyledTableCell>New</StyledTableCell>
                            <StyledTableCell>
                                <Select
                                    variant="standard"
                                    value={newRow.payeeType}
                                    onChange={(e) =>
                                        handleChange(e.target.value, null, "payeeType")
                                    }
                                >
                                    <MenuItem value="CLIENT">CLIENT</MenuItem>
                                    <MenuItem value="STUDENT">STUDENT</MenuItem>
                                </Select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.amount}
                                    onChange={(e) => handleChange(e.target.value, null, "amount")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <Select
                                    variant="standard"
                                    value={newRow.paymentType}
                                    onChange={(e) =>
                                        handleChange(e.target.value, null, "paymentType")
                                    }
                                >
                                    <MenuItem value="UPI">UPI</MenuItem>
                                    <MenuItem value="CASH">Cash</MenuItem>
                                </Select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Select
                                    variant="standard"
                                    value={newRow.status}
                                    onChange={(e) => handleChange(e.target.value, null, "status")}
                                >
                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                </Select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <DateTimeField
                                    format="DATE"
                                    value={newRow.paymentDate}
                                    onChange={(value) => handleChange(value, null, "paymentDate")}
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
                    {data.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={12}>
                                <FlexEvenly>
                                    No Payments data available. Add by clicking the &quot;+&quot;
                                    button!
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </StyledTable>
        </StyledTableContainer>
    );
};

PaymentTable.propTypes = {
    initialData: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
    startIndex: PropTypes.number.isRequired,
    branchId: PropTypes.number.isRequired,
};

export default PaymentTable;
