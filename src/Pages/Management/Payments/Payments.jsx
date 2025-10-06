import { useCallback, useEffect, useState } from "react";
import PaymentTable from "./PaymentTable";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import { Box, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import FlexBetween from "../../../Components/FlexBetween";
import { setPaymentPage } from "../../../state/paymentSlice";
import { getAllDataAPI } from "../../../api/common.api";

const size = 7;
const Payments = () => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [newRow, setNewRow] = useState(null);
    const cachedPayments = useSelector((state) => state.payment);

    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    const fetchPayments = useCallback(
        async (page = 1, searchTerm = "") => {
            dispatch(
                getAllDataAPI({
                    rootId: currentBranch.branchId,
                    token,
                    showAlert,
                    route: "payments",
                    setData: setPaymentPage,
                    setLoading,
                    params: { size, page, searchTerm },
                }),
            );
        },
        [dispatch, currentBranch.branchId, token, showAlert],
    );

    useEffect(() => {
        !cachedPayments.length && fetchPayments();
    }, [cachedPayments.length, fetchPayments]);

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
                <PaymentTable
                    initialData={cachedPayments.pages[page] ?? []}
                    branchId={currentBranch.branchId}
                    token={token}
                    newRow={newRow}
                    startIndex={(parseInt(page) - 1) * size}
                    setNewRow={setNewRow}
                />
            </Box>
            <FlexBetween>
                <Box></Box>
                <Pagination
                    count={cachedPayments.totalPages}
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
