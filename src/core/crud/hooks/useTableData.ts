import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state";
import { usePageSearch } from "../../hooks/useSearch";

export interface UseTableDataParams {
    tableCruds: any;
    tableName: string;
    token: string | null | undefined;
    showAlert: (msg: string, type?: any) => void;
    size: number;
    rootId: any;
    currentView: string;
    setLoading: (loading: boolean) => void;
    defaultParams?: Record<string, any>;
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
    const tableState = useAppSelector((state: any) => state[tableName] || {});

    const { subscribe } = usePageSearch();

    // Lazy-initialize from the Redux store so that if the store already has
    // cached items (e.g. back-navigation), the component never renders with an
    // empty array first — eliminating the visible flash/flicker on mount.
    const [data, setData] = useState<any[]>(() => tableState.items ?? []);
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterKeys, setFilterKeys] = useState<Record<string, any>>({});

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
        async (formKey: any) => {
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
        const unsubscribe = subscribe((term: string, filters: any) => {
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
        setData(tableState.items ?? []);
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
