import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import FlexBetween from "../FlexBetween";
import { IconButton, Typography, Box, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { useNavigate } from "react-router-dom";
import { CloudUploadIcon } from "lucide-react";
import PropTypes from "prop-types";
import Field from "../Fields/Field";
import FlexBetweenColumn from "../FlexBetweenColumn";
import Loading from "../Loading/Loading";
import { getNestedValue } from "../../utils/objectHelpers";

const FormView = (props) => {
    const {
        fields,
        formKey,
        data,
        loading,
        tableName,
        editingId,
        fieldsMeta,
        actions,
        handleChange,
        handleSave,
        handleCancel,
    } = props;
    const navigate = useNavigate();
    const theme = useTheme();
    console.log(editingId);

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
                        {tableName} Info
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
                                            typeof enabled === "function"
                                                ? !enabled(data)
                                                : !enabled
                                        }
                                        key={name}
                                        sx={sx}
                                        onClick={() => onClick(data)}
                                    >
                                        {icon || name}
                                    </IconButton>
                                ))}
                            <IconButton>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <CloudDoneIcon sx={{ color: "green" }} />
                                )}
                            </IconButton>
                        </FlexBetween>
                    ) : (
                        <FlexBetween gap={2}>
                            <IconButton
                                disabled={loading}
                                onClick={() => {
                                    handleCancel();
                                    if (formKey == "NEW") navigate(`/management/${tableName}/`);
                                }}
                            >
                                <CancelIcon sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton disabled={loading} onClick={() => handleSave(formKey)}>
                                <CloudUploadIcon sx={{ color: "green" }} />
                            </IconButton>
                        </FlexBetween>
                    )}
                </Box>
            </FlexBetween>
            {!data && <Loading />}
            {data && (
                <FlexBetweenColumn
                    my={1}
                    p={2}
                    gap={2}
                    backgroundColor={theme.palette.background.paper}
                    sx={{
                        boxShadow: theme.shadows[7],
                    }}
                >
                    {fields.map((field) => (
                        <FlexBetween key={field.name}>
                            <Field
                                label={field.label}
                                isEdit={editingId}
                                value={
                                    field?.getValue
                                        ? field.getValue(getNestedValue(data, field.name))
                                        : getNestedValue(data, field.name)
                                }
                                setValue={(v) => handleChange(v, formKey, field.name)}
                                type={field.type}
                                extraProp={field.extraProp}
                            />
                        </FlexBetween>
                    ))}
                </FlexBetweenColumn>
            )}
        </>
    );
};

FormView.propTypes = {
    formKey: PropTypes.oneOfType(["NEW", PropTypes.number]),
    data: PropTypes.object,
    tableState: PropTypes.object,
    fields: PropTypes.array,
    editingId: PropTypes.number,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    tableName: PropTypes.string,
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handlePageChange: PropTypes.func,
    loading: PropTypes.bool,
    isActionDisabled: PropTypes.func,
    handleViewOpen: PropTypes.func,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.bool,
        }),
    ),
};

export default FormView;
