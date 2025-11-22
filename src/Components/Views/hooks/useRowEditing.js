import { useState, useCallback } from "react";
import { validate } from "../utils/validate";

export const useRowEditing = ({
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
}) => {
    const [editingId, setEditingId] = useState(null);
    const [originalRow, setOriginalRow] = useState(null);
    const [record, setRecord] = useState({});

    const updateEditId = (id) => {
        setEditingId(id);
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
    }, [formKey, navigate, originalRow, tableName]);

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
            formKey,
            record,
            data,
            consts,
            beforeAdd,
            dispatch,
            tableCruds,
            token,
            showAlert,
            setLoading,
            setData,
            beforeUpdate,
            navigate,
            tableName,
        ],
    );
    return {
        editingId,
        originalRow,
        record,
        setRecord,
        handleEdit,
        handleCancel,
        handleSave,
        updateEditId,
    };
};
