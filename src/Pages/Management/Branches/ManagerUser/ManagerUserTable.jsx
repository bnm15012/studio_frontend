import { useEffect, useState } from "react";
import { TableBody, TableHead, Paper, IconButton, TextField, Switch, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAlert } from "../../../../utils/Alert";
import Loading from "../../../../Components/Loading/Loading";
import FlexEvenly from "../../../../Components/FlexEvenly";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../../Components/StyledTableComponents";
import PropTypes from "prop-types";
import FlexBetween from "../../../../Components/FlexBetween";
import { addManagerAPI, updateManagerAPI } from "./manageruser.api";
import UserAccessDialog from "./UserAccessDialog";

const ManagerUserTable = ({ initialData, token, newRow, selectedBranch, setNewRow }) => {
    const showAlert = useAlert();
    const [data, setData] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEdit = (userId) => setEditingUserId(userId);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const [accessDialogOpen, setAccessDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenAccessDialog = (user) => {
        setSelectedUser(user);
        setAccessDialogOpen(true);
    };

    const validateRow = (row) => {
        if (!row.userName || !row.email || !row.phone) {
            showAlert("All fields are required!", "error");
            return false;
        }
        return true;
    };

    const handleSave = async (user) => {
        setLoading(true);
        try {
            if (user.userId === "NEW") {
                if (!validateRow(user)) return;
                const { userId, ...payload } = user;
                const {
                    data: addedBranchData,
                    success,
                    message,
                } = await addManagerAPI({ managerData: payload, token });

                if (success) {
                    setData((prev) => [
                        ...prev.filter((u) => u.userId !== userId),
                        addedBranchData,
                    ]);
                    showAlert(message, "success");
                } else {
                    showAlert(message, "error");
                }
                setNewRow(null);
            } else {
                if (!validateRow(user)) return;
                const {
                    data: updatedData,
                    success,
                    message,
                } = await updateManagerAPI({ userId: user.userId, managerData: user, token });
                if (success) {
                    setData((prev) =>
                        prev.map((u) => (u.userId === user.userId ? { ...u, ...updatedData } : u)),
                    );
                    showAlert(message, "success");
                } else {
                    showAlert(message, "error");
                }
                setEditingUserId(null);
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
        setEditingUserId(null);
    };

    const handleChange = (value, userId, field) => {
        if (userId === "NEW") {
            setNewRow({ ...newRow, [field]: value });
        } else {
            setData((prev) =>
                prev.map((u) => (u.userId === userId ? { ...u, [field]: value } : u)),
            );
        }
    };

    return (
        <>
            <StyledTableContainer component={Paper}>
                {loading && <Loading />}
                <StyledTable>
                    <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                        <StyledTableRow>
                            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
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
                            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                Access Rights
                            </StyledTableCell>
                            <StyledTableCell
                                sx={{ fontWeight: "bold", color: "#1976d2", width: "8rem" }}
                            >
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, idx) => {
                            const isEditing = editingUserId === row.userId;
                            return (
                                <StyledTableRow key={row.userId}>
                                    <StyledTableCell>{idx + 1}</StyledTableCell>
                                    {["userName", "email", "phone"].map((field) => (
                                        <StyledTableCell key={field}>
                                            {isEditing && field === "phone" ? (
                                                <TextField
                                                    variant="standard"
                                                    value={row[field]}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e.target.value,
                                                            row.userId,
                                                            field,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                row[field]
                                            )}
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell>
                                        <Switch
                                            disabled={
                                                !isEditing ||
                                                row.branchId === selectedBranch.branchId
                                            }
                                            checked={row.enabled}
                                            onChange={(e) =>
                                                handleChange(
                                                    e.target.checked,
                                                    row.userId,
                                                    "enabled",
                                                )
                                            }
                                            sx={{ color: "blue" }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenAccessDialog(row)}
                                        >
                                            Access
                                        </Button>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {isEditing ? (
                                            <FlexBetween>
                                                <IconButton
                                                    sx={{ color: "blue" }}
                                                    onClick={() => handleSave(row)}
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
                                        ) : (
                                            <IconButton
                                                disabled={editingUserId !== null || newRow !== null}
                                                sx={{ color: "blue" }}
                                                onClick={() => handleEdit(row.userId)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                        {data.length === 0 && (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7}>
                                    <FlexEvenly>
                                        No Manager data available. Add by clicking the &quot;+&quot;
                                        button!
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                        {newRow && (
                            <StyledTableRow>
                                <StyledTableCell>NEW</StyledTableCell>
                                {["userName", "email", "phone"].map((field) => (
                                    <StyledTableCell key={field}>
                                        <TextField
                                            variant="standard"
                                            value={newRow[field]}
                                            onChange={(e) =>
                                                handleChange(e.target.value, "NEW", field)
                                            }
                                        />
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell>
                                    <Switch
                                        checked={newRow.enabled}
                                        onChange={(e) =>
                                            handleChange(e.target.checked, "NEW", "enabled")
                                        }
                                        sx={{ color: "blue" }}
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleOpenAccessDialog(newRow)}
                                    >
                                        Set Access
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <FlexEvenly>
                                        <IconButton
                                            sx={{ color: "blue" }}
                                            onClick={() => handleSave(newRow)}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton sx={{ color: "red" }} onClick={handleCancel}>
                                            <CancelIcon />
                                        </IconButton>
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
            <UserAccessDialog
                open={accessDialogOpen}
                onClose={() => setAccessDialogOpen(false)}
                user={selectedUser}
                isEdit={
                    editingUserId === selectedUser?.userId ||
                    (selectedUser?.userId === "NEW" && newRow !== null)
                }
                onSave={(accessState) =>
                    handleChange(accessState, selectedUser?.userId, "userAccessEntry")
                }
            />
        </>
    );
};

ManagerUserTable.propTypes = {
    initialData: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            userName: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
            enabled: PropTypes.bool,
            userAccessEntry: PropTypes.object,
        }),
    ).isRequired,
    selectedBranch: PropTypes.shape({
        branchId: PropTypes.number,
    }).isRequired,
    token: PropTypes.string.isRequired,
    newRow: PropTypes.object,
    setNewRow: PropTypes.func.isRequired,
};

export default ManagerUserTable;
