import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePageSearch } from "../../../hooks/useSearch";

export const useTableData = ({
    tableCruds,
    tableName,
    token,
    showAlert,
    size,
    rootId,
    currentView,
    setLoading,
}) => {
    const dispatch = useDispatch();
    const tableState = useSelector((state) => state[tableName]);

    const { subscribe } = usePageSearch();

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKeys, setFilterKeys] = useState({});

    const fetchData = useCallback(async () => {
        dispatch(
            tableCruds.getAll(
                showAlert,
                setLoading,
                token,
                { page, searchTerm, size, ...filterKeys },
                rootId,
                currentView === "CARD",
            ),
        );
    }, [
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
        async (formKey) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading));
        },
        [dispatch, tableCruds, token, showAlert, setLoading],
    );

    const handlePageChange = useCallback((page) => {
        setPage(page);
    }, []);

    const loadMore = useCallback(
        () => handlePageChange((tableState?.currentPage || 1) + 1),
        [handlePageChange, tableState?.currentPage],
    );

    useEffect(() => {
        const unsubscribe = subscribe((term, filters) => {
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
