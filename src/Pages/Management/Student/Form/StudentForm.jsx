import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FlexBetweenColumn from "../../../../Components/FlexBetweenColumn";
import FlexBetween from "../../../../Components/FlexBetween";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../utils/Alert";
import Loading from "../../../../Components/Loading/Loading";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import {
  addStudentAPI,
  deleteStudentAPI,
  getStudentByIdAPI,
  updateStudentAPI,
} from "../Student.api";
import EditableData from "../../../../Components/EditableData";
import ImageComponent from "../../../../Components/ImageComponent";
import {
  ArrowBack,
  Cancel,
  Delete,
  Edit,
} from "@mui/icons-material";
import { compareData } from "../../../../utils/globalFuns";
import DeleteDialog from "../../../../Components/DeleteDialog";
import AssignActivity from "../Activity/AssignActivity";
import PropTypes from "prop-types";

const initialData = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  emergencyContactNumber: "",
  address: "",
  branchId: null,
  imageUrl: null,
};
const StudentForm = ({ page, ID }) => {
  const theme = useTheme();
  const showAlert = useAlert();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState();
  const [newStudentData, setNewStudentData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchStudentData = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data, message } = await getStudentByIdAPI({
        id: ID,
        token,
      });
      if (success) {
        setStudentData(data);
        setNewStudentData(data);
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch student", "error");
    }
    setLoading(false);
  }, [ID, showAlert, token]);

  const setImage = (imgUrl) => {
    setNewStudentData((prevData) => ({ ...prevData, ["imageUrl"]: imgUrl }));
  };

  const validateRow = (row) => {
    if (
      !row.name ||
      !row.email ||
      !row.phone ||
      !row.emergencyContactNumber
    ) {
      showAlert("All fields are required!", "error");
      return false;
    }

    return true;
  };

  const saveNewEditStudentData = async () => {
    if (!validateRow(newStudentData)) {
      return;
    }
    try {
      if (compareData(studentData, newStudentData)) {
        showAlert("Data is already upto date !");
        setIsEdit(false);
      } else {
        setLoading(true);
        if (ID === "NEW") {
          const { data, success, message } = await addStudentAPI({
            studentData: newStudentData,
            token,
          });
          if (success) {
            showAlert(message, "success");
            setIsEdit(false);
            navigate(`/management/student/${data.studentId}`);
          } else {
            showAlert(message, "error");
            navigate(`/management/student`);
          }
        } else {
          const { success, message } = await updateStudentAPI({
            studentId: ID,
            studentData: newStudentData,
            token,
          });
          if (success) {
            setIsEdit(false);
            setStudentData(newStudentData);
            showAlert(message, "success");
          } else {
            showAlert(message, "error");
          }
        }
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to save/update student", "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const { success, message } = await deleteStudentAPI({
        studentId: ID,
        token,
      });
      if (success) {
        navigate(`/management/student`);
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete student", "error");
    }
  };

  useEffect(() => {
    if (ID === "NEW") {
      initialData["branchId"] = currentBranch.branchId;
      setStudentData(initialData);
      setNewStudentData(initialData);
      setIsEdit(true);
    } else !studentData && fetchStudentData();
  }, [ID, fetchStudentData, studentData, currentBranch.branchId]);

  return (
    <FlexBetweenColumn sx={{ p: 1, gap: 1 }}>
      {loading && <Loading />}
      <FlexBetween sx={{ width: '100%', p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: theme.shadows[2] }}>
        <FlexBetween alignItems={"center"} gap={2}>
          <IconButton onClick={() => navigate(`/management/${page}`)}>
            <ArrowBack sx={{ color: "black" }} />
          </IconButton>
          <Typography variant="h5" fontWeight={"bold"}>
            Student Info
          </Typography>
        </FlexBetween>

        <Box>
          {!isEdit ? (
            <FlexBetween gap={2}>
              <IconButton
                disabled={loading}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Delete sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() => setIsEdit(true)}
              >
                <Edit sx={{ color: "blue" }} />
              </IconButton>
              <IconButton>
                <CloudDoneIcon sx={{ color: "green" }} />
              </IconButton>
            </FlexBetween>
          ) : (
            <FlexBetween gap={2}>
              <IconButton
                disabled={loading}
                onClick={() => { setIsEdit(false); if (ID == "NEW") navigate("/management/student/"); }}
              >
                <Cancel sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() => saveNewEditStudentData()}
              >
                <CloudUploadIcon sx={{ color: "green" }} />
              </IconButton>
            </FlexBetween>
          )}
        </Box>
      </FlexBetween>
      <Divider />
      {newStudentData && (
        <FlexBetween
          my={1}
          p={2}
          backgroundColor={theme.palette.background.paper}
          sx={{
            boxShadow: theme.shadows[7],
          }}
        >
          <FlexBetweenColumn flexGrow={1} p={1} gap={1}>
            <Typography variant="h6" fontWeight={"bolder"}>
              Basic Details
            </Typography>
            <Divider />
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"name"}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  required: true,
                  pattern: "^[a-zA-Z ]+$",
                  errorMessage: "Name must only contain letters and spaces.",
                }}
              />
              <EditableData
                fieldName={"email"}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  required: true,
                  pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                  errorMessage: "Invalid email format.",
                }}
              />
            </FlexBetween>

            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"dob"}
                inputType="DATE"
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
              <EditableData
                fieldName={"membershipStatus"}
                inputType="NONE"
                diffStyle={{
                  fontWeight: "bold",
                  color:
                    newStudentData["membershipStatus"] === "ACTIVE"
                      ? "green"
                      : "red",
                }}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
            </FlexBetween>
            <Typography variant="h6" fontWeight={"bolder"} mt={2}>
              Contact Details
            </Typography>
            <Divider />
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"phone"}
                label={"Mobile"}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  required: true,
                  pattern: "^\\d{10}$",
                  errorMessage: "Phone number must be 10 digits.",
                }}
              />
              <EditableData
                label={"EmergencyContact"}
                fieldName={"emergencyContactNumber"}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  required: true,
                  pattern: "^\\d{10}$",
                  errorMessage: "Phone number must be 10 digits.",
                }}
              />
            </FlexBetween>
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"address"}
                data={newStudentData}
                setData={setNewStudentData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
            </FlexBetween>
          </FlexBetweenColumn>
          <ImageComponent
            dirName="student"
            setImage={setImage}
            image={newStudentData?.imageUrl}
            isCircular={false}
            allowEdit={isEdit}
          />
        </FlexBetween>
      )}
      {ID !== "NEW" && studentData && (
        <>
          <FlexBetweenColumn
            my={1}
            p={2}
            backgroundColor={theme.palette.background.paper}
            sx={{
              boxShadow: theme.shadows[10],
            }}
          >
            <AssignActivity studentData={studentData} studentId={ID} />
          </FlexBetweenColumn>
          {deleteDialogOpen &&
            <DeleteDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={handleDelete}
              displayData={studentData.name}
              id={studentData.studentId}
            />}
        </>
      )}
    </FlexBetweenColumn>
  );
};

StudentForm.propTypes = {
  page: PropTypes.string.isRequired,
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default StudentForm;
