import { useEffect, useState } from "react";
import {
  TableBody,
  TableHead,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
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
import { addActivityMembershipTypeAPI, deleteActivityMembershipTypeAPI, updateActivityMembershipTypeAPI } from "./MembershipType.api";
import { useDispatch } from "react-redux";
import { addMemberShipTypes, deleteMemberShipTypes, updateMemberShipTypes } from "../../../state/activityMembershipTypeSlice";
import { validMembershipTypes } from "../Activity/Activities.constants";

const MembershipTypesTable = ({
  initialData,
  token,
  newRow,
  setNewRow,
  studioId,
}) => {
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
      setData((prev) =>
        prev.map((row, i) =>
          i === editingRowIndex ? originalRow : row
        )
      );
    }
    setEditingRowIndex(null);
    setOriginalRow(null);
  };

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const validateRow = (value, list) => {
    if (!value || value.trim() === "") {
      showAlert("Membership type cannot be empty!", "error");
      return false;
    }
    if (list.includes(value.trim())) {
      showAlert("Membership type already exists!", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (index) => {
    setLoading(true);

    try {
      if (newRow !== null) {
        if (!validateRow(newRow.activityMembershipType, [
          ...validMembershipTypes,
          ...data.map((d) => d.activityMembershipType),
        ])) {
          setLoading(false);
          return;
        }
        const newMembershipType = { ...newRow, studioId };
        const {
          data: addedMembershipType,
          success,
          message,
        } = await addActivityMembershipTypeAPI({
          membershipTypeData: newMembershipType,
          token,
        });
        if (success) {
          setData((prev) => [...prev, addedMembershipType]);
          dispatch(addMemberShipTypes(addedMembershipType));
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
        setNewRow(null);
      } else {
        const updatedMembershipType = data[index];
        const existingTypes = data
          .filter((_, i) => i !== index)
          .map((d) => d.activityMembershipType);

        if (!validateRow(updatedMembershipType.activityMembershipType, existingTypes)) {
          setLoading(false);
          return;
        }
        const {
          data: updatedData,
          success,
          message,
        } = await updateActivityMembershipTypeAPI({
          membershipTypeData: updatedMembershipType,
          token,
        });
        if (success) {
          setData((prev) =>
            prev.map((expense, i) =>
              i === index ? { ...expense, ...updatedData } : expense
            )
          );
          dispatch(updateMemberShipTypes(updatedData));
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
      const membershipTypeId = data[index].activityMembershipTypeId;
      const { success, message } = await deleteActivityMembershipTypeAPI({ membershipTypeId, token });
      if (success) {
        setData((prev) => prev.filter((_, i) => i !== index));
        dispatch(deleteMemberShipTypes(membershipTypeId));
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
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
        prev.map((expense, i) =>
          i === index ? { ...expense, [field]: value } : expense
        )
      );
    }
  };
  return (
    <StyledTableContainer component={Paper}>
      {loading && <Loading />}
      <StyledTable sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
          <StyledTableRow>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              S. No.
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Package Name
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Actions
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={row.membershipTypeId}
            >
              {editingRowIndex === index ? (
                <>
                  <StyledTableCell>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      variant="standard"
                      value={row.activityMembershipType}
                      onChange={(e) => handleChange(e.target.value, index, "activityMembershipType")}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      sx={{ color: "blue" }}
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
                  <StyledTableCell>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{row.activityMembershipType}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      sx={{ color: "blue" }}
                      onClick={() => handleEdit(index)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setDeleteDialogIndex(index);
                      }}
                    >
                      <Delete />
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
                  No Packages data available. Add by clicking the &quot;+&quot; button!
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
                  value={newRow.activityMembershipType}
                  onChange={(e) => handleChange(e.target.value, null, "activityMembershipType")}
                />
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  sx={{ color: "blue" }}
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
      </StyledTable>
      {
        deleteDialogOpen && (
          <DeleteDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            displayData={`expense entry with amount ${data[deleteDialogIndex].activityMembershipType}`}
            id={deleteDialogIndex}
          />
        )
      }
    </StyledTableContainer>
  );
};

MembershipTypesTable.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      activityMembershipTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      activityMembershipType: PropTypes.string.isRequired,
    })
  ).isRequired,
  token: PropTypes.string.isRequired,
  newRow: PropTypes.object,
  setNewRow: PropTypes.func.isRequired,
  studioId: PropTypes.number.isRequired,
};
export default MembershipTypesTable;
