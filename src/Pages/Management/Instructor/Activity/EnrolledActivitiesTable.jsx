import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Cancel, Close, Delete, Edit, Feed, Save } from "@mui/icons-material";
import ActivityMembershipSelector from "../../Activity/ActivityMembershipSelector";
import { useSelector } from "react-redux";
import { useAlert } from "../../../../utils/Alert";
import {
  assignActivityInstructorAPI,
  deletAassignedActivityInstructorAPI,
  editAssignedActivityInstructorAPI,
} from "./activityAssignment";
import FlexEvenly from "../../../../Components/FlexEvenly";
import Loading from "../../../../Components/Loading/Loading";
import { validateAndProcessDates } from "../../../../utils/validationConstraints";
import PropTypes from "prop-types";
import { getCurrentDateTimeUTC, getLocalDateTime } from "../../../../utils/DateUtil";
import DateTimeField from "../../../../Components/DateTimeField";
import DeleteDialog from "../../../../Components/DeleteDialog";
import { Upload } from "lucide-react";
import InstructorContract from "./IntructorContract";
import ContractDoc from "./ContractDoc";
import { StyledTableContainer } from "../../../../Components/StyledTableComponents";

const initialNewRowState = {
  activityName: "",
  assignedDate: getCurrentDateTimeUTC(),
  startDate: getCurrentDateTimeUTC(),
  endDate: null,
  membershipStatus: "INACTIVE",
  contractDocument: null,
};
const EnrolledActivitiesTableInstructor = ({ instructorId, data }) => {
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const [tableData, setTableData] = useState(data?.assignments || []);
  const [editIndex, setEditIndex] = useState(null);
  const [newRow, setNewRow] = useState(initialNewRowState);
  const [pastDataOfEditRow, setPastDataOfEditRow] = useState();
  const [showAddNewRow, setShowAddNewRow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogIndex, setDeleteDialogIndex] = useState(null);
  const [generateContractDoc, setGenerateContractDoc] = useState(false)

  const [uploadDisplayContract, setUploadDisplayContract] = useState(false)

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
    if (!tableData[index].activityName) {
      showAlert("Activity must be selected!");
    }
    if (tableData[index].endDate &&
      !validateAndProcessDates({
        startDate: tableData[index].startDate,
        endDate: tableData[index].endDate,
        showAlert,
      })
    ) {
      return;
    }
    try {
      setLoading(true);
      const { success, message } = await editAssignedActivityInstructorAPI({
        assignementData: tableData[index],
        assignmentID: tableData[index].assignmentId,
        token,
      });
      if (success) {
        setEditIndex(null);
        const updatedActivity = tableData[index];
        saveActivity(updatedActivity);
        showAlert(message, "success");
      } else {
        tableData[index] = pastDataOfEditRow;
        setTableData(tableData);
        showAlert(message, "error");
      }
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      showAlert("error in update assigned activity ", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (index) => {
    try {
      setLoading(true);
      const { success, message } = await deletAassignedActivityInstructorAPI({
        assignmentID: tableData[index].assignmentId,
        token,
      });
      if (success) {
        const updatedData = tableData.filter((_, i) => i !== index);
        setTableData(updatedData);
        showAlert(message, "success");
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
    if (newRow.endDate &&
      !validateAndProcessDates({
        startDate: newRow.startDate,
        endDate: newRow.endDate,
        showAlert,
      })
    ) {
      return;
    }

    setLoading(true);
    if (!newRow.activityName) return;
    try {
      newRow["instructorId"] = instructorId;
      const { success, message, data: newRowData } = await assignActivityInstructorAPI({
        assignementData: newRow,
        token,
      });
      if (success) {
        setTableData((prev) => [...prev, newRowData]);
        setNewRow(initialNewRowState);
        showAlert(message, "success");
        setShowAddNewRow(false);
      } else {
        showAlert(message, "error");
      }
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      showAlert("failed to assign new activity to instructor !");
    }
    setLoading(false);
  };

  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleActivityMembershipChange = async (index, activity) => {
    if (index !== null) {
      const updatedData = [...tableData];
      updatedData[index].activityName = activity?.activityType,
        setTableData(updatedData);
    } else {
      setNewRow((prev) => ({
        ...prev,
        activityName: activity?.activityType,
      }));
    }
  };

  return (
    <>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Registration Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Membership Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contract</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <TableRow key={index}>
                  {/* {editIndex === index ? (
                    <ActivityMembershipSelector
                      isMemberSHipToo={false}
                      selectedData={{
                        activity: row.activity,
                      }}
                      onSelect={(activity) =>
                        handleActivityMembershipChange(index, activity)
                      }
                    />
                  ) : ( */}
                  <>
                    <TableCell>
                      {row.activityName || "N/A"}
                    </TableCell>
                  </>
                  {/* )} */}
                  <TableCell>
                    {
                      getLocalDateTime(row.assignedDate)
                    }
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <DateTimeField
                        format="DATE"
                        value={row.startDate}
                        onChange={(value) => handleInputChange(index, "startDate", value)}
                      />
                    ) : (
                      getLocalDateTime(row.startDate)
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <DateTimeField
                        format="DATE"
                        minDateTime={row.startDate}
                        value={row.endDate}
                        onChange={(value) => handleInputChange(index, "endDate", value)}
                      />
                    ) : (
                      getLocalDateTime(row.endDate)
                    )}
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
                    {editIndex === index ? (
                      <Button
                        onClick={() => {
                          setUploadDisplayContract(true)
                          setDeleteDialogIndex(index);
                        }}
                      >
                        <Upload sx={{ fontSize: "2rem" }} />
                      </Button>
                    ) : (
                      row.contractDocument ?
                        <Button
                          sx={{ p: 0, m: 0, textWrap: "nowrap" }}
                          onClick={() => {
                            setUploadDisplayContract(true);
                            setDeleteDialogIndex(index);
                          }}
                        >
                          View Contract
                        </Button> :
                        <Typography
                          sx={{ textWrap: "nowrap", color: "grey" }}>
                          No Contract
                        </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <FlexEvenly gap={1}>
                      {editIndex === index ? (
                        <>
                          <Button
                            onClick={() => handleSave(index)}
                          >
                            <Save sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Button
                            sx={{ color: "red" }}
                            onClick={() => handleEdit(null)}
                          >
                            <Cancel sx={{ fontSize: "2rem" }} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            disabled={editIndex != null || showAddNewRow}
                            onClick={() => handleEdit(index)}
                          >
                            <Edit sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Button
                            disabled={editIndex != null || showAddNewRow}
                            onClick={() => { setGenerateContractDoc(true); setDeleteDialogIndex(index) }}
                          >
                            <Feed sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Button
                            sx={{ color: "red" }}
                            onClick={() => {
                              setDeleteDialogIndex(index);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete sx={{ fontSize: "2rem" }} />
                          </Button>
                        </>
                      )}
                    </FlexEvenly>
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
                  isMemberSHipToo={false}
                  onSelect={(activity, membershipType) =>
                    handleActivityMembershipChange(
                      null,
                      activity,
                      membershipType
                    )
                  }
                />
                <TableCell>
                  {
                    getLocalDateTime(newRow.assignedDate)
                  }
                </TableCell>

                <TableCell>
                  <DateTimeField
                    format="DATE"
                    value={newRow.startDate}
                    onChange={(value) => handleNewRowChange("startDate", value)}
                  />
                </TableCell>
                <TableCell>
                  <DateTimeField
                    format="DATE"
                    minDateTime={newRow.startDate}
                    value={newRow.endDate}
                    onChange={(value) => handleNewRowChange("endDate", value)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {new Date(newRow.startDate) < new Date() && new Date(newRow.endDate) > new Date() ?
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
                </TableCell>
                <TableCell>
                  <FlexEvenly>
                    <Button
                      variant="contained"
                      sx={{ background: "green" }}
                      onClick={handleAddNewRow}
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
                <TableCell align="center" colSpan={60}>
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
                    <Add sx={{ color: "white" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {
        generateContractDoc && <InstructorContract
          open={generateContractDoc}
          onClose={() => setGenerateContractDoc(false)}
          instructorData={{ ...data, instructorId }}
          activityData={tableData[deleteDialogIndex]}
        />
      }
      {
        uploadDisplayContract && <ContractDoc
          open={uploadDisplayContract}
          onClose={() => setUploadDisplayContract(false)}
          image={tableData[deleteDialogIndex]?.contractDocument}
          isEdit={editIndex === deleteDialogIndex}
          setImage={(image) => {
            const updatedData = [...tableData];
            updatedData[deleteDialogIndex].contractDocument = image;
            setTableData(updatedData);
          }}
        />
      }
      {loading && <Loading />}
      {deleteDialogOpen && <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        displayData={tableData[deleteDialogIndex].activity?.activityType}
        id={deleteDialogIndex}
      />}
    </>
  );
};

EnrolledActivitiesTableInstructor.propTypes = {
  instructorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  data: PropTypes.array.isRequired,
};
export default EnrolledActivitiesTableInstructor;
