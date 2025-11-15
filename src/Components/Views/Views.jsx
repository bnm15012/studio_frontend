import { useCallback, useEffect, useState } from "react";

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
import { Delete, Edit, OpenInNew } from "@mui/icons-material";
import DialogForm from "./DialogForm";
import FormView from "./FormView";
import { useNavigate } from "react-router-dom";

const Views = ({
    formKey,
    tableName,
    size,
    rootId,
    showAddButton,
    tableCruds,
    fields,
    cardLayout,
    fieldsMeta,
    onSetAddNewFunc,
    currentView,
    fieldToDisplayOnDelete = "name",
    CardContentComponent,
    actions = [],
    beforeAdd = async (row) => row,
    beforeUpdate = async (row) => row,
    editMode = "INLINE",
}) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();
    const { subscribe } = usePageSearch();

    const token = useSelector((state) => state.auth.token);
    const tableState = useSelector((state) => state[tableName]);

    const [page, setPage] = useState(1);
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

    const handleViewOpen = (row) => {
        setViewRow(row);
        setViewDialogOpen(true);
    };

    const handleViewClose = () => {
        setViewRow(null);
        setViewDialogOpen(false);
    };

    const handleEdit = (row) => {
        if (editingId) {
            showAlert("Can't Edit New while edit", "warning");
            return;
        }
        const original = data.find((d) => d[fieldsMeta.primary] === row[fieldsMeta.primary]);
        setOriginalRow({ ...original });
        setEditingId(row[fieldsMeta.primary]);
    };

    const handleCancel = () => {
        if (formKey) {
            setRecord(originalRow);
        } else {
            if (editingId === "NEW") {
                setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== editingId));
            } else if (originalRow) {
                setData((prev) =>
                    prev.map((row) => (row[fieldsMeta.primary] === editingId ? originalRow : row)),
                );
            }
        }
        setEditingId(null);
        setOriginalRow(null);
        if (formKey === "NEW") navigate(`/management/${tableName}/`);
    };

    const handleSave = async (id) => {
        try {
            const newRow = formKey ? record : data.find((e) => e[fieldsMeta.primary] === id);
            if (id === "NEW") {
                const { [fieldsMeta.primary]: id, ...withoutId } = await beforeAdd(newRow);
                dispatch(tableCruds.add(withoutId, token, showAlert, setLoading, true));
                setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== id));
            } else {
                dispatch(
                    tableCruds.update(id, await beforeUpdate(newRow), token, showAlert, setLoading),
                );
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== id));
            setEditingId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            dispatch(tableCruds.delete(id, token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const updateField = (value, obj, fieldPath) => {
        const updatedItem = { ...obj };

        const pathParts = fieldPath.split(".");
        let current = updatedItem;

        for (let i = 0; i < pathParts.length - 1; i++) {
            const key = pathParts[i];
            current[key] = { ...current[key] };
            current = current[key];
        }
        current[pathParts[pathParts.length - 1]] = value;
        return updatedItem;
    };

    const handleChange = (value, id, fieldPath) => {
        if (formKey) {
            setRecord((prev) => updateField(value, prev, fieldPath));
        } else {
            setData((prev) =>
                prev.map((item) =>
                    item[fieldsMeta.primary] === id ? updateField(value, item, fieldPath) : item,
                ),
            );
        }
    };

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
        [dispatch, tableCruds, showAlert, token, size, rootId, currentView],
    );

    const fetchOneData = useCallback(
        async (formKey) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading));
        },
        [dispatch, tableCruds, showAlert, token],
    );

    const handlePageChange = async (p) => {
        setPage(p);
        await fetchData(p, searchTerm, filterKeys);
    };

    const addNewRow = useCallback(() => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }

        let newRow = { [fieldsMeta.primary]: "NEW", [fieldsMeta.root]: rootId };

        fields.forEach((f) => {
            newRow = updateField(f.defaultValue ?? "", newRow, f.name);
        });

        if (formKey) setRecord(newRow);
        else setData((prev) => [newRow, ...prev]);

        setEditingId("NEW");
    }, [editingId, fields, fieldsMeta.primary, fieldsMeta.root, formKey, rootId, showAlert]);

    useEffect(() => {
        fetchData();
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (formKey === "NEW") {
            record && !Object.keys(record).length && addNewRow();
        } else if (formKey) fetchOneData(formKey);
    }, [addNewRow, fetchOneData, formKey, record]);

    useEffect(() => {
        const unsubscribe = subscribe((term, filterKeys) => {
            fetchData(1, term, filterKeys);
            setSearchTerm(term);
            setFilterKeys(filterKeys);
        });

        return unsubscribe;
    }, [fetchData, page, subscribe]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            setRecord(tableState.recordById[formKey] || {});
        }
        setData(tableState.items ?? []);
    }, [formKey, tableState]);

    const handleDeleteClick = (row) => {
        setDeleteId(row[fieldsMeta.primary]);
        setDeleteDialogOpen(true);
    };

    const openFormView = (row) => {
        navigate(`/management/${tableName}/${row[fieldsMeta.primary]}`);
    };

    const defaultActions = [
        {
            name: "edit",
            enabled: !loading,
            hide: editMode === "FORM" && !formKey,
            onClick: handleEdit,
            icon: <Edit />,
            sx: { color: "blue" },
        },
        {
            name: "delete",
            enabled: !loading,
            onClick: handleDeleteClick,
            icon: <Delete />,
            sx: { color: "red" },
        },
        {
            name: "form",
            enabled: !loading,
            hide: editMode !== "FORM" || !!formKey,
            onClick: openFormView,
            icon: <OpenInNew />,
            sx: { color: "blue" },
        },
    ];

    const mergedActions = [
        ...defaultActions.map((def) => {
            const override = actions.find((a) => a.name === def.name);
            return override ? { ...def, ...override } : def;
        }),
        ...actions.filter((a) => !defaultActions.some((def) => def.name === a.name)),
    ];

    const commonProps = {
        data,
        tableName,
        tableState,
        fields,
        editingId,
        fieldsMeta,
        actions: mergedActions,
        handleChange,
        handleViewOpen,
        handleSave,
        handleCancel,
        handlePageChange,
        addNewRow: showAddButton ? addNewRow : undefined,
    };

    return (
        <>
            {formKey ? (
                <FormView
                    {...commonProps}
                    formKey={formKey}
                    loading={loading}
                    data={record}
                    currentView={currentView}
                />
            ) : currentView === "CARD" ? (
                <CardView
                    {...commonProps}
                    cardLayout={cardLayout}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={() => {
                        handlePageChange(tableState.currentPage + 1);
                    }}
                />
            ) : (
                <ListView {...commonProps} editingId={editMode === "INLINE" ? editingId : false} />
            )}
            {loading && <Loading />}
            {editMode !== "FORM" &&
                (editMode === "DIALOG" || currentView === "CARD") &&
                editingId && (
                    <DialogForm
                        setClose={handleCancel}
                        {...commonProps}
                        data={data.find((d) => d[fieldsMeta.primary] === editingId)}
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
            {deleteDialogOpen && deleteId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={() => handleDelete(deleteId)}
                    id={deleteId}
                    displayData={`${tableName} for ${data.find((d) => d[fieldsMeta.primary] === deleteId)?.[fieldToDisplayOnDelete]}`}
                />
            )}
        </>
    );
};

Views.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableName: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    rootId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableCruds: PropTypes.any,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    onSetAddNewFunc: PropTypes.func,
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
