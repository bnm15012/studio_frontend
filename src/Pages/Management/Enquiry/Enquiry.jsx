import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import { getAllEnquirysAPI } from "./enquiry.api";
import { clearEnquiry, setEnquiries } from "../../../state/enquirySlice.js";
import EnquiryTable from "./EnquiryTable.jsx";
import SearchField from "../../../Components/SearchField.jsx";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil.js";
import QrForm from "../../../Components/QrForm.jsx";

const size = 7;
const Enquiry = () => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);
    const [enquiryData, setEnquiryData] = useState();
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const cachedEnquiry = useSelector((state) => state.enquiry.data);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const fetchEnquiryData = useCallback(
        async (page = 1, searchTerm) => {
            try {
                if (cachedEnquiry.length) {
                    setEnquiryData(cachedEnquiry);
                    return;
                }
                setLoading(true);
                const { data, success, message, totalCount } = await getAllEnquirysAPI({
                    branchId: currentBranch.branchId,
                    token,
                    size,
                    page,
                    searchTerm,
                });

                if (success) {
                    setEnquiryData(data);
                    setTotalPage(Math.ceil(totalCount / size));
                    dispatch(setEnquiries(data));
                } else {
                    showAlert(message, "error");
                }
            } catch (error) {
                console.error(error);
                showAlert("Failed to fetch expenses!", "error");
            } finally {
                setLoading(false);
            }
        },
        [cachedEnquiry, currentBranch.branchId, token, dispatch, showAlert],
    );
    const [newRow, setNewRow] = useState(null);

    useEffect(() => {
        !enquiryData && fetchEnquiryData();
    }, [enquiryData, loading, fetchEnquiryData]);

    const handleAddNew = () => {
        setNewRow({
            enquiryId: undefined,
            name: "",
            contact: "",
            enquiryPurpose: "",
            enquiryDate: getCurrentDateTimeUTC(),
            branchId: currentBranch.branchId,
        });
    };

    const handlePageChange = async (e, p) => {
        setLoading(true);
        setPage(p);
        await fetchEnquiryData(p);
        setLoading(false);
    };

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={(searchTerm) => fetchEnquiryData(1, searchTerm)} />
                <QrForm qrSize={480} title="" link={"enquiry-form"} />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={newRow != null}
                    onClick={() => {
                        dispatch(clearEnquiry());
                        fetchEnquiryData(page);
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <RefreshIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={newRow != null}
                    onClick={() => handleAddNew()}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                {enquiryData && (
                    <EnquiryTable
                        initialData={enquiryData}
                        branchId={currentBranch.branchId}
                        token={token}
                        newRow={newRow}
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

export default Enquiry;
