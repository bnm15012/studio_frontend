import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Add, Cancel, Close, Delete, Edit, Receipt, Save } from "@mui/icons-material";
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
  daysPerWeek: 0,
  paymentEntry: {
    payeeType: "STUDENT",
    actualAmount: 0,
    amount: 0,
    paymentDate: getCurrentDateTimeUTC(),
    status: PAYMENT_STATUS[0].value,
    paymentType: PAYMENT_TYPE[0].value,
  }
};
const EnrolledActivitiesTableStudent = ({ studentId, data, studentData }) => {
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
    updatedData[index][field] = value;
    setTableData(updatedData);
  };

  const handleSave = async (index) => {
    if (!tableData[index].activity) {
      showAlert("Activity must be selected!");
      return;
    }

    if (!tableData[index].membershipType) {
      showAlert("Membership plan must be selected!");
      return;
    }
    tableData[index].membershipEndDate = getEndDateBySubscriptionPlan(tableData[index].membershipStartDate, tableData[index].membershipType.split()[0])
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
    newRow.membershipEndDate = getEndDateBySubscriptionPlan(newRow.membershipStartDate, newRow.membershipType.split()[0])
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
      newRow["paymentEntry"] = paymentEntry;
      newRow["paymentEntry"]["paymentDate"] = newRow['registrationDate'];
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
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleActivityMembershipChange = async (
    index,
    activity,
    membershipType,
    daysPerWeek,
    amount
  ) => {
    setLoading(true);
    if (index !== null) {
      const updatedData = [...tableData];
      updatedData[index].activityName = activity?.activityType;
      updatedData[index].membershipType = membershipType;
      if (activity && membershipType) {
        updatedData[index].daysPerWeek = daysPerWeek;
        updatedData[index].activityAmount = amount
      }
      setTableData(updatedData);
    } else {
      newRow.activityName = activity?.activityType;
      if (activity && membershipType) {
        newRow.membershipType = membershipType;
        newRow.daysPerWeek = daysPerWeek;
        newRow.activityAmount = amount
        paymentEntry.amount = amount;
        paymentEntry.actualAmount = amount;
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Membership</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Registration Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Membership Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Membership End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Membership Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
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
                  <TableCell>
                    {getLocalDateTime(row.registrationDate)}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <DateTimeField
                        format="DATE"
                        value={newRow.membershipStartDate}
                        onChange={(value) =>
                          handleInputChange(index, "membershipStartDate", value)}
                      />
                    ) : (
                      getLocalDateTime(row.membershipStartDate)
                    )}
                  </TableCell>
                  <TableCell>
                    {
                      row.membershipStartDate && row.membershipType && getLocalDateTime(getEndDateBySubscriptionPlan(row.membershipStartDate, row.membershipType.split()[0]))
                    }
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color:
                        row.membershipStatus === "ACTIVE" ? "green" : "red",
                    }}
                  >
                    {editIndex === index ? (
                      <TextField
                        variant="standard"
                        value={row.membershipStatus}
                        disabled
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "membershipStatus",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    ) : (
                      row.membershipStatus
                    )}
                  </TableCell>
                  <TableCell>
                    <FlexBetween gap={1}>
                      {editIndex === index ? (
                        <>
                          <Button
                            variant="contained"
                            onClick={() => handleSave(index)}
                          >
                            <Save />
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ background: "red" }}
                            onClick={() => handleEdit(null)}
                          >
                            <Cancel />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            disabled={editIndex != null || showAddNewRow}
                            variant="contained"
                            onClick={() => handleEdit(index)}
                          >
                            <Edit />
                          </Button>
                          <Tooltip title={row.paymentEntry.status !== "COMPLETED" ? "Payment is still pending or it's failed" : "View Invoice"}>
                            <Button
                              disabled={editIndex != null || showAddNewRow || row.paymentEntry.status !== "COMPLETED"}
                              variant="contained"
                              onClick={() => { setShowInvoice(true); setDeleteDialogIndex(index) }}
                            >
                              <Receipt />
                            </Button>
                          </Tooltip>
                          <Button
                            variant="contained"
                            sx={{ background: "red" }}
                            onClick={() => {
                              setDeleteDialogIndex(index);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
                          </Button>
                        </>
                      )}
                    </FlexBetween>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No activities enrolled yet. Add a new activity below.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {showAddNewRow ? (
              <TableRow>
                <ActivityMembershipSelector
                  onSelect={(activity, membershipType, daysPerWeek, amount) =>
                    handleActivityMembershipChange(
                      null,
                      activity,
                      membershipType,
                      daysPerWeek,
                      amount
                    )
                  }
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
                  {
                    newRow.membershipStartDate && newRow.membershipType && getLocalDateTime(getEndDateBySubscriptionPlan(newRow.membershipStartDate, newRow.membershipType.split()[0]))
                  }
                </TableCell>
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
                      variant="contained"
                      sx={{ background: "green" }}
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ background: "red" }}
                      onClick={() => setShowAddNewRow(false)}
                    >
                      <Close />
                    </Button>
                  </FlexEvenly>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <IconButton
                    disabled={editIndex != null || showAddNewRow}
                    sx={{
                      color: "whitesmoke",
                      backgroundColor: "green",
                      ":hover": {
                        backgroundColor: "darkgreen",
                        color: "white",
                      },
                    }}
                    onClick={() => setShowAddNewRow(true)}
                  >
                    <Add sx={{ color: "white" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
