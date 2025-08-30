import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { getAllExpensesAPI } from "./expenses.api";
import { useDispatch, useSelector } from "react-redux";
import TableWithEditAddDelete from "./TableExpense";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { setExpensePage } from "../../../state/expenseSlice";

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
const Expenses = () => {
  const showAlert = useAlert();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const cachedExpenses = useSelector((state) => state.expense);

  const fetchExpenses = useCallback(async (page = 1, searchTerm) => {
    try {
      if (!searchTerm && cachedExpenses && page in cachedExpenses.pages) {
        setExpenses(cachedExpenses.pages[page])
        setTotalPage(cachedExpenses.totalCount)
        return;
      }
      setLoading(true);
      const { data, success, message, totalCount } = await getAllExpensesAPI({
        branchId: currentBranch.branchId,
        page,
        size,
        token,
        searchTerm,
      });

      if (success) {
        setExpenses(data);
        if (!searchTerm)
          dispatch(setExpensePage({ page, expenses: data, totalCount: Math.ceil(totalCount / size) }))
        setTotalPage(Math.ceil(totalCount / size));
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch expenses!", "error");
    } finally {
      setLoading(false);
    }
  }, [currentBranch.branchId, token, dispatch, showAlert]);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    !expenses && fetchExpenses(page);
  }, [page, expenses, loading, fetchExpenses]);

  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    await fetchExpenses(p);
    setLoading(false);
  };

  const handleAddNew = () => {
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
        {expenses && (
          <TableWithEditAddDelete
            initialData={(expenses)}
            categories={categories}
            branchId={currentBranch.branchId}
            token={token}
            startIndex={(parseInt(page) - 1) * size}
            newRow={newRow}
            setNewRow={setNewRow}
            page={page}
          />
        )}
      </Box>
      <FlexBetween>
        <Box></Box>
        <Pagination
          count={totalPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ my: 2 }}
        />
      </FlexBetween>
    </FlexBetweenColumn>
  );
};

export default Expenses;
