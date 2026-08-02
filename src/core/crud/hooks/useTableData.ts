import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state";
import { usePageSearch } from "@/core/hooks/useSearch";
import { ShowAlertFn, SetLoadingFn, CrudThunks, CrudState, RequestParams } from "@/core/types";
import { FilterKeys } from "@/core/state/stateTypes";
import type { CrudRecord } from "@/api/types";

export interface UseTableDataParams<T extends CrudRecord = CrudRecord> {
    tableCruds: CrudThunks<T>;
    tableName: string;
    token: string;
    showAlert: ShowAlertFn;
    size: number;
    rootId: number;
    currentView: string;
    setLoading: SetLoadingFn;
    defaultParams?: RequestParams & FilterKeys;
}

export const useTableData = <T extends CrudRecord = CrudRecord>({
    tableCruds,
    tableName,
    token,
    showAlert,
    size,
    rootId,
    currentView,
    setLoading,
    defaultParams = {},
}: UseTableDataParams<T>) => {
    const dispatch = useAppDispatch();
    const tableState = useAppSelector(
        (state) =>
            ((state as unknown as Record<string, CrudState<T>>)[tableName] as CrudState<T>) ||
            ({} as CrudState<T>),
    );

    const { subscribe } = usePageSearch();

    // Lazy-initialize from the Redux store so that if the store already has
    // cached items (e.g. back-navigation), the component never renders with an
    // empty array first — eliminating the visible flash/flicker on mount.
    const [data, setData] = useState<T[]>(() => (tableState.items as unknown as T[]) ?? []);
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterKeys, setFilterKeys] = useState<FilterKeys>({});

    const fetchData = useCallback(async () => {
        dispatch(
            tableCruds.getAll(
                showAlert,
                setLoading,
                token,
                { page, searchTerm, size, ...defaultParams, ...filterKeys },
                rootId,
                currentView === "CARD",
            ),
        );
    }, [
        defaultParams,
        currentView,
        dispatch,
        filterKeys,
        page,
        rootId,
        searchTerm,
        setLoading,
        showAlert,
        size,
        tableCruds,
        token,
    ]);

    const fetchOne = useCallback(
        async (formKey: number) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading));
        },
        [dispatch, tableCruds, token, showAlert, setLoading],
    );

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const loadMore = useCallback(
        () => handlePageChange((tableState.currentPage || 1) + 1),
        [handlePageChange, tableState.currentPage],
    );

    useEffect(() => {
        const unsubscribe = subscribe((term: string, filters: FilterKeys) => {
            setPage(1);
            setSearchTerm(term);
            setFilterKeys(filters);
        });

        return unsubscribe;
    }, [subscribe]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setData((tableState.items as unknown as T[]) ?? []);
    }, [tableState.items]);

    return {
        data,
        setData,
        tableState,
        fetchOne,
        handlePageChange,
        loadMore,
    };
};
