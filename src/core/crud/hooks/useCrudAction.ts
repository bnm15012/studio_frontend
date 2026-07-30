/** Hook managing all CRUD operations (add, update, field change) with validation, before-save hooks, and Redux dispatch. */
import { useState, useCallback, useEffect, useRef } from "react";
import { validate } from "@/core/crud/utils/validate";
import { ShowAlertFn, SetLoadingFn, CrudThunks } from "@/core/types";
import type { AppDispatch } from "@/state";
import type { Entity, FieldDef } from "@/core/types";

const defaultBeforeAdd = async <T extends Entity>(row: T): Promise<T> => row;
const defaultBeforeUpdate = async <T extends Entity>(row: T): Promise<T> => row;
const defaultOverRideOnChange = <T extends Entity>(value: unknown, obj: T, _field?: string): T =>
    obj;

interface UseCrudActionProps<T extends Entity> {
    /** 0 = new record, positive = existing id, undefined = list mode */
    formKey?: number;
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    dispatch: AppDispatch;
    tableCruds: CrudThunks<T>;
    token: string;
    showAlert: ShowAlertFn;
    setLoading: SetLoadingFn;
    /** 0 means no root context yet */
    rootId?: number;
    navigate: (path: string) => void;
    tableName: string;
    tableState: {
        currentPage: string | number;
    };
    consts: React.MutableRefObject<{
        primaryKey: string;
        rootKey?: string;
        fields: FieldDef<T>[];
    }>;
    beforeAdd?: (row: T) => T | Promise<T>;
    beforeUpdate?: (row: T) => T | Promise<T>;
    overRideOnChange?: (value: unknown, obj: T, field: string) => T;
}

export const useCrudAction = <T extends Entity>({
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
}: UseCrudActionProps<T>): {
    /** 0 = new row, positive = row being edited, -1 = nothing editing */
    editingId: number;
    record: T;
    setRecord: React.Dispatch<React.SetStateAction<T>>;
    handleEdit: (row: T) => void;
    handleCancel: () => void;
    handleSave: (id: number) => Promise<void>;
    addNewRow: () => void;
    handleChange: (value: unknown, id: number, fieldPath: string) => void;
    submitAttempted: boolean;
} => {
    /** -1 = nothing editing, 0 = new row, positive = editing existing */
    const [editingId, setEditingId] = useState<number>(formKey === 0 ? 0 : -1);
    const editingIdRef = useRef<number>(editingId);
    const [originalRow, setOriginalRow] = useState<T | null>(null);
    const [record, setRecord] = useState<T>({} as T);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const updateEditId = (id: number) => {
        editingIdRef.current = id;
        setEditingId(id);
    };

    useEffect(() => {
        updateEditId(formKey === 0 ? 0 : -1);
    }, [tableState.currentPage, formKey]);

    const handleEdit = useCallback(
        (row: T) => {
            setSubmitAttempted(false);
            if (editingIdRef.current >= 0) {
                showAlert("Can't Edit New while edit/add", "warning");
                return;
            }
            const primaryKey = consts.current.primaryKey;
            const rowId = Number(row?.[primaryKey]) || (formKey !== undefined ? formKey : 0);
            const original =
                formKey !== undefined ? record : data.find((d) => d[primaryKey] === rowId);
            setOriginalRow(original ? ({ ...original } as T) : null);
            updateEditId(rowId);
        },
        [consts, data, formKey, record, showAlert],
    );

    const handleCancel = useCallback(() => {
        setSubmitAttempted(false);
        const currentEditingId = editingIdRef.current;
        if (formKey === 0) navigate(`/management/${tableName}/`);
        if (formKey !== undefined) {
            setRecord(currentEditingId === 0 ? ({} as T) : (originalRow ?? ({} as T)));
        } else {
            if (currentEditingId === 0) {
                setData((prev) =>
                    prev.filter((row) => row[consts.current.primaryKey] !== currentEditingId),
                );
            } else if (originalRow) {
                setData((prev) =>
                    prev.map((row) =>
                        row[consts.current.primaryKey] === currentEditingId ? originalRow : row,
                    ),
                );
            }
        }
        updateEditId(-1);
        setOriginalRow(null);
    }, [formKey, navigate, tableName, originalRow, setData, consts]);

    const handleSave = useCallback(
        async (id: number) => {
            setSubmitAttempted(true);
            try {
                const primaryKey = consts.current.primaryKey;
                const targetId = id || (formKey !== undefined ? formKey : 0);
                const newRow =
                    formKey !== undefined ? record : data.find((e) => e[primaryKey] === targetId);
                if (!newRow) return;
                validate(newRow, consts.current.fields);
                if (targetId === 0) {
                    const processedRow = await beforeAdd(newRow);
                    const { [primaryKey]: _rowId, ...withoutId } = processedRow;
                    dispatch(
                        tableCruds.add(withoutId as Partial<T>, token, showAlert, setLoading, true),
                    );
                    setData((prev) => prev.filter((row) => row[primaryKey] !== targetId));
                } else {
                    dispatch(
                        tableCruds.update(
                            targetId,
                            await beforeUpdate(newRow),
                            token,
                            showAlert,
                            setLoading,
                        ),
                    );
                }
                updateEditId(-1);
                if (formKey === 0) navigate(`/management/${tableName}/`);
            } catch (error) {
                console.error(error);
                const msg =
                    error instanceof Error ? error.message : "Operation failed. Please try again!";
                showAlert(msg, "error");
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
        (value: unknown, obj: T, field: string): T => {
            const updatedItem = overRideOnChange(value, { ...obj }, field);

            const parts = field.split(".");
            let current: Record<string, unknown> = updatedItem;

            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i];
                current[key] = { ...(current[key] as Record<string, unknown>) };
                current = current[key] as Record<string, unknown>;
            }
            current[parts[parts.length - 1]] = value;
            return updatedItem;
        },
        [overRideOnChange],
    ) as (value: unknown, obj: T, field: string) => T;

    const handleChange = useCallback(
        (value: unknown, id: number, fieldPath: string) => {
            if (formKey !== undefined) {
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
        [consts, formKey, setData, updateField],
    );

    const addNewRow = useCallback(() => {
        setSubmitAttempted(false);
        if (formKey !== 0 && editingIdRef.current >= 0) {
            showAlert("Can't Add New while edit", "warning");
            return;
        }
        let newRow: Record<string, unknown> = {
            [consts.current.primaryKey]: 0,
        };
        if (consts.current.rootKey) {
            newRow[consts.current.rootKey] = rootId;
        }

        consts.current.fields
            .filter((f) => f.type !== "VIEW")
            .forEach((f) => {
                newRow = updateField(f.defaultValue ?? "", newRow as T, f.name) as Record<
                    string,
                    unknown
                >;
            });

        if (formKey !== undefined) setRecord(newRow as T);
        else setData((prev) => [newRow as T, ...prev]);

        updateEditId(0);
    }, [consts, rootId, formKey, setData, showAlert, updateField]);

    return {
        editingId,
        record,
        setRecord,
        handleEdit,
        handleCancel,
        handleSave,
        addNewRow,
        handleChange,
        submitAttempted,
    };
};
