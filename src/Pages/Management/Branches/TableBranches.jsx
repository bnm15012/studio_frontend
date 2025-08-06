import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  Paper,
  IconButton,
  TextField,
  Switch,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import GroupIcon from '@mui/icons-material/Group';
import { useAlert } from "../../../utils/Alert";
import {
  addBranchAPI,
  toggleBranchAPI,
  updateBranchAPI,
} from "./Branches.api";
import Loading from "../../../Components/Loading/Loading";
import FlexEvenly from "../../../Components/FlexEvenly";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setBranches, setSelectedBranch } from "../../../state/branchSlice";
import FlexBetween from "../../../Components/FlexBetween";
import { useNavigate } from "react-router-dom";

const TableWithEditAddDelete = ({
  initialData,
  token,
  newRow,
  currentBranch,
  setNewRow,
  studioId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const showAlert = useAlert();
  const [data, setData] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (index) => setEditingRowIndex(index);

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const validateRow = (row) => {
    if (
      !row.name ||
      !row.address ||
      !row.city ||
      !row.state ||
      !row.pincode ||
      !row.phone
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
        const newBranchData = { ...newRow, studioId };
        const {
          data: addedBranchData,
          success,
          message,
        } = await addBranchAPI({
          branchData: newBranchData,
          token,
        });
        if (success) {
          setData((prev) => {
            const updated = [...prev, addedBranchData];
            dispatch(setBranches((updated)));
            return updated;
          });
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
        setNewRow(null);
      } else {
        const updatedBranchData = data[index];
        if (!validateRow(updatedBranchData)) return;
        const {
          data: updatedData,
          success,
          message,
        } = await updateBranchAPI({
          branchId: updatedBranchData.branchId,
          branchData: updatedBranchData,
          token,
        });
        if (success) {
          const updatedList = data.map((branch) =>
            branch.branchId === updatedData.branchId
              ? { ...branch, ...updatedData }
              : branch
          );
          setData(updatedList);
          dispatch(setBranches((updatedList)));
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

  const hanldeToggleBranchState = async (branchId, active) => {
    setLoading(true);
    try {
      const { data: updatedData, success } = await toggleBranchAPI({ branchId, active, token });
      if (success) {
        const updatedList = data.map((branch) =>
          branch.branchId === updatedData.branchId
            ? { ...branch, ...updatedData }
            : branch
        );
        setData(updatedList);
        dispatch(setBranches(updatedList));
        showAlert("Branch state updated successfully", "success");
      } else {
        showAlert("Failed to update branch state", "error");
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

  const handleChange = (value, index, field) => {
    if (index === null) {
      setNewRow({ ...newRow, [field]: value });
    } else {
      setData((prev) =>
        prev.map((tmp, i) =>
          i === index ? { ...tmp, [field]: value } : tmp
        )
      );
    }
  };

  return (
    <StyledTableContainer component={Paper}>
      {loading && <Loading />}
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
          <StyledTableRow>
            <StyledTableCell sx={{ textWrap: "nowrap", fontWeight: "bold", color: "#1976d2" }}>
              S. No.
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Name
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Address
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              City
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              State
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Pincode
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Phone
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Active
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Actions
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={row.branchId}
            >
              {editingRowIndex === index ? (
                <>
                  <StyledTableCell>
                    {index + 1}
                  </StyledTableCell>
                  {
                    [
                      "name",
                      "address",
                      "city",
                      "state",
                      "pincode",
                      "phone",
                    ].map((field) => (<StyledTableCell key={field}>
                      <TextField
                        variant="standard"
                        value={row[field]}
                        onChange={(e) => handleChange(e.target.value, index, field)}
                      />
                    </StyledTableCell>
                    ))}
                  <StyledTableCell>
                    <Switch
                      disabled={editingRowIndex !== index || row.branchId === currentBranch.branchId}
                      checked={row["isActive"]}
                      onChange={(e) => { handleChange(e.target.checked, index, "isActive"); }}
                      sx={{ color: "blue" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <FlexBetween>
                      <IconButton
                        sx={{ color: "blue" }}
                        onClick={() => handleSave(index)}
                      >
                        <Save />
                      </IconButton>
                      <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                        <Cancel />
                      </IconButton>
                    </FlexBetween>
                  </StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell>
                    {index + 1}
                  </StyledTableCell>
                  {[
                    "name",
                    "address",
                    "city",
                    "state",
                    "pincode",
                    "phone",
                  ].map((field) => (
                    <StyledTableCell key={field}>
                      {row[field]}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell>
                    <Switch
                      disabled={editingRowIndex !== null || newRow != null}
                      checked={row["isActive"]}
                      onChange={(e) => { hanldeToggleBranchState(row.branchId, e.target.checked); }}
                      sx={{ color: "blue" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      disabled={(editingRowIndex !== index && editingRowIndex !== null) || newRow !== null}
                      sx={{ color: "blue" }}
                      onClick={() => handleEdit(index)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      disabled={editingRowIndex !== null || newRow !== null || !row.isActive}
                      sx={{ color: "blue" }}
                      onClick={() => {
                        dispatch(setSelectedBranch(row))
                        navigate(`/management/branch/${row.branchId}`);
                      }}
                    >
                      <GroupIcon />
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
                  No branch data available. Add by clicking the &quot;+&quot; button!
                </FlexEvenly>
              </StyledTableCell>
            </StyledTableRow>
          )}
          {newRow && (
            <StyledTableRow>
              <StyledTableCell>
                NEW
              </StyledTableCell>
              {
                [
                  "name",
                  "address",
                  "city",
                  "state",
                  "pincode",
                  "phone",
                ].map((field) => (
                  <StyledTableCell key={field}>
                    <TextField
                      variant="standard"
                      value={newRow[field]}
                      onChange={(e) => handleChange(e.target.value, null, field)}
                    />
                  </StyledTableCell>
                ))}
              <StyledTableCell>
                <Switch
                  checked={newRow["isActive"]}
                  onChange={(e) => handleChange(e.target.checked, null, "isActive")}
                  sx={{ color: "blue" }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <FlexBetween>
                  <IconButton
                    sx={{ color: "blue" }}
                    onClick={() => handleSave(null)}
                  >
                    <Save />
                  </IconButton>
                  <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                    <Cancel />
                  </IconButton>
                </FlexBetween>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer >
  );
};

TableWithEditAddDelete.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  currentBranch: PropTypes.shape({
    branchId: PropTypes.number,
  }).isRequired,
  token: PropTypes.string.isRequired,
  newRow: PropTypes.object,
  setNewRow: PropTypes.func.isRequired,
  studioId: PropTypes.number.isRequired,
};
export default TableWithEditAddDelete;
