import { useState, useCallback, useEffect } from "react";
import { validate } from "../utils/validate";

const defaultBeforeAdd = async (row: any) => row;
const defaultBeforeUpdate = async (row: any) => row;
const defaultOverRideOnChange = (_value: any, obj: any, _field?: string) => obj;

interface UseCrudActionProps {
    formKey?: string | number | null;
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    dispatch: any;
    tableCruds: any;
    token: string | null | undefined;
    showAlert: (msg: string, type?: any) => void;
    setLoading: (loading: boolean) => void;
    rootId?: string | number | null;
    navigate: (path: string) => void;
    tableName: string;
    tableState: {
        currentPage: string | number;
        [key: string]: any;
    };
    consts: React.MutableRefObject<{
        primaryKey: string;
        rootKey?: string;
        fields: any[];
    }>;
    beforeAdd?: (row: any) => Promise<any> | any;
    beforeUpdate?: (row: any) => Promise<any> | any;
    overRideOnChange?: (value: any, obj: any, field: string) => any;
}

export const useCrudAction = ({
    formKey,
    data,
    setData,
    dispatch,
    tableCruds,
    token,
    showAlert,
    setLoading,
    rootId,
    navigate,
    tableName,
    tableState,
    consts,
    beforeAdd = defaultBeforeAdd,
    beforeUpdate = defaultBeforeUpdate,
    overRideOnChange = defaultOverRideOnChange,
}: UseCrudActionProps) => {
    const [editingId, setEditingId] = useState<any>(null);
    const [originalRow, setOriginalRow] = useState<any>(null);
    const [record, setRecord] = useState<any>({});

    const updateEditId = (id: any) => {
        setEditingId(id);
    };

    useEffect(() => {
        updateEditId(null);
    }, [tableState.currentPage]);

    const handleEdit = useCallback(
        (row: any) => {
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
        [consts, data, editingId, showAlert],
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
    }, [formKey, navigate, tableName, editingId, originalRow, setData, consts]);

    const handleSave = useCallback(
        async (id: any) => {
            try {
                const newRow = formKey
                    ? record
                    : data.find((e) => e[consts.current.primaryKey] === id);
                validate(newRow, consts.current.fields);
                if (id === "NEW") {
                    const { [consts.current.primaryKey]: rowId, ...withoutId } =
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
                if (formKey === "NEW") navigate(`/management/${tableName}/`);
            } catch (error: any) {
                console.error(error);
                showAlert(error.message ?? "Operation failed. Please try again!", "error");
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
        (value: any, obj: any, field: string) => {
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
        (value: any, id: any, fieldPath: string) => {
            if (formKey) {
                setRecord((prev: any) => updateField(value, prev, fieldPath));
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
        [consts, formKey, setData, updateField],
    );

    const addNewRow = useCallback(() => {
        if (editingId) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        let newRow: any = {
            [consts.current.primaryKey]: "NEW",
        };
        if (consts.current.rootKey) {
            newRow[consts.current.rootKey] = rootId;
        }

        consts.current.fields
            .filter((f) => f.type !== "VIEW")
            .forEach((f) => {
                newRow = updateField(f.defaultValue ?? "", newRow, f.name);
            });

        if (formKey) setRecord(newRow);
        else setData((prev) => [newRow, ...prev]);

        updateEditId("NEW");
    }, [editingId, consts, rootId, formKey, setData, showAlert, updateField]);

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
