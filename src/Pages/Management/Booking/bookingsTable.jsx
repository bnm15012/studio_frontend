import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { Delete, Save, Cancel, Edit } from "@mui/icons-material";
import { useAlert } from "../../../utils/Alert";
import {
  addBookingAPI,
  deleteBookingAPI,
  updateBookingAPI,
} from "./bookings.api";
import Loading from "../../../Components/Loading/Loading";
import FlexEvenly from "../../../Components/FlexEvenly";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import DateTimeField from "../../../Components/DateTimeField";
import { getLocalDateTime } from "../../../utils/DateUtil";
import FlexBetween from "../../../Components/FlexBetween";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../../../Components/DeleteDialog";

const BookingsTable = ({
  initialData,
  token,
  paymentTypes,
  paymentStatusTypes,
  newRow,
  setNewRow,
  startIndex,
  branchId,
}) => {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [data, setData] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const validateRow = (row) => {
    if (
      !row.clientId ||
      !row.purpose ||
      !row.totalAmount ||
      !row.paymentStatus ||
      !row.advanceAmount ||
      !row.balanceAmount ||
      !row.bookingDate ||
      !row.startTime ||
      !row.endTime ||
      !row.advanceDate ||
      !row.advanceMode
    ) {
      showAlert("All fields are required!", "error");
      return false;
    }

    return true;
  };

  const handleSave = async (index) => {
    setLoading(true);

    try {
      if (newRow !== null) {
        if (!validateRow(newRow)) return;
        const newBooking = { ...newRow, branchId };
        const {
          data: addedBooking,
          success,
          message,
        } = await addBookingAPI({
          bookingData: newBooking,
          token,
        });
        if (success) {
          setData((prev) => [...prev, addedBooking]);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
        setNewRow(null);
      } else {
        const updatedBooking = data[index];
        if (!validateRow(updatedBooking)) return;
        const {
          data: updatedData,
          success,
          message,
        } = await updateBookingAPI({
          bookingId: updatedBooking.id,
          bookingData: updatedBooking,
          token,
        });
        if (success) {
          setData((prev) =>
            prev.map((client, i) =>
              i === index ? { ...client, ...updatedData } : client
            )
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

  const handleDelete = async (index) => {
    setLoading(true);

    try {
      const bookingId = data[index].id;
      const { success, message } = await deleteBookingAPI({ bookingId, token });
      if (success) {
        setData((prev) => prev.filter((_, i) => i !== index));
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete booking!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index, field) => {
    if (index === null) {
      setNewRow({ ...newRow, [field]: value });
    } else {
      const updatedData = [...data];
      updatedData[index][field] = value;
      setData(updatedData);
    }
  };

  return (
    <StyledTableContainer component={Paper}>
      {loading && <Loading />}
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
          <StyledTableRow>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              S. No.
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Client Name
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Purpose
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Booking Date
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Start Time
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              End Time
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Total Amount
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Payment Status
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Payment Mode
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Actions
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={row.id}
            >
              {editingRowIndex === index ? (
                <>
                  <StyledTableCell>
                    {startIndex + index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.clientId}
                      onChange={(e) => handleChange(e.target.value, index, "clientId")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.purpose}
                      onChange={(e) => handleChange(e.target.value, index, "purpose")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.totalAmount}
                      onChange={(e) => handleChange(e.target.value, index, "totalAmount")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        value={row.paymentStatus}
                        onChange={(e) =>
                          handleChange(e.target.value, index, "paymentStatus")
                        }
                      >
                        {paymentStatusTypes.map((paymentStatus) => (
                          <MenuItem key={paymentStatus} value={paymentStatus}>
                            {paymentStatus}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.advanceAmount}
                      onChange={(e) => handleChange(e.target.value, index, "advanceAmount")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.balanceAmount}
                      onChange={(e) => handleChange(e.target.value, index, "balanceAmount")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.notes}
                      onChange={(e) => handleChange(e.target.value, index, "notes")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <DateTimeField
                      format="DATE"
                      value={row.bookingDate}
                      onChange={(e) => handleChange(e, index, "bookingDate")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <DateTimeField
                      value={row.startTime}
                      onChange={(e) => handleChange(e, index, "startTime")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <DateTimeField
                      value={row.endTime}
                      onChange={(e) => handleChange(e, index, "endTime")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <DateTimeField
                      format="DATE"
                      value={row.advanceDate}
                      onChange={(e) => handleChange(e, index, "advanceDate")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        value={row.advanceMode}
                        onChange={(e) =>
                          handleChange(e.target.value, index, "paymentStatus")
                        }
                      >
                        {paymentTypes.map((advanceMode) => (
                          <MenuItem key={advanceMode} value={advanceMode}>
                            {advanceMode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                  <StyledTableCell>
                    <DateTimeField
                      format="DATE"
                      value={row.finalPaymentDate}
                      onChange={(e) => handleChange(e, index, "finalPaymentDate")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        value={row.paymentMode}
                        onChange={(e) => handleChange(e.target.value, index, "paymentMode")}
                      >
                        {paymentTypes.map((paymentMode) => (
                          <MenuItem key={paymentMode} value={paymentMode}>
                            {paymentMode}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                  <StyledTableCell>

                    <IconButton
                      sx={{ color: "green" }}
                      onClick={() => handleSave(index)}
                    >
                      <Save />
                    </IconButton>
                    <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                      <Cancel />
                    </IconButton>
                  </StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                  <StyledTableCell>{row.clientEntry?.groupName}</StyledTableCell>
                  <StyledTableCell>{row.purpose}</StyledTableCell>
                  <StyledTableCell>{getLocalDateTime(row.bookingDate)}</StyledTableCell>
                  <StyledTableCell>{getLocalDateTime(row.startTime, "DATETIME")}</StyledTableCell>
                  <StyledTableCell>{getLocalDateTime(row.endTime, "DATETIME")}</StyledTableCell>
                  <StyledTableCell>{row.totalAmount}</StyledTableCell>
                  <StyledTableCell>{row.paymentStatus}</StyledTableCell>
                  <StyledTableCell>{row.paymentMode}</StyledTableCell>
                  <StyledTableCell>
                    <FlexBetween>
                      <IconButton
                        sx={{ color: "red" }}
                        onClick={() => {
                          setDeleteDialogIndex(index);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        sx={{ color: "blue" }}
                        onClick={() => navigate(`/management/bookings/${row.id}`)}
                      >
                        <Edit />
                      </IconButton>
                    </FlexBetween>
                  </StyledTableCell>
                </>
              )}
            </StyledTableRow>
          ))}
          {data.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={15}>
                <FlexEvenly>
                  No client data available. Add by clicking the &quot;+&quot; button!
                </FlexEvenly>
              </StyledTableCell>
            </StyledTableRow>
          )}
          {newRow && (
            <StyledTableRow>
              <StyledTableCell>
                NEW
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.clientId}
                  onChange={(e) => handleChange(e.target.value, null, "clientId")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.purpose}
                  onChange={(e) => handleChange(e.target.value, null, "purpose")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.totalAmount}
                  onChange={(e) => handleChange(e.target.value, null, "totalAmount")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <FormControl fullWidth>
                  <Select
                    variant="standard"
                    value={newRow.paymentStatus}
                    onChange={(e) => handleChange(e.target.value, null, "paymentStatus")}
                  >
                    {paymentStatusTypes.map((paymentStatus) => (
                      <MenuItem key={paymentStatus} value={paymentStatus}>
                        {paymentStatus}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.advanceAmount}
                  onChange={(e) => handleChange(e.target.value, null, "advanceAmount")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.balanceAmount}
                  onChange={(e) => handleChange(e.target.value, null, "balanceAmount")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  variant="standard"
                  value={newRow.notes}
                  onChange={(e) => handleChange(e.target.value, null, "notes")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <DateTimeField
                  format="DATE"
                  value={newRow.bookingDate}
                  onChange={(e) => handleChange(e, null, "bookingDate")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <DateTimeField
                  value={newRow.startTime}
                  onChange={(e) => handleChange(e, null, "startTime")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <DateTimeField
                  value={newRow.endTime}
                  onChange={(e) => handleChange(e, null, "endTime")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <DateTimeField
                  format="DATE"
                  value={newRow.advanceDate}
                  onChange={(e) => handleChange(e, null, "advanceDate")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <FormControl fullWidth>
                  <Select
                    variant="standard"
                    value={newRow.advanceMode}
                    onChange={(e) => handleChange(e.target.value, null, "advanceMode")}
                  >
                    {paymentTypes.map((advanceMode) => (
                      <MenuItem key={advanceMode} value={advanceMode}>
                        {advanceMode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledTableCell>
              <StyledTableCell>
                <DateTimeField
                  format="DATE"
                  value={newRow.finalPaymentDate}
                  onChange={(e) => handleChange(e, null, "finalPaymentDate")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <FormControl fullWidth>
                  <Select
                    variant="standard"
                    value={newRow.paymentMode}
                    onChange={(e) => handleChange(e.target.value, null, "paymentMode")}
                  >
                    {paymentTypes.map((paymentMode) => (
                      <MenuItem key={paymentMode} value={paymentMode}>
                        {paymentMode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  sx={{ color: "green" }}
                  onClick={() => handleSave(null)}
                >
                  <Save />
                </IconButton>
                <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                  <Cancel />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      {
        deleteDialogOpen && (
          <DeleteDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            displayData={`booking with client ${data[deleteDialogIndex].clientEntry.groupName}`}
            id={deleteDialogIndex}
          />
        )
      }
    </StyledTableContainer>
  );
};

BookingsTable.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      branchId: PropTypes.number.isRequired,
      purpose: PropTypes.string.isRequired,
      totalAmount: PropTypes.number.isRequired,
      paymentStatus: PropTypes.string.isRequired,
      advanceAmount: PropTypes.number.isRequired,
      bookingDate: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      advanceDate: PropTypes.string.isRequired,
      paymentMode: PropTypes.string.isRequired,
      balanceAmount: PropTypes.number,
      notes: PropTypes.string,
      advanceMode: PropTypes.string.isRequired,
      finalPaymentDate: PropTypes.string,
    })
  ).isRequired,
  token: PropTypes.string.isRequired,
  paymentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  paymentStatusTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  newRow: PropTypes.object,
  setNewRow: PropTypes.func.isRequired,
  startIndex: PropTypes.number.isRequired,
  branchId: PropTypes.number.isRequired,
};
export default BookingsTable;
