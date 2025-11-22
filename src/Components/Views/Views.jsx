import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAlert } from "../../utils/Alert";
import Loading from "../Loading/Loading";

import PropTypes from "prop-types";
import DeleteDialog from "../DeleteDialog";
import { useDispatch, useSelector } from "react-redux";

import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../New/StyledDialog";
import { Typography, Box, Paper } from "@mui/material";
import DialogForm from "./DialogForm";
import FormView from "./FormView";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { useRowEditing } from "./hooks/useRowEditing";
import { useTableData } from "./hooks/useTableData";

const Views = (props) => {
    const {
        formKey,
        tableName,
        size,
        rootId,
        showAddButton,
        tableCruds,
        fields,
        fieldsMeta,
        apiRef = { current: {} },
        currentView,
        fieldToDisplayOnDelete = "name",
        CardContentComponent,
        actions = [],
        beforeAdd = async (row) => row,
        beforeUpdate = async (row) => row,
        editMode = "INLINE",
        overRideOnChange = (value, obj, fieldPath) => obj,
    } = props;

    const consts = useRef({
        primaryKey: fieldsMeta.primary,
        rootKey: fieldsMeta.root,
        fields,
        rootId,
    });

    const dispatch = useDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewRow, setViewRow] = useState(null);

    const { data, setData, tableState, fetchOne, handlePageChange, loadMore } = useTableData({
        tableCruds,
        tableName,
        token,
        showAlert,
        size,
        rootId,
        currentView,
        setLoading,
    });

    const { editingId, record, setRecord, handleEdit, handleCancel, handleSave, updateEditId } =
        useRowEditing({
            formKey,
            data,
            setData,
            beforeAdd,
            beforeUpdate,
            dispatch,
            tableCruds,
            token,
            showAlert,
            setLoading,
            navigate,
            tableName,
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

    const handleDelete = useCallback(
        async (id) => {
            try {
                dispatch(tableCruds.delete(id, token, showAlert, setLoading));
                if (formKey) navigate(`/management/${tableName}/`);
            } catch (error) {
                console.error(error);
                showAlert(`Failed to delete ${tableName}!`, "error");
            } finally {
                setDeleteDialogOpen(false);
                setDeleteId(null);
            }
        },
        [dispatch, showAlert, tableCruds, tableName, token],
    );

    const updateField = useCallback(
        (value, obj, fieldPath) => {
            const updatedItem = overRideOnChange(value, { ...obj }, fieldPath);

            const parts = fieldPath.split(".");
            let current = updatedItem;

            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i];
                current[key] = { ...current[key] };
                current = current[key];
            }
            current[parts[parts.length - 1]] = value;
            return updatedItem;
        },
        [overRideOnChange],
    );

    const handleChange = useCallback(
        (value, id, fieldPath) => {
            if (formKey) {
                setRecord((prev) => updateField(value, prev, fieldPath));
            } else {
                setData((prev) =>
                    prev.map((item) =>
                        item[consts.current.primaryKey] === id
                            ? updateField(value, item, fieldPath)
                            : item,
                    ),
                );
            }
        },
        [formKey],
    );

    const addNewRow = useCallback(() => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        let newRow = {
            [consts.current.primaryKey]: "NEW",
            [consts.current.rootKey]: consts.current.rootId,
        };

        consts.current.fields
            .filter((f) => f.type != "VIEW")
            .forEach((f) => {
                newRow = updateField(f.defaultValue ?? "", newRow, f.name);
            });

        if (formKey) setRecord(newRow);
        else setData((prev) => [newRow, ...prev]);

        updateEditId("NEW");
    }, [formKey, showAlert, updateField]);

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

    const handleDeleteClick = useCallback((row) => {
        setDeleteId(row[consts.current.primaryKey]);
        setDeleteDialogOpen(true);
    }, []);

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
            tableName,
            tableState,
            fields: consts.current.fields,
            fieldsMeta,
            handleChange,
            handleViewOpen,
            handleSave,
            handleCancel,
            handlePageChange,
            addNewRow: showAddButton ? addNewRow : undefined,
        }),
        [
            addNewRow,
            fieldsMeta,
            handleCancel,
            handleChange,
            handlePageChange,
            handleSave,
            showAddButton,
            tableName,
            tableState,
        ],
    );

    const commonProps = {
        data,
        editingId,
        actions: mergedActions,
    };

    return (
        <>
            {formKey ? (
                <FormView
                    {...commonProps}
                    {...commonStableProps}
                    formKey={formKey}
                    loading={loading}
                    data={record}
                    currentView={currentView}
                />
            ) : currentView === "CARD" ? (
                <CardView
                    {...commonProps}
                    {...commonStableProps}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={loadMore}
                />
            ) : (
                <ListView
                    {...commonProps}
                    {...commonStableProps}
                    editingId={editMode === "INLINE" ? editingId : false}
                />
            )}
            {loading && <Loading />}
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
                            {consts.current.fields.map((field) => (
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
            {deleteDialogOpen && deleteId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={() => handleDelete(deleteId)}
                    id={deleteId}
                    displayData={`${tableName} for ${data.find((d) => d[consts.current.primaryKey] === deleteId)?.[fieldToDisplayOnDelete]}`}
                />
            )}
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
