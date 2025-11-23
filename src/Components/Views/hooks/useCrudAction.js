import { useState, useCallback } from "react";
import { validate } from "../utils/validate";

export const useCrudAction = ({
    formKey,
    data,
    setData,
    dispatch,
    tableCruds,
    token,
    showAlert,
    setLoading,
    navigate,
    tableName,
    consts,
    beforeAdd = async (row) => row,
    beforeUpdate = async (row) => row,
    overRideOnChange = (value, obj, field) => obj,
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
                validate(newRow, consts.current.fields);
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

    const updateField = useCallback(
        (value, obj, field) => {
            const updatedItem = overRideOnChange(value, { ...obj }, field);

            const parts = field.split(".");
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

    return {
        editingId,
        record,
        setRecord,
        handleEdit,
        handleCancel,
        handleSave,
        addNewRow,
        handleChange,
    };
};
