import { useTheme } from "@emotion/react";
import React from "react";
import FlexBetween from "../FlexBetween";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react";

const FormView = (props) => {
    const {
        fields,
        tableName,
        data,
        editingId,
        fieldsMeta,
        actions,
        handleChange,
        handleSave,
        handleCancel,
        tableState,
        handlePageChange,
        handleViewOpen,
    } = props;
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <>
            <FlexBetween
                backgroundColor={theme.palette.background.paper}
                sx={{ width: "100%", p: 2, borderRadius: 2, boxShadow: theme.shadows[2] }}
            >
                <FlexBetween alignItems={"center"} gap={2}>
                    <IconButton onClick={() => navigate(`/management/${tableName}`)}>
                        <ArrowBackIcon sx={{ color: "black" }} />
                    </IconButton>
                    <Typography variant="h5" fontWeight={"bold"}>
                        Instructor Info
                    </Typography>
                </FlexBetween>

                <Box>
                    {!editingId ? (
                        <FlexBetween gap={2}>
                            {actions
                                .filter((a) => !a.hide)
                                .map(({ name, enabled, onClick, icon, sx }) => (
                                    <IconButton
                                        disabled={
                                            typeof enabled === "function" ? !enabled(row) : !enabled
                                        }
                                        key={name}
                                        sx={sx}
                                        onClick={() => onClick(row)}
                                    >
                                        {icon || name}
                                    </IconButton>
                                ))}
                        </FlexBetween>
                    ) : (
                        <FlexBetween gap={2}>
                            <IconButton
                                disabled={loading}
                                onClick={() => {
                                    setIsEdit(false);
                                    if (ID == "NEW") navigate(`/management/${page}/`);
                                }}
                            >
                                <CancelIcon sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton
                                disabled={loading}
                                onClick={() => saveNewEditInstructorData()}
                            >
                                <CloudUploadIcon sx={{ color: "green" }} />
                            </IconButton>
                        </FlexBetween>
                    )}
                </Box>
            </FlexBetween>
        </>
    );
};

export default FormView;
