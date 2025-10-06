import { useEffect, useState } from "react";
import {
    TableBody,
    TableHead,
    Paper,
    IconButton,
    TextField,
    MenuItem,
    Select,
    FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
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
import FlexBetween from "../../../Components/FlexBetween";
import { useDispatch } from "react-redux";
import { clientCruds } from "../../../api/all.api";

const TableWithEditAddDelete = ({
    initialData,
    token,
    clientTypes,
    newRow,
    setNewRow,
    startIndex,
}) => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEdit = (index) => setEditingRowIndex(index);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const validateRow = (row) => {
        if (!row.groupName || !row.pocName || !row.pocPhone || !row.pocEmail || !row.clientType) {
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
                dispatch(clientCruds.add(newRow, token, showAlert, setLoading, true));
                setNewRow(null);
            } else {
                const updatedClient = data[index];
                if (!validateRow(updatedClient)) return;
                dispatch(
                    clientCruds.update(
                        updatedClient["clientId"],
                        updatedClient,
                        token,
                        showAlert,
                        setLoading,
                    ),
                );
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
            setData((prev) =>
                prev.map((obj, i) => (i === index ? { ...obj, [field]: value } : obj)),
            );
        }
    };

    return (
        <StyledTableContainer component={Paper}>
            {loading && <Loading />}
            <StyledTable>
                <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                    <StyledTableRow>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            S. No.
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Group Name
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            POC Name
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            POC Phone
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            POC Email
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Client Type
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Notes
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                            Actions
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.clientId}>
                            {editingRowIndex === index ? (
                                <>
                                    <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.groupName}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "groupName")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.pocName}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "pocName")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.pocPhone}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "pocPhone")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.pocEmail}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "pocEmail")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                variant="standard"
                                                value={row.clientType}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e.target.value,
                                                        index,
                                                        "clientType",
                                                    )
                                                }
                                            >
                                                {clientTypes.map((clientType) => (
                                                    <MenuItem key={clientType} value={clientType}>
                                                        {clientType}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            value={row.notes}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index, "notes")
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <FlexBetween>
                                            <IconButton
                                                sx={{ color: "blue" }}
                                                onClick={() => handleSave(index)}
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{ color: "red" }}
                                                onClick={handleCancel}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </FlexBetween>
                                    </StyledTableCell>
                                </>
                            ) : (
                                <>
                                    <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.groupName}</StyledTableCell>
                                    <StyledTableCell>{row.pocName}</StyledTableCell>
                                    <StyledTableCell>{row.pocPhone}</StyledTableCell>
                                    <StyledTableCell>{row.pocEmail}</StyledTableCell>
                                    <StyledTableCell>{row.clientType}</StyledTableCell>
                                    <StyledTableCell>{row.notes}</StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            sx={{ color: "blue" }}
                                            onClick={() => handleEdit(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        {/* <IconButton
                      sx={{ color: "red" }}
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                                    </StyledTableCell>
                                </>
                            )}
                        </StyledTableRow>
                    ))}
                    {data.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={8}>
                                <FlexEvenly>
                                    No client data available. Add by clicking the &quot;+&quot;
                                    button!
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                    {newRow && (
                        <StyledTableRow>
                            <StyledTableCell>NEW</StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.groupName}
                                    onChange={(e) =>
                                        handleChange(e.target.value, null, "groupName")
                                    }
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.pocName}
                                    onChange={(e) => handleChange(e.target.value, null, "pocName")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.pocPhone}
                                    onChange={(e) => handleChange(e.target.value, null, "pocPhone")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.pocEmail}
                                    onChange={(e) => handleChange(e.target.value, null, "pocEmail")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <FormControl fullWidth>
                                    <Select
                                        variant="standard"
                                        value={newRow.clientType}
                                        onChange={(e) =>
                                            handleChange(e.target.value, null, "clientType")
                                        }
                                    >
                                        {clientTypes.map((clientType) => (
                                            <MenuItem key={clientType} value={clientType}>
                                                {clientType}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TextField
                                    variant="standard"
                                    value={newRow.notes}
                                    onChange={(e) => handleChange(e.target.value, null, "notes")}
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <FlexBetween>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleSave(null)}
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                                        <CancelIcon />
                                    </IconButton>
                                </FlexBetween>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </StyledTable>
        </StyledTableContainer>
    );
};

TableWithEditAddDelete.propTypes = {
    initialData: PropTypes.arrayOf(
        PropTypes.shape({
            clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            groupName: PropTypes.string.isRequired,
            pocName: PropTypes.string.isRequired,
            pocPhone: PropTypes.string.isRequired,
            pocEmail: PropTypes.string.isRequired,
            clientType: PropTypes.string.isRequired,
            notes: PropTypes.string.isRequired,
            branchId: PropTypes.number.isRequired,
        }),
    ).isRequired,
    token: PropTypes.string.isRequired,
    clientTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
    startIndex: PropTypes.number.isRequired,
};
export default TableWithEditAddDelete;
