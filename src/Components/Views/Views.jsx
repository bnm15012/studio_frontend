import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAlert } from "../../utils/Alert";
import Loading from "../Loading/Loading";

import PropTypes from "prop-types";
import DeleteDialog from "../DeleteDialog";
import { useDispatch, useSelector } from "react-redux";

import { usePageSearch } from "../../hooks/useSearch";
import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../New/StyledDialog";
import { Typography, Box, Paper } from "@mui/material";
import DialogForm from "./DialogForm";
import FormView from "./FormView";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { validate } from "./utils/validate";

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
    const { subscribe } = usePageSearch();

    const token = useSelector((state) => state.auth.token);
    const tableState = useSelector((state) => state[tableName]);

    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterKeys, setFilterKeys] = useState({});

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewRow, setViewRow] = useState(null);
    const [record, setRecord] = useState({});

    const updateEditId = (id) => {
        setEditingId(id);
    };
    const handleViewOpen = (row) => {
        setViewRow(row);
        setViewDialogOpen(true);
    };

    const handleViewClose = () => {
        setViewRow(null);
        setViewDialogOpen(false);
    };

    const handleEdit = useCallback(
        (row) => {
            if (editingId) {
                showAlert("Can't Edit New while edit/add", "warning");
                return;
            }
            const original = data.find(
                (d) => d[consts.current.primaryKey] === row[consts.current.primaryKey],
            );
            setOriginalRow({ ...original });
            updateEditId(row[consts.current.primaryKey]);
        },
        [data, showAlert],
    );

    const handleCancel = useCallback(() => {
        if (formKey === "NEW") navigate(`/management/${tableName}/`);
        if (formKey) {
            setRecord(editingId === "NEW" ? {} : originalRow);
        } else {
            if (editingId === "NEW") {
                setData((prev) =>
                    prev.filter((row) => row[consts.current.primaryKey] !== editingId),
                );
            } else if (originalRow) {
                setData((prev) =>
                    prev.map((row) =>
                        row[consts.current.primaryKey] === editingId ? originalRow : row,
                    ),
                );
            }
        }
        updateEditId(null);
        setOriginalRow(null);
    }, [editingId, formKey, navigate, originalRow, tableName]);

    const handleSave = useCallback(
        async (id) => {
            try {
                const newRow = formKey
                    ? record
                    : data.find((e) => e[consts.current.primaryKey] === id);
                validate(newRow);
                if (id === "NEW") {
                    const { [consts.current.primaryKey]: id, ...withoutId } =
                        await beforeAdd(newRow);
                    dispatch(tableCruds.add(withoutId, token, showAlert, setLoading, true));
                    setData((prev) => prev.filter((row) => row[consts.current.primaryKey] !== id));
                } else {
                    dispatch(
                        tableCruds.update(
                            id,
                            await beforeUpdate(newRow),
                            token,
                            showAlert,
                            setLoading,
                        ),
                    );
                }
                updateEditId(null);
            } catch (error) {
                console.error(error);
                showAlert(error.message ?? "Operation failed. Please try again!", "error");
            } finally {
                if (formKey === "NEW") navigate(`/management/${tableName}/`);
            }
        },
        [
            beforeAdd,
            beforeUpdate,
            data,
            dispatch,
            formKey,
            navigate,
            record,
            showAlert,
            tableCruds,
            tableName,
            token,
        ],
    );

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

    const fetchData = useCallback(
        async (page = 1, searchTerm = "", filterKeys = {}) => {
            dispatch(
                tableCruds.getAll(
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size, ...filterKeys },
                    rootId,
                    currentView === "CARD",
                ),
            );
        },
        [dispatch],
    );

    const fetchOneData = useCallback(
        async (formKey) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading));
        },
        [dispatch, tableCruds, showAlert, token],
    );

    const handlePageChange = useCallback(
        async (p) => {
            await fetchData(p, searchTerm, filterKeys);
        },
        [fetchData, filterKeys, searchTerm],
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
        fetchData();
        apiRef.current.addNewRow = addNewRow;
    }, [addNewRow, fetchData]);

    useEffect(() => {
        if (formKey === "NEW") addNewRow(editingId);
    }, [formKey]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            fetchOneData(formKey);
        }
    }, [formKey, fetchOneData]);

    useEffect(() => {
        const unsubscribe = subscribe((term, filterKeys) => {
            fetchData(1, term, filterKeys);
            setSearchTerm(term);
            setFilterKeys(filterKeys);
        });

        return unsubscribe;
    }, [fetchData, subscribe]);

    useEffect(() => {
        setData(tableState.items ?? []);
    }, [tableState.items]);

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

    const loadMore = useCallback(() => {
        handlePageChange(tableState.currentPage + 1);
    }, [tableState.currentPage, handlePageChange]);

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
