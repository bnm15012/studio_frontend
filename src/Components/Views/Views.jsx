import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAlert } from "../../utils/Alert";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../New/StyledDialog";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";
import DialogForm from "./DialogForm";
import FormView from "./FormView";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { useCrudAction } from "./hooks/useCrudAction";
import { useTableData } from "./hooks/useTableData";
import { useDeleteHandler } from "./hooks/useDeleteHandler";

const Views = (props) => {
    const {
        formKey,
        tableName,
        showAddButton = false,
        tableCruds,
        fields,
        fieldsMeta,
        apiRef = { current: {} },
        currentView = "LIST",
        fieldToDisplayOnDelete = "name",
        CardContentComponent,
        actions = [],
        editMode = "INLINE",
    } = props;

    const consts = useRef({
        primaryKey: fieldsMeta.primary,
        rootKey: fieldsMeta.root,
        fields,
    });

    const dispatch = useDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewRow, setViewRow] = useState(null);

    const { data, setData, tableState, fetchOne, handlePageChange, loadMore } = useTableData({
        ...props,
        token,
        showAlert,
        currentView,
        setLoading,
    });

    const {
        editingId,
        record,
        setRecord,
        handleEdit,
        handleCancel,
        handleSave,
        addNewRow,
        handleChange,
    } = useCrudAction({
        ...props,
        data,
        setData,
        dispatch,
        token,
        showAlert,
        setLoading,
        navigate,
        consts,
    });

    const handleViewOpen = (row) => {
        setViewRow(row);
        setViewDialogOpen(true);
    };

    const handleViewClose = () => {
        setViewRow(null);
        setViewDialogOpen(false);
    };
    const { handleDeleteClick, DeleteDialogComponent } = useDeleteHandler({
        tableCruds,
        token,
        showAlert,
        setLoading,
        dispatch,
        navigate,
        tableName,
        consts,
        data,
        fieldToDisplayOnDelete,
    });

    const openFormView = useCallback(
        (row) => {
            navigate(`/management/${tableName}/${row[consts.current.primaryKey]}`);
        },
        [navigate, tableName],
    );

    const mergedActions = useMergedActions(
        actions,
        useMemo(
            () => ({
                loading,
                editMode,
                formKey,
                handleEdit,
                handleDeleteClick,
                openFormView,
            }),
            [editMode, formKey, handleEdit, handleDeleteClick, loading, openFormView],
        ),
    );

    const commonStableProps = useMemo(
        () => ({
            ...props,
            handleChange,
            handleViewOpen,
            handleSave,
            handleCancel,
            handlePageChange,
            addNewRow: showAddButton ? addNewRow : undefined,
        }),
        [addNewRow, handleCancel, handleChange, handlePageChange, handleSave, props, showAddButton],
    );

    const commonProps = {
        data,
        tableState,
        editingId,
        actions: mergedActions,
    };

    useEffect(() => {
        apiRef.current.addNewRow = addNewRow;
    }, [addNewRow]);

    useEffect(() => {
        if (formKey === "NEW") addNewRow(editingId);
    }, [formKey]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            fetchOne(formKey);
        }
    }, [formKey, fetchOne]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            setRecord(tableState.recordById[formKey] || {});
        }
    }, [formKey, tableState.recordById]);

    return (
        <>
            {formKey ? (
                <FormView
                    {...commonStableProps}
                    {...commonProps}
                    formKey={formKey}
                    loading={loading}
                    data={record}
                    currentView={currentView}
                />
            ) : currentView === "CARD" ? (
                <CardView
                    {...commonStableProps}
                    {...commonProps}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={loadMore}
                />
            ) : (
                <ListView
                    {...commonStableProps}
                    {...commonProps}
                    editingId={editMode === "INLINE" ? editingId : false}
                />
            )}
            {editMode !== "FORM" &&
                (editMode === "DIALOG" || currentView === "CARD") &&
                editingId && (
                    <DialogForm
                        setClose={handleCancel}
                        {...commonProps}
                        {...commonStableProps}
                        data={data.find((d) => d[consts.current.primaryKey] === editingId)}
                    />
                )}
            {viewDialogOpen && (
                <StyledDialog
                    open={viewDialogOpen}
                    onClose={handleViewClose}
                    closeIcon={true}
                    title="View"
                    maxWidth="md"
                >
                    {viewRow && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            {fields.map((field) => (
                                <Typography key={field.name} variant="subtitle1">
                                    <strong>{field.label}:</strong>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1,
                                            maxHeight: "20rem",
                                            overflowY: "auto",
                                            whiteSpace: "pre-wrap",
                                            background: "#fafafa",
                                        }}
                                    >
                                        {viewRow[field.name]}
                                    </Paper>
                                </Typography>
                            ))}
                        </Box>
                    )}
                </StyledDialog>
            )}
            {loading && <CircularProgress />}
            {DeleteDialogComponent}
        </>
    );
};

Views.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableName: PropTypes.string.isRequired,
    overRideOnChange: PropTypes.func,
    size: PropTypes.number.isRequired,
    rootId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableCruds: PropTypes.any,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    beforeAdd: PropTypes.func,
    beforeUpdate: PropTypes.func,
    cardLayout: PropTypes.oneOf(["vertical", "horizontal"]),
    fieldToDisplayOnDelete: PropTypes.string,
    currentView: PropTypes.string,
    showAddButton: PropTypes.bool,
    CardContentComponent: PropTypes.elementType,
    actions: PropTypes.arrayOf(Object),
    editMode: PropTypes.oneOf(["FORM", "DIALOG", "INLINE"]),
};
export default Views;
