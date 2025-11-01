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
import { Delete, Edit } from "@mui/icons-material";
import DialogForm from "./DialogForm";

const Views = ({
    tableName,
    size,
    rootId,
    tableCruds,
    fields,
    fieldsMeta,
    onSetAddNewFunc,
    currentView,
    fieldToDisplayOnDelete = "name",
    CardContentComponent,
    actions = [],
    dialogEdit = true,
}) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
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
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        const original = data.find((d) => d[fieldsMeta.primary] === row[fieldsMeta.primary]);
        setOriginalRow({ ...original });
        setEditingId(row[fieldsMeta.primary]);
    };

    const handleCancel = () => {
        if (editingId === "NEW") {
            setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== editingId));
        } else if (originalRow) {
            setData((prev) =>
                prev.map((row) => (row[fieldsMeta.primary] === editingId ? originalRow : row)),
            );
        }
        setEditingId(null);
        setOriginalRow(null);
    };

    const handleSave = async (id) => {
        try {
            const newRow = data.find((e) => e[fieldsMeta.primary] === id);
            if (id === "NEW") {
                const { [fieldsMeta.primary]: id, ...withoutId } = newRow;
                dispatch(tableCruds.add(withoutId, token, showAlert, setLoading, true));
                setData((prev) => prev.filter((row) => row[fieldsMeta.primary] !== id));
            } else {
                dispatch(tableCruds.update(id, newRow, token, showAlert, setLoading));
            }
        } catch (error) {
            console.error(error);
            showAlert("Operation failed. Please try again!", "error");
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (row) => {
        try {
            dispatch(tableCruds.delete(row[fieldsMeta.primary], token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        } finally {
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const handleChange = (value, id, fieldPath) => {
        setData((prev) =>
            prev.map((item) => {
                if (item[fieldsMeta.primary] !== id) return item;

                const updatedItem = { ...item };

                if (fieldPath.includes(".")) {
                    const [parent, child] = fieldPath.split(".");
                    updatedItem[parent] = {
                        ...updatedItem[parent],
                        [child]: value,
                    };
                } else {
                    updatedItem[fieldPath] = value;
                }

                return updatedItem;
            }),
        );
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
                    currentView !== "LIST",
                ),
            );
        },
        [dispatch, tableCruds, showAlert, token, size, rootId, currentView],
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
        const newRow = fields.reduce(
            (acc, f) => {
                acc[f.name] = f.defaultValue ?? "";
                return acc;
            },
            { [fieldsMeta.primary]: "NEW", [fieldsMeta.root]: rootId },
        );

        setData((prev) => [newRow, ...prev]);
        setEditingId("NEW");
    }, [editingId, fields, fieldsMeta.primary, fieldsMeta.root, rootId, showAlert]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const unsubscribe = subscribe((term, filterKeys) => {
            fetchData(1, term, filterKeys);
            setSearchTerm(term);
            setFilterKeys(filterKeys);
        });

        return unsubscribe;
    }, [fetchData, page, subscribe]);

    useEffect(() => {
        setData(tableState.items ?? []);
    }, [tableState]);

    useEffect(() => {
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
    }, [addNewRow, onSetAddNewFunc]);

    const handleDeleteClick = (row) => {
        setDeleteId(row[fieldsMeta.primary]);
        setDeleteDialogOpen(true);
    };

    const defaultActions = [
        {
            name: "edit",
            enabled: true,
            onClick: handleEdit,
            icon: <Edit />,
            sx: { color: "blue" },
        },
        {
            name: "delete",
            enabled: true,
            onClick: handleDeleteClick,
            icon: <Delete />,
            sx: { color: "red" },
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
    };
    return (
        <>
            {currentView === "CARD" ? (
                <CardView
                    {...commonProps}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={() => {
                        handlePageChange(tableState.currentPage + 1);
                    }}
                />
            ) : (
                <ListView {...commonProps} editingId={dialogEdit ? false : editingId} />
            )}
            {loading && <Loading />}
            {(dialogEdit || currentView === "CARD") && editingId && (
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
                    displayData={`${tableName} for ${data.find((d) => d[fieldsMeta.primary] === deleteId)?.[fieldToDisplayOnDelete]}`}
                />
            )}
        </>
    );
};

Views.propTypes = {
    tableName: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    rootId: PropTypes.number,
    tableCruds: PropTypes.any,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    onSetAddNewFunc: PropTypes.func,
    fieldToDisplayOnDelete: PropTypes.string,
    currentView: PropTypes.string,
    CardContentComponent: PropTypes.node,
    actions: PropTypes.arrayOf(Object),
    dialogEdit: PropTypes.bool,
};
export default Views;
