import { useCallback, useEffect, useState } from "react";
import PaymentTable from "./PaymentTable";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllpaymentsAPI } from "./payment.api";
import Loading from "../../../Components/Loading/Loading";
import { Box, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import FlexBetween from "../../../Components/FlexBetween";
import { setPaymentPage } from "../../../state/paymentSlice";

const size = 7;
const Payments = () => {
  const showAlert = useAlert();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paymentsData, setPaymentsData] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const [newRow, setNewRow] = useState(null);
  const cachedPayments = useSelector((state) => state.payment);

  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);

  const fetchPayments = useCallback(async (page = 1, searchTerm) => {
    try {
      if (!searchTerm && cachedPayments && page in cachedPayments.pages) {
        setPaymentsData(cachedPayments.pages[page])
        setTotalPage(cachedPayments.totalCount)
        return;
      }
      setLoading(true);
      const { data, success, message, totalCount } = await getAllpaymentsAPI({
        branchId: currentBranch.branchId,
        page,
        size,
        token,
        searchTerm,
      });

      if (success) {
        setPaymentsData(data);
        setTotalPage(Math.ceil(totalCount / size));
        if (!searchTerm) {
          dispatch(setPaymentPage({ page, payments: data, totalCount: Math.ceil(totalCount / size) }))
        }
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch payments!", "error");
    } finally {
      setLoading(false);
    }
  }, [currentBranch.branchId, token, dispatch, showAlert]);

  // const handleAddNew = () => {
  //   setNewRow({
  //     payeeType: "",
  //     payeeId: 0,
  //     amount: "",
  //     paymentDate: getCurrentDateTimeUTC(),
  //     status: "Pending",
  //     paymentType: "CASH",
  //     message: "",
  //     branchId: currentBranch.branchId,
  //   });
  // };

  useEffect(() => {
    !paymentsData && fetchPayments();
  }, [fetchPayments, paymentsData]);

  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    await fetchPayments(p);
    setLoading(false);
  };



  return (
    <FlexBetweenColumn>
      {loading && <Loading />}
      <FlexBetween paddingBottom={2} gap={1}>
        <SearchField handleSearch={(searchTerm) => fetchPayments(1, searchTerm)} />
      </FlexBetween>
      <Box>
        {paymentsData && (
          <PaymentTable
            initialData={paymentsData}
            branchId={currentBranch.branchId}
            token={token}
            newRow={newRow}
            startIndex={(parseInt(page) - 1) * size}
            setNewRow={setNewRow}
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

export default Payments;
