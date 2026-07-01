import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state";
import { usePageSearch } from "../../hooks/useSearch";
import { ShowAlertFn, SetLoadingFn, CrudThunks, CrudState, GenericItem } from "../../types";

export interface UseTableDataParams {
    tableCruds: CrudThunks;
    tableName: string;
    token: string | null | undefined;
    showAlert: ShowAlertFn;
    size: number;
    rootId: string | number | null | undefined;
    currentView: string;
    setLoading: SetLoadingFn;
    defaultParams?: Record<string, unknown>;
}

export const useTableData = ({
    tableCruds,
    tableName,
    token,
    showAlert,
    size,
    rootId,
    currentView,
    setLoading,
    defaultParams = {},
}: UseTableDataParams) => {
    const dispatch = useAppDispatch();
    const tableState = useAppSelector((state: Record<string, unknown>) => (state[tableName] as CrudState) || {});

    const { subscribe } = usePageSearch();

    // Lazy-initialize from the Redux store so that if the store already has
    // cached items (e.g. back-navigation), the component never renders with an
    // empty array first — eliminating the visible flash/flicker on mount.
    const [data, setData] = useState<Record<string, unknown>[]>(() => (tableState.items as Record<string, unknown>[]) ?? []);
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterKeys, setFilterKeys] = useState<Record<string, unknown>>({});

    const fetchData = useCallback(async () => {
        dispatch(
            tableCruds.getAll(
                showAlert,
                setLoading,
                token,
                { page, searchTerm, size, ...defaultParams, ...filterKeys },
                rootId ?? 0,
                currentView === "CARD",
            ) as any,
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
        async (formKey: string | number) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading) as any);
        },
        [dispatch, tableCruds, token, showAlert, setLoading],
    );

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const loadMore = useCallback(
        () => handlePageChange((tableState?.currentPage || 1) + 1),
        [handlePageChange, tableState?.currentPage],
    );

    useEffect(() => {
        const unsubscribe = subscribe((term: string, filters: Record<string, unknown>) => {
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
        setData((tableState.items as Record<string, unknown>[]) ?? []);
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
