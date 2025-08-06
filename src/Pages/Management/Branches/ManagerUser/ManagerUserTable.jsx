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
import { useAlert } from "../../../../utils/Alert";
import Loading from "../../../../Components/Loading/Loading";
import FlexEvenly from "../../../../Components/FlexEvenly";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import FlexBetween from "../../../../Components/FlexBetween";
import { addManagerAPI, updateManagerAPI } from "./manageruser.api";

const ManagerUserTable = ({
  initialData,
  token,
  newRow,
  selectedBranch,
  setNewRow,
}) => {
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
      !row.userName ||
      !row.email ||
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
        const newMnagerData = { ...newRow };
        const {
          data: addedBranchData,
          success,
          message,
        } = await addManagerAPI({
          managerData: newMnagerData,
          token,
        });
        if (success) {
          setData((prev) => [...prev, addedBranchData]);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
        setNewRow(null);
      } else {
        const updatedmanagerData = data[index];
        if (!validateRow(updatedmanagerData)) return;
        const {
          data: updatedData,
          success,
          message,
        } = await updateManagerAPI({
          userId: updatedmanagerData.userId,
          managerData: updatedmanagerData,
          token,
        });
        if (success) {
          setData((prev) =>
            prev.map((manager, i) =>
              i === index ? { ...manager, ...updatedData } : manager
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
            <StyledTableCell sx={{ textWrap: "nowrap", fontWeight: "bold", color: "#1976d2" }}>
              S. No.
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              UserName
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Email
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Phone
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Active
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2", width: "8rem" }}>
              Actions
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={row.userId}
            >
              {editingRowIndex === index ? (
                <>
                  <StyledTableCell>
                    {index + 1}
                  </StyledTableCell>
                  {["userName", "email"].map((field) => (
                    <StyledTableCell key={field}>
                      {row[field]}
                    </StyledTableCell>
                  ))}
                  {
                    ["phone"].map((field) => (<StyledTableCell key={field}>
                      <TextField
                        variant="standard"
                        value={row[field]}
                        onChange={(e) => handleChange(e.target.value, index, field)}
                      />
                    </StyledTableCell>
                    ))}
                  <StyledTableCell>
                    <Switch
                      disabled={editingRowIndex !== index || row.branchId === selectedBranch.branchId}
                      checked={row["enabled"]}
                      onChange={(e) => { handleChange(e.target.checked, index, "enabled"); }}
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
                  {["userName", "email", "phone"].map((field) => (
                    <StyledTableCell key={field}>
                      {row[field]}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell>
                    <Switch
                      disabled={true}
                      checked={row["enabled"]}
                      onChange={(e) => { handleChange(e.target.checked, index, "enabled"); handleEdit(index) }}
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
                  </StyledTableCell>
                </>
              )}
            </StyledTableRow>
          ))}
          {data.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={6}>
                <FlexEvenly>
                  No Manager data available. Add by clicking the &quot;+&quot; button!
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
                ["userName", "email", "phone"].map((field) => (
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
                  checked={newRow["enabled"]}
                  onChange={(e) => handleChange(e.target.checked, null, "enabled")}
                  sx={{ color: "blue" }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <FlexEvenly>
                  <IconButton
                    sx={{ color: "blue" }}
                    onClick={() => handleSave(null)}
                  >
                    <Save />
                  </IconButton>
                  <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                    <Cancel />
                  </IconButton>
                </FlexEvenly>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer >
  );
};

ManagerUserTable.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      enabled: PropTypes.bool,
    })
  ).isRequired,
  selectedBranch: PropTypes.shape({
    branchId: PropTypes.number,
  }).isRequired,
  token: PropTypes.string.isRequired,
  newRow: PropTypes.object,
  setNewRow: PropTypes.func.isRequired,
};
export default ManagerUserTable;
