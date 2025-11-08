import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SaveIcon from "@mui/icons-material/Save";
import FlexBetween from "../../../../Components/FlexBetween";
import ActivityMembershipSelector from "../../Activity/ActivityMembershipSelector";
import {
  assignActivityStudentAPI,
  deleteStudentActivityAPI,
  editActivityStudentAPI,
} from "../Student.api";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../../../utils/Alert";
import FlexEvenly from "../../../../Components/FlexEvenly";
import Loading from "../../../../Components/Loading/Loading";
import { validateAndProcessDates } from "../../../../utils/validationConstraints";
import PropTypes from "prop-types";
import { getCurrentDateTimeUTC, getLocalDateTime } from "../../../../utils/DateUtil";
import DateTimeField from "../../../../Components/DateTimeField";
import { getEndDateBySubscriptionPlan } from "../../../../utils/SubscriptionPlanUtil";
import PaymentEntryDialog from "../../Payments/PaymentEntryDialog";
import DeleteDialog from "../../../../Components/DeleteDialog";
import StudentInvoice from "./StudentInvoice";
import { clearPaymentPages } from "../../../../state/paymentSlice";
import { StyledTableContainer } from "../../../../Components/StyledTableComponents";
import { useUI } from "../../../../context/UIContext";
import { validMembershipTypes } from "../../Activity/Activities.constants";
import { updatePaymentAPI } from "../../Payments/payment.api";

const PAYMENT_STATUS = [
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "PENDING", value: "PENDING" },
  { label: "FAILED", value: "FAILED" }
]
const PAYMENT_TYPE = [
  { label: "CASH", value: "CASH" },
  { label: "UPI", value: "UPI" }
]

const initialNewRowState = {
  activityName: "",
  membershipType: "",
  registrationDate: getCurrentDateTimeUTC(),
  membershipStartDate: getCurrentDateTimeUTC(),
  membershipEndDate: "",
  membershipStatus: "INACTIVE",
  activityAmount: 0,
  batchName: "default",
  batchTime: "",
  daysPerWeek: 0,
  paymentEntry: {
    payeeType: "STUDENT",
    actualAmount: 0,
    amount: 0,
    paymentDate: undefined,
    status: PAYMENT_STATUS[0].value,
    paymentType: PAYMENT_TYPE[0].value,
  }
};
const EnrolledActivitiesTableStudent = ({ studentId, data, studentData }) => {
  const { isBatchEnabled, isEnabled, FEATURE_KEYS } = useUI();
  const showAlert = useAlert();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [tableData, setTableData] = useState(data || []);
  const [editIndex, setEditIndex] = useState(null);
  const [newRow, setNewRow] = useState(initialNewRowState);
  const [pastDataOfEditRow, setPastDataOfEditRow] = useState();
  const [showAddNewRow, setShowAddNewRow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentEntry, setPaymentEntry] = useState(initialNewRowState.paymentEntry);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false)

  const saveActivity = (index) => {
    setEditIndex(index);
  };
  const handleEdit = (index) => {
    if (index === null) {
      setPastDataOfEditRow(null);
      setEditIndex(null);
    } else {
      setPastDataOfEditRow(tableData[index]);
      setEditIndex(index);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...tableData];
    if (field.includes('.')) {
      const fields = field.split('.');
      updatedData[index][fields[0]][fields[1]] = value;
    } else {
      updatedData[index][field] = value;
    }
    setTableData(updatedData);
  };

  const handleSave = async (index) => {
    if (!tableData[index].activityName) {
      showAlert("Activity must be selected!");
      return;
    }

    if (!tableData[index].membershipType) {
      showAlert("Membership plan must be selected!");
      return;
    }
    tableData[index].membershipEndDate = tableData[index].membershipEndDate || getEndDateBySubscriptionPlan(tableData[index].membershipStartDate, tableData[index].membershipType)
    if (
      !validateAndProcessDates({
        startDate: tableData[index].membershipStartDate,
        endDate: tableData[index].membershipEndDate,
        showAlert,
      })
    ) {
      return;
    }
    setLoading(true);

    if (tableData[index].paymentEntry.paymentDate && tableData[index].paymentEntry.status === "PENDING") {
      const {
        data: updatedData,
        success,
        message,
      } = await updatePaymentAPI({
        paymentId: tableData[index].paymentEntry.paymentId,
        paymentData: { ...tableData[index].paymentEntry, status: "COMPLETED" },
        token,
      });
      if (success) {
        tableData[index].paymentEntry = updatedData;
        showAlert("Payment marked as completed", "success");
      } else {
        showAlert(message, "error");
        setLoading(false);
        return;
      }
    }

    try {
      const { success, message } = await editActivityStudentAPI({
        assignedActivityData: tableData[index],
        assignmentId: tableData[index].assignmentId,
        token,
      });
      if (success) {
        setPastDataOfEditRow(null);
        setEditIndex(null);
        const updatedActivity = tableData[index];
        saveActivity(updatedActivity);
        setEditIndex(null);
        showAlert(message, "success");
      } else {
        tableData[index] = pastDataOfEditRow;
        setTableData(tableData);
        setEditIndex(null);
        setPastDataOfEditRow(null);
        setEditIndex(null);
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("error in update assigned activity ", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (index) => {
    setLoading(true);
    try {
      const { success } = await deleteStudentActivityAPI({
        assignmentId: tableData[index].assignmentId,
        token,
      });
      if (success) {
        const updatedData = tableData.filter((_, i) => i !== index);
        setTableData(updatedData);
        showAlert("deleted successfully", "success");
      } else {
        showAlert("fail to delet !", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Internal server error", "error");
    }
    setLoading(false);
  };

  const handleAddNewRow = async () => {
    if (!newRow.activityName) {
      showAlert("Activity must be selected!");
      return;
    }

    if (!newRow.membershipType) {
      showAlert("Membership plan must be selected!");
      return;
    }
    newRow.membershipEndDate = newRow.membershipEndDate || getEndDateBySubscriptionPlan(newRow.membershipStartDate, newRow.membershipType)
    if (
      !validateAndProcessDates({
        startDate: newRow.membershipStartDate,
        endDate: newRow.membershipEndDate,
        showAlert,
      })
    ) {
      return;
    }
    setLoading(true);
    if (!newRow.activityName || !newRow.membershipType) return;
    try {
      newRow["studentId"] = studentId;
      newRow["paymentEntry"] = { ...paymentEntry, paymentDate: newRow["paymentEntry"]["paymentDate"] };
      newRow["paymentEntry"]["payeeId"] = studentId;
      newRow["paymentEntry"]["branchId"] = currentBranch.branchId;
      const { success, message, data: newRowData } = await assignActivityStudentAPI({
        studentAcivityData: newRow,
        token,
      });
      if (success) {
        setTableData((prev) => [...prev, newRowData]);
        setNewRow(initialNewRowState);
        dispatch(clearPaymentPages())
        setShowAddNewRow(false);
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("failed to assign new activity to student !");
    }

    setLoading(false);
  };

  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => {
      const updated = { ...prev };
      if (field.includes('.')) {
        const [outerKey, innerKey] = field.split('.');
        updated[outerKey] = { ...updated[outerKey], [innerKey]: value };
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  const handleActivityMembershipChange = async (
    index,
    activity,
    membershipType,
    batchName,
    batchTime,
    daysPerWeek,
    amount
  ) => {
    setLoading(true);
    if (index !== null) {
      const updatedData = [...tableData];
      updatedData[index].activityName = activity?.activityType;
      updatedData[index].membershipType = membershipType;
      updatedData[index].batchName = batchName;
      if (batchName) {
        updatedData[index].daysPerWeek = daysPerWeek;
        updatedData[index].activityAmount = amount
        updatedData[index].batchTime = batchTime;
      }
      setTableData(updatedData);
    } else {
      newRow.activityName = activity?.activityType;
      newRow.batchName = batchName;
      if (batchName) {
        newRow.membershipType = membershipType;
        newRow.daysPerWeek = daysPerWeek;
        newRow.activityAmount = amount
        paymentEntry.amount = amount;
        paymentEntry.actualAmount = amount;
        newRow.batchTime = batchTime;
      }
      setNewRow((prev) => ({
        ...prev,
        activityName: activity?.activityType,
        membershipType,
      }));
    }
    setLoading(false);
  };

  return (
    <>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Membership</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              {
                isBatchEnabled && <>
                  <TableCell sx={{ fontWeight: 700 }}>Batch</TableCell>
                  <TableCell sx={{ fontWeight: 700, textWrap: "nowrap" }}>Batch Time</TableCell>
                </>
              }
              <TableCell sx={{ fontWeight: 700 }}>Registration Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Membership Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Membership End Date
              </TableCell>
              {
                isEnabled(FEATURE_KEYS.PAYMENT_DATE) &&
                <TableCell sx={{ fontWeight: 700, textWrap: "nowrap" }}>
                  Payment Date
                </TableCell>
              }
              <TableCell sx={{ fontWeight: 700 }}>Membership Status</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.activityName || "N/A"}</TableCell>
                  <TableCell>{row.membershipType}</TableCell>
                  <TableCell sx={{ textWrap: "nowrap" }}>
                    {
                      row.membershipType === "REGISTRATION" ? (
                        <>
                          {row.paymentEntry.amount !== row.paymentEntry.actualAmount ? (
                            <>
                              Rs. {row.paymentEntry.amount}
                              {" "}
                              <span style={{ textDecoration: "line-through", color: "red" }}>
                                Rs. {row.paymentEntry.actualAmount}
                              </span>
                            </>
                          ) : (
                            `Rs. ${row.paymentEntry.amount}`
                          )}
                        </>
                      ) : (
                        <>
                          {row.daysPerWeek} Days/Week -{" "}
                          {row.paymentEntry.amount !== row.paymentEntry.actualAmount ? (
                            <>
                              Rs. {row.paymentEntry.amount}
                              {" "}
                              <span style={{ textDecoration: "line-through", color: "red" }}>
                                Rs. {row.paymentEntry.actualAmount}
                              </span>
                            </>
                          ) : (
                            `Rs. ${row.paymentEntry.amount}`
                          )}
                        </>
                      )
                    }
                  </TableCell>
                  {
                    isBatchEnabled && <>
                      <TableCell>
                        {row.membershipType === "REGISTRATION" ? "-" : (row.batchName)}
                      </TableCell>
                      <TableCell>
                        {row.membershipType === "REGISTRATION" ? "-" : (row.batchTime)}
                      </TableCell>
                    </>
                  }
                  <TableCell>
                    {getLocalDateTime(row.registrationDate)}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <DateTimeField
                        format="DATE"
                        value={row.membershipStartDate}
                        onChange={(value) => {
                          handleInputChange(index, "membershipStartDate", value)
                          if (validMembershipTypes.includes(row.membershipType) || !row.membershipStartDate) {
                            handleInputChange(index, "membershipEndDate", getEndDateBySubscriptionPlan(value, row.membershipType))
                          }
                        }}
                      />
                    ) : (
                      getLocalDateTime(row.membershipStartDate)
                    )}
                  </TableCell>
                  <TableCell>
                    {
                      editIndex === index ? (
                        <DateTimeField
                          disabled={validMembershipTypes.includes(row.membershipType) || !row.membershipStartDate}
                          format="DATE"
                          value={row.membershipEndDate}
                          minDateTime={row.membershipStartDate}
                          onChange={(value) =>
                            handleInputChange(index, "membershipEndDate", value)}
                        />) : (
                        getLocalDateTime(row.membershipEndDate)
                      )
                    }
                  </TableCell>
                  {isEnabled(FEATURE_KEYS.PAYMENT_DATE) &&
                    <TableCell sx={{ color: row.paymentEntry.status === "COMPLETED" ? "" : "red" }}>
                      {
                        editIndex === index ? (
                          <DateTimeField
                            disabled={row.paymentEntry.status === "COMPLETED"}
                            format="DATE"
                            value={row.paymentEntry.paymentDate}
                            onChange={(value) =>
                              handleInputChange(index, "paymentEntry.paymentDate", value)}
                          />) : (
                          getLocalDateTime(row.paymentEntry.paymentDate)
                        )
                      }
                    </TableCell>
                  }
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color:
                        row.membershipStatus === "ACTIVE" ? "green" : "red",
                    }}
                  >
                    {row.membershipStatus}
                  </TableCell>
                  <TableCell>
                    <FlexBetween gap={1}>
                      {editIndex === index ? (
                        <>
                          <Button
                            onClick={() => handleSave(index)}
                          >
                            <SaveIcon sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Button
                            sx={{ color: "red" }}
                            onClick={() => handleEdit(null)}
                          >
                            <CancelIcon sx={{ fontSize: "2rem" }} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            disabled={editIndex != null || showAddNewRow}
                            onClick={() => handleEdit(index)}
                          >
                            <EditIcon sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Tooltip title={row.paymentEntry.status !== "COMPLETED" ? "Payment is still pending or it's failed" : "View Invoice"}>
                            <Button
                              disabled={editIndex != null || showAddNewRow || row.paymentEntry.status !== "COMPLETED"}
                              onClick={() => { setShowInvoice(true); setDeleteDialogIndex(index) }}
                            >
                              <ReceiptIcon sx={{ fontSize: "2rem" }} />
                            </Button>
                          </Tooltip>
                          <Button
                            sx={{ color: "red" }}
                            onClick={() => {
                              setDeleteDialogIndex(index);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: "2rem" }} />
                          </Button>
                        </>
                      )}
                    </FlexBetween>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No activities enrolled yet. Add a new activity below.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {showAddNewRow ? (
              <TableRow>
                <ActivityMembershipSelector
                  onSelect={handleActivityMembershipChange}
                />
                <TableCell>
                  <DateTimeField
                    format="DATE"
                    value={newRow.registrationDate}
                    onChange={(value) =>
                      handleNewRowChange(
                        "registrationDate",
                        value
                      )}
                  />
                </TableCell>
                <TableCell>
                  <DateTimeField
                    format="DATE"
                    value={newRow.membershipStartDate}
                    onChange={(value) =>
                      handleNewRowChange(
                        "membershipStartDate",
                        value
                      )}
                  />
                </TableCell>
                <TableCell>
                  <DateTimeField
                    disabled={validMembershipTypes.includes(newRow.membershipType) || !newRow.membershipStartDate}
                    format="DATE"
                    minDateTime={newRow.membershipStartDate}
                    value={getEndDateBySubscriptionPlan(newRow.membershipStartDate, newRow.membershipType)}
                    onChange={(value) =>
                      handleNewRowChange(
                        "membershipEndDate",
                        value
                      )}
                  />
                </TableCell>
                {isEnabled(FEATURE_KEYS.PAYMENT_DATE) &&
                  <TableCell sx={{ color: newRow.paymentEntry.status === "COMPLETED" ? "" : "red" }}>
                    {
                      <DateTimeField
                        format="DATE"
                        value={newRow.paymentEntry.paymentDate}
                        onChange={(value) =>
                          handleNewRowChange("paymentEntry.paymentDate", value)}
                      />
                    }
                  </TableCell>
                }
                <TableCell>
                  <Typography variant="body1">
                    {new Date(newRow.membershipStartDate) <= new Date() && new Date(newRow.membershipEndDate) >= new Date() ?
                      <Box color="green" fontWeight="bold">
                        ACTIVE
                      </Box>
                      :
                      <Box color="red" fontWeight="bold">
                        INACTIVE
                      </Box>
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <FlexEvenly>
                    <Button
                      sx={{ background: "green" }}
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      sx={{ color: "red" }}
                      onClick={() => setShowAddNewRow(false)}
                    >
                      <CloseIcon />
                    </Button>
                  </FlexEvenly>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={100}>
                  <IconButton
                    disabled={editIndex != null || showAddNewRow}
                    sx={{
                      color: "whitesmoke",
                      backgroundColor: "blue",
                      ":hover": {
                        backgroundColor: "darkblue",
                        color: "white",
                      },
                    }}
                    onClick={() => setShowAddNewRow(true)}
                  >
                    <AddIcon sx={{ color: "white" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {loading && <Loading />}
      {deleteDialogOpen && <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        displayData={tableData[deleteDialogIndex].activity?.activityType}
        id={deleteDialogIndex}
      />}
      {
        showInvoice && <StudentInvoice
          open={showInvoice}
          onClose={() => setShowInvoice(false)}
          studentData={{ ...studentData, studentId }}
          activityData={tableData[deleteDialogIndex]}
        />
      }
      <PaymentEntryDialog open={open} setOpen={setOpen} onSave={() => {
        setOpen(false);
        handleAddNewRow();
      }} paymentEntry={paymentEntry} setPaymentEntry={setPaymentEntry} paymentStatus={PAYMENT_STATUS} paymentType={PAYMENT_TYPE} />
    </>
  );
};

EnrolledActivitiesTableStudent.propTypes = {
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  studentData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      activity: PropTypes.object,
      membershipType: PropTypes.string,
      registrationDate: PropTypes.string,
      membershipStartDate: PropTypes.string,
      membershipEndDate: PropTypes.string,
      membershipStatus: PropTypes.string,
      assignmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};
export default EnrolledActivitiesTableStudent;
