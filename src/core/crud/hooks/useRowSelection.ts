/** Hook managing multi-row selection state: selected IDs, select-all, indeterminate state, and bulk action filtering. */
import { useState, useEffect, useMemo, useCallback } from "react";
import { ActionItem, Entity } from "../../types";

interface UseRowSelectionOptions<T extends Record<string, unknown>> {
    data: T[];
    primaryKey: string;
    /** Reset selection when any of these values change (e.g. currentPage). */
    resetOn?: unknown[];
    actions: ActionItem<T>[];
}

export interface UseRowSelectionReturn<T extends Entity> {
    selectedRows: number[];
    selectedRowsData: T[];
    multiActions: ActionItem<T>[];
    visibleRowIds: number[];
    isAllSelected: boolean;
    isIndeterminate: boolean;
    /** Toggle a single row by id + checked boolean (CardView style). */
    handleSelectRow: (id: number, checked: boolean) => void;
    /** Toggle a single row from a checkbox change-event (ListView style). */
    handleSelectRowEvent: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useRowSelection<T extends Entity>({
    data,
    primaryKey,
    resetOn = [],
    actions,
}: UseRowSelectionOptions<T>): UseRowSelectionReturn<T> {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Reset whenever page / data changes
    useEffect(() => {
        setSelectedRows([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, resetOn);

    const visibleRowIds = useMemo(
        () => (data?.map((row) => Number(row[primaryKey]) || 0) ?? []) as number[],
        [data, primaryKey],
    );

    const selectedRowsData = useMemo(
        () => data?.filter((row) => selectedRows.includes(Number(row[primaryKey]) || 0)) ?? [],
        [data, selectedRows, primaryKey],
    );

    const multiActions = useMemo(() => (actions ?? []).filter((a) => a.multi === true), [actions]);

    const isAllSelected = visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < visibleRowIds.length;

    const handleSelectRow = useCallback((id: number, checked: boolean) => {
        setSelectedRows((prev) => (checked ? [...prev, id] : prev.filter((r) => r !== id)));
    }, []);

    const handleSelectRowEvent = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
            event.stopPropagation();
            setSelectedRows((prev) =>
                event.target.checked ? [...prev, id] : prev.filter((r) => r !== id),
            );
        },
        [],
    );

    const handleSelectAll = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedRows(event.target.checked ? visibleRowIds : []);
        },
        [visibleRowIds],
    );

    return {
        selectedRows,
        selectedRowsData,
        multiActions,
        visibleRowIds,
        isAllSelected,
        isIndeterminate,
        handleSelectRow,
        handleSelectRowEvent,
        handleSelectAll,
    };
}
