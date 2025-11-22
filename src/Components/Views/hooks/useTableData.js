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
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKeys, setFilterKeys] = useState({});

    const fetchData = useCallback(
        async (page = 1, searchTerm = "", filterKeys = {}) => {
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
        },
        [dispatch],
    );

    const fetchOne = useCallback(
        async (formKey) => {
            dispatch(tableCruds.getById(formKey, token, showAlert, setLoading));
        },
        [dispatch, tableCruds, token, showAlert, setLoading],
    );

    const handlePageChange = useCallback(
        (page) => fetchData(page, searchTerm, filterKeys),
        [fetchData, searchTerm, filterKeys],
    );

    const loadMore = useCallback(
        () => handlePageChange((tableState?.currentPage || 1) + 1),
        [handlePageChange, tableState?.currentPage],
    );

    useEffect(() => {
        const unsubscribe = subscribe((term, filters) => {
            fetchData(1, term, filters);
            setSearchTerm(term);
            setFilterKeys(filters);
        });

        return unsubscribe;
    }, [subscribe]);

    useEffect(() => {
        fetchData();
    }, []);

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
