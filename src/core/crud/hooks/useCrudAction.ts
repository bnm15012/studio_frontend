import { useState, useCallback, useEffect, useRef } from "react";
import { validate } from "@/core/crud/utils/validate";
import { ShowAlertFn, SetLoadingFn, CrudThunks, FieldValue } from "@/core/types";
import type { AppDispatch } from "@/state";
import type { CrudRecord, FieldDef } from "@/core/types";

const defaultBeforeAdd = async <T extends CrudRecord>(row: T): Promise<T> => row;
const defaultBeforeUpdate = async <T extends CrudRecord>(row: T): Promise<T> => row;
const defaultOverRideOnChange = <T extends CrudRecord>(
    _value: FieldValue,
    obj: Partial<T> | T,
    _field?: string,
): Partial<T> | T => obj;

/** Reads a dynamic (string) key off a row — needed for user-supplied primary/root keys. */
const readKey = <T extends CrudRecord>(row: T, key: string): FieldValue =>
    (row as unknown as Record<string, FieldValue>)[key];

interface UseCrudActionProps<T extends CrudRecord> {
    /** 0 = new record, positive = existing id, undefined = list mode */
    formKey?: number | undefined;
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
        rootKey?: string | undefined;
        fields: FieldDef<T>[];
    }>;
    beforeAdd?: ((row: T) => T | Promise<T>) | undefined;
    beforeUpdate?: ((row: T) => T | Promise<T>) | undefined;
    overRideOnChange?:
        | ((value: FieldValue, obj: Partial<T> | T, field: string) => Partial<T> | T)
        | undefined;
}

export const useCrudAction = <T extends CrudRecord>({
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
    handleChange: (value: FieldValue, id: number, fieldPath: string) => void;
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
            const rowId = Number(readKey(row, primaryKey)) || (formKey !== undefined ? formKey : 0);
            const original =
                formKey !== undefined ? record : data.find((d) => readKey(d, primaryKey) === rowId);
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
                    prev.filter(
                        (row) => readKey(row, consts.current.primaryKey) !== currentEditingId,
                    ),
                );
            } else if (originalRow) {
                setData((prev) =>
                    prev.map((row) =>
                        readKey(row, consts.current.primaryKey) === currentEditingId
                            ? originalRow
                            : row,
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
                    formKey !== undefined
                        ? record
                        : data.find((e) => readKey(e, primaryKey) === targetId);
                if (!newRow) return;
                validate(newRow, consts.current.fields);
                if (targetId === 0) {
                    const processedRow = await beforeAdd(newRow);
                    const withoutId = { ...processedRow } as Record<string, unknown>;
                    delete withoutId[primaryKey];
                    dispatch(
                        tableCruds.add(withoutId as Partial<T>, token, showAlert, setLoading, true),
                    );
                    setData((prev) => prev.filter((row) => readKey(row, primaryKey) !== targetId));
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
        (value: FieldValue, obj: T, field: string): T => {
            const updatedItem = (
                overRideOnChange ? overRideOnChange(value, { ...obj }, field) : { ...obj }
            ) as T;

            const parts = field.split(".");
            let current: Record<string, unknown> = updatedItem as unknown as Record<
                string,
                unknown
            >;

            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i]!;
                current[key] = { ...((current[key] as Record<string, unknown>) || {}) };
                current = current[key] as Record<string, unknown>;
            }
            const lastKey = parts[parts.length - 1]!;
            current[lastKey] = value;
            return updatedItem;
        },
        [overRideOnChange],
    ) as (value: FieldValue, obj: T, field: string) => T;

    const handleChange = useCallback(
        (value: FieldValue, id: number, fieldPath: string) => {
            if (formKey !== undefined) {
                setRecord((prev) => updateField(value, prev, fieldPath));
            } else {
                setData((prev) =>
                    prev.map((item) =>
                        (item as unknown as Record<string, FieldValue>)[
                            consts.current.primaryKey
                        ] === id
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
