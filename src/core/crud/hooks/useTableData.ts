/** Hook that fetches and manages table data via Redux dispatch, handling pagination, search, filtering, and caching through CrudThunks. */
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state";
import { usePageSearch } from "../../hooks/useSearch";
import { ShowAlertFn, SetLoadingFn, CrudThunks, CrudState } from "../../types";

export interface UseTableDataParams<T extends Record<string, unknown> = Record<string, unknown>> {
    tableCruds: CrudThunks<T>;
    tableName: string;
    token: string;
    showAlert: ShowAlertFn;
    size: number;
    rootId: number;
    currentView: string;
    setLoading: SetLoadingFn;
    defaultParams?: Record<string, unknown>;
}

export const useTableData = <T extends Record<string, unknown> = Record<string, unknown>>({
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
        (state: Record<string, unknown>) => (state[tableName] as CrudState) || ({} as CrudState),
    );

    const { subscribe } = usePageSearch();

    // Lazy-initialize from the Redux store so that if the store already has
    // cached items (e.g. back-navigation), the component never renders with an
    // empty array first — eliminating the visible flash/flicker on mount.
    const [data, setData] = useState<T[]>(() => (tableState.items as T[]) ?? []);
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
        setData((tableState.items as T[]) ?? []);
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
