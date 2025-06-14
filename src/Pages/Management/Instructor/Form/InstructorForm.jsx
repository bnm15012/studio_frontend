import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FlexBetweenColumn from "../../../../Components/FlexBetweenColumn";
import FlexBetween from "../../../../Components/FlexBetween";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../utils/Alert";
import Loading from "../../../../Components/Loading/Loading";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EditableData from "../../../../Components/EditableData";
import ImageComponent from "../../../../Components/ImageComponent";
import {
  ArrowBack,
  Cancel,
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  addInstructorAPI,
  deleteInstructorAPI,
  getInstructorByIdAPI,
  updateInstructorAPI,
} from "../Instructor.api";
import AssignActivity from "../Activity/AssignActivity";
import PropTypes from "prop-types";
import DeleteDialog from "../../../../Components/DeleteDialog";

const initialData = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  imageUrl: "",
  emergencyContactNumber: "",
  address: "",
  instructorStatus: "INACTIVE",
  bankAccountDetails: {
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    upiId: "",
  },
  branchEntry: {},
};
const InstructorForm = ({ page, ID }) => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState();
  const [newInstructorData, setNewInstructorData] = useState(initialData);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankAccountDetails, setBankAccountDetails] = useState();

  const fetchInstructorData = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data, message } = await getInstructorByIdAPI({
        id: ID,
        token,
      });
      if (success) {
        setInstructorData(data);
        setBankAccountDetails(data.bankAccountDetails);
        setNewInstructorData(data);
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch instructor", "error");
    }
    setLoading(false);
  }, [ID, showAlert, token]);

  const setImage = (imgUrl) => {
    setNewInstructorData((prevData) => ({ ...prevData, ["imageUrl"]: imgUrl }));
  };

  const saveNewEditInstructorData = async () => {
    if (!newInstructorData.name?.trim()) {
      showAlert("Name is required", "error");
      return;
    }
    try {
      newInstructorData["bankAccountDetails"] = bankAccountDetails;
      setLoading(true);
      if (ID === "NEW") {
        const { data, success, message } = await addInstructorAPI({
          instructorData: newInstructorData,
          token,
        });
        if (success) {
          showAlert(message, "success");
          setIsEdit(false);
          navigate(`/management/instructor/${data.instructorId}`);
        } else {
          showAlert(message, "error");
          navigate(`/management/instructor`);
        }
      } else {
        const { success, message } = await updateInstructorAPI({
          instructorId: ID,
          instructorNewData: newInstructorData,
          token,
        });
        if (success) {
          setIsEdit(false);
          setInstructorData(newInstructorData);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to save/update instructor", "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const { success, message } = await deleteInstructorAPI({
        instructorId: ID,
        token,
      });
      if (success) {
        navigate(`/management/instructor`);
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete instructor", "error");
    }
  };

  useEffect(() => {
    if (ID === "NEW") {
      initialData["branchEntry"]["branchId"] = currentBranch.branchId;
      setInstructorData(initialData);
      setNewInstructorData(initialData);
      setIsEdit(true);
    } else !instructorData && fetchInstructorData();
  }, [ID, fetchInstructorData, instructorData, currentBranch.branchId]);

  return (
    <FlexBetweenColumn sx={{ p: 1, gap: 1 }}  >
      {loading && <Loading />}
      <FlexBetween sx={{ width: '100%', p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
        <FlexBetween alignItems={"center"} gap={2}>
          <IconButton onClick={() => navigate(`/management/${page}`)}>
            <ArrowBack sx={{ color: "black" }} />
          </IconButton>
          <Typography variant="h5" fontWeight={"bold"}>
            Instructor Info
          </Typography>
        </FlexBetween>

        <Box>
          {!isEdit ? (
            <FlexBetween gap={2}>
              <IconButton
                disabled={loading}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
              >
                <Delete sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() => setIsEdit(true)}
                sx={{ '&:hover': { backgroundColor: 'rgba(0,0,255,0.1)' } }}
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
                onClick={() => { setIsEdit(false); if (ID == "NEW") navigate(`/management/${page}/`); }}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
              >
                <Cancel sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() => saveNewEditInstructorData()}
                sx={{ '&:hover': { backgroundColor: 'rgba(0,0,255,0.1)' } }}
              >
                <CloudUploadIcon sx={{ color: "blue" }} />
              </IconButton>
            </FlexBetween>
          )}
        </Box>
      </FlexBetween>
      <Divider />
      {newInstructorData && (
        <FlexBetween
          my={1}
          p={2}
          sx={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Customize the shadow as needed
          }}
        >
          <FlexBetweenColumn flexGrow={1} p={1} gap={1}>
            <Typography variant="h6" fontWeight={"bolder"}>
              Personal Details
            </Typography>
            <Divider />
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"name"}
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              // validation={{
              //   pattern: "^[a-zA-Z ]{2,50}$", // 2 to 50 alphabetic characters and spaces
              //   errorMessage: "Name should be 2-50 characters.",
              // }}
              />
              <EditableData
                fieldName={"email"}
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              // validation={{
              //   pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$", // Valid email format
              //   errorMessage: "Invalid email format.",
              // }}
              />
            </FlexBetween>
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"instructorStatus"}
                inputType="NONE"
                diffStyle={{
                  fontWeight: "bold",
                  color:
                    newInstructorData["instructorStatus"] === "ACTIVE"
                      ? "green"
                      : "red",
                }}
                data={newInstructorData}
              />
              <EditableData
                fieldName={"dob"}
                inputType="DATE"
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
            </FlexBetween>
            <Typography variant="h6" fontWeight={"bolder"} mt={3}>
              Contact Details
            </Typography>
            <Divider />
            <FlexBetween flexWrap={"wrap"}>
              <EditableData
                fieldName={"phone"}
                label={"Mobile"}
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  pattern: "^[0-9]{10}$", // 10 digits
                  errorMessage: "Phone number must be 10 digits.",
                }}
              />
              <EditableData
                fieldName={"emergencyContactNumber"}
                label={"EmergencyContact"}
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                validation={{
                  pattern: "^[0-9]{10}$", // 10 digits
                  errorMessage: "Phone number must be 10 digits.",
                }}
              />
              <EditableData
                fieldName={"address"}
                data={newInstructorData}
                setData={setNewInstructorData}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
              />
            </FlexBetween>
            <Typography variant="h6" fontWeight={"bolder"} mt={3}>
              Bank Account Details
            </Typography>
            <Divider />
            <FlexBetween gap={1} flexWrap={"wrap"}>
              <EditableData
                isEdit={isEdit}
                data={newInstructorData.bankAccountDetails}
                fieldName={"accountNumber"}
                setData={setBankAccountDetails}
              // validation={{
              //   required: true,
              //   pattern: "^[0-9]{9,18}$", // 9 to 18 digits
              //   errorMessage: "Account number must be 9-18 digits.",
              // }}
              />
              <EditableData
                isEdit={isEdit}
                data={newInstructorData.bankAccountDetails}
                fieldName={"ifscCode"}
                setData={setBankAccountDetails}
              // validation={{
              //   required: true,
              //   pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", // IFSC format
              //   errorMessage: "Invalid IFSC code.",
              // }}
              />
            </FlexBetween>
            <FlexBetween gap={1} flexWrap={"wrap"}>
              <EditableData
                isEdit={isEdit}
                data={newInstructorData.bankAccountDetails}
                fieldName={"bankName"}
                setData={setBankAccountDetails}
              // validation={{
              //   required: true,
              //   pattern: "^[a-zA-Z ]+$", // Letters and spaces
              //   errorMessage:
              //     "Bank name can only contain letters and spaces.",
              // }}
              />
              <EditableData
                isEdit={isEdit}
                data={newInstructorData.bankAccountDetails}
                fieldName={"branchName"}
                setData={setBankAccountDetails}
              // validation={{
              //   required: true,
              //   pattern: "^[a-zA-Z ]+$", // Letters and spaces
              //   errorMessage:
              //     "Branch name can only contain letters and spaces.",
              // }}
              />
            </FlexBetween>
            <FlexBetween gap={1} flexWrap={"wrap"}>
              <EditableData
                isEdit={isEdit}
                data={newInstructorData.bankAccountDetails}
                fieldName={"upiId"}
                setData={setBankAccountDetails}
              // validation={{
              //   required: false,
              //   pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z]+$", // UPI ID format
              //   errorMessage: "Invalid UPI ID format.",
              // }}
              />
            </FlexBetween>
          </FlexBetweenColumn>
          <ImageComponent
            setImage={setImage}
            image={newInstructorData?.imageUrl}
            isCircular={false}
            allowEdit={isEdit}
          />
        </FlexBetween>
      )}
      {ID !== "NEW" && instructorData && (
        <>
          <FlexBetweenColumn
            my={1}
            p={2}
            sx={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Customize the shadow as needed
            }}
          >
            <AssignActivity instructorData={instructorData} instructorId={ID} />
          </FlexBetweenColumn>
          {deleteDialogOpen &&
            <DeleteDialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={handleDelete}
              displayData={instructorData.name}
              id={ID}
            />
          }
        </>
      )}
    </FlexBetweenColumn>
  );
};

InstructorForm.propTypes = {
  page: PropTypes.string.isRequired,
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default InstructorForm;
