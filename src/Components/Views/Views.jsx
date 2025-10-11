import { useCallback, useEffect, useState } from "react";

import { useAlert } from "../../utils/Alert";
import Loading from "../Loading/Loading";

import PropTypes from "prop-types";
import DeleteDialog from "../DeleteDialog";
import { useDispatch, useSelector } from "react-redux";

import { usePageSearch } from "../../hooks/useSearch";
import ListView from "./ListView";
import CardView from "./CardView";

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

    const handleEdit = (id) => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        const original = data.find((d) => d[fieldsMeta.primary] === id);
        setOriginalRow({ ...original });
        setEditingId(id);
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

    const handleDelete = async (id) => {
        try {
            dispatch(tableCruds.delete(id, token, showAlert, setLoading));
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        }
    };

    const handleChange = (value, id, field) => {
        setData((prev) =>
            prev.map((enq) => (enq[fieldsMeta.primary] === id ? { ...enq, [field]: value } : enq)),
        );
    };

    const fetchData = useCallback(
        async (page = 1, searchTerm = "") => {
            dispatch(
                tableCruds.getAll(
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size },
                    rootId,
                    currentView !== "LIST",
                ),
            );
        },
        [dispatch, tableCruds, showAlert, token, size, rootId, currentView],
    );

    const handlePageChange = async (p) => {
        setPage(p);
        await fetchData(p, searchTerm);
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
        const unsubscribe = subscribe((term) => {
            console.log("search for ", term);
            fetchData(1, term);
            setSearchTerm(term);
        });

        return unsubscribe;
    }, [fetchData, page, subscribe]);

    useEffect(() => {
        setData(tableState.items ?? []);
    }, [tableState]);

    useEffect(() => {
        if (onSetAddNewFunc) onSetAddNewFunc(() => addNewRow);
    }, [addNewRow, onSetAddNewFunc]);

    const commonProps = {
        data,
        tableState,
        fields,
        editingId,
        fieldsMeta,
        handleChange,
        handleSave,
        handleCancel,
        handleEdit,
        setDeleteDialogOpen,
        setDeleteId,
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
                <ListView {...commonProps} />
            )}
            {loading && <Loading />}
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
};
export default Views;
