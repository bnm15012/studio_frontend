import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import TableWithEditAddDelete from "./TableExpense";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { setExpensePage } from "../../../state/expenseSlice";
import { useUI } from "../../../context/UIContext";
import { getAllDataAPI } from "../../../api/common.api";

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
  const { isEnabled, FEATURE_KEYS } = useUI();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const cachedExpenses = useSelector((state) => state.expense);

  const [newRow, setNewRow] = useState(null);

  const fetchExpenses = useCallback(async (page = 1, searchTerm) => {
    dispatch(getAllDataAPI({ rootId: currentBranch.branchId, token, showAlert, route: "expenses", setData: setExpensePage, setLoading, params: { page, searchTerm, size } }));
  }, [dispatch, currentBranch.branchId, token, showAlert]);


  useEffect(() => {
    isEnabled(FEATURE_KEYS.EXPENSE) && !cachedExpenses.length && fetchExpenses();
  }, [fetchExpenses, cachedExpenses.length, isEnabled, FEATURE_KEYS.EXPENSE]);

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
        <TableWithEditAddDelete
          initialData={(cachedExpenses.pages[page] ?? [])}
          categories={categories}
          branchId={currentBranch.branchId}
          token={token}
          startIndex={(parseInt(page) - 1) * size}
          newRow={newRow}
          setNewRow={setNewRow}
          page={page}
        />
      </Box>
      <FlexBetween>
        <Box></Box>
        <Pagination
          count={cachedExpenses.totalPages}
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
