import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import TableWithEditAddDelete from "./TableExpense";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { useUI } from "../../../context/UIContext";
import { expenseCruds } from "../../../api/all.api";

const categories = [
    "ELECTRICITY",
    "SALARY",
    "MAINTENANCE",
    "RENT",
    "SUPPLIES",
    "MARKETING",
    "OTHER",
];
const size = 7;

// const fields = [
//     { key: "description", label: "Description", type: "text" },
//     { key: "amount", label: "Amount", type: "number" },
//     { key: "expenseDate", label: "Expense Date", type: "date" },
//     { key: "expenseCategory", label: "Expense Category", type: "select", options: categories },
// ];
const Expenses = () => {
    const showAlert = useAlert();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const expense = useSelector((state) => state.expense);

    const [newRow, setNewRow] = useState(null);
    const fetchExpenses = useCallback(
        async (page = 1, searchTerm) => {
            dispatch(
                expenseCruds.getAll(
                    expense,
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size },
                    currentBranch.branchId,
                    true,
                ),
            );
        },
        [dispatch, expense, showAlert, token, currentBranch.branchId],
    );

    useEffect(() => {
        isEnabled(FEATURE_KEYS.EXPENSE) && !expense.items.length && fetchExpenses();
    }, [fetchExpenses, expense.items.length, isEnabled, FEATURE_KEYS.EXPENSE]);

    const handleAddNew = () => {
        setPage(1);
        setNewRow({
            expenseId: null,
            description: "",
            amount: "",
            expenseDate: getCurrentDateTimeUTC(),
            expenseCategory: categories[0] || "",
        });
    };

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={(searchTerm) => fetchExpenses(1, searchTerm)} />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={newRow != null}
                    onClick={() => handleAddNew()}
                    sx={{ fontWeight: "bold", padding: "1px" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <TableWithEditAddDelete
                    initialData={expense.items ?? []}
                    categories={categories}
                    branchId={currentBranch.branchId}
                    token={token}
                    newRow={newRow}
                    setNewRow={setNewRow}
                    showMore={() => {
                        fetchExpenses(page + 1);
                        setPage(page + 1);
                    }}
                    page={page}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Expenses;
