import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import EnquiryTable from "./EnquiryTable.jsx";
import SearchField from "../../../Components/SearchField.jsx";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil.js";
import QrForm from "../../../Components/QrForm.jsx";
import { useUI } from "../../../context/UIContext.jsx";
import { enquiryCruds } from "../../../api/all.api.js";

const size = 7;
const FIELDS = [
    { name: "name", label: "Name", type: "char" },
    { name: "contact", label: "Contact", type: "number" },
    { name: "enquiryPurpose", label: "Purpose", type: "char" },
    { name: "enquiryDate", label: "Date", type: "date" },
];
const Enquiry = () => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState("");
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [page, setPage] = useState(1);
    const enquiry = useSelector((state) => state.enquiry);

    const [newRow, setNewRow] = useState(null);
    const fetchEnquiry = useCallback(
        async (page = 1) => {
            dispatch(
                enquiryCruds.getAll(
                    enquiry,
                    showAlert,
                    setLoading,
                    token,
                    { page, searchTerm, size },
                    currentBranch.branchId,
                ),
            );
        },
        [dispatch, enquiry, showAlert, token, searchTerm, currentBranch.branchId],
    );

    useEffect(() => {
        isEnabled(FEATURE_KEYS.ENQUIRY) && !enquiry.items.length && fetchEnquiry();
    }, [isEnabled, FEATURE_KEYS.ENQUIRY, enquiry.items.length, fetchEnquiry]);

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
        await fetchEnquiry(p);
        setLoading(false);
    };

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField
                    handleSearch={(searchTerm) => {
                        fetchEnquiry(1);
                        setSearchTerm(searchTerm);
                    }}
                />
                <QrForm qrSize={480} title="" link={"enquiry-form"} />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={newRow != null}
                    onClick={() => {
                        dispatch(enquiryCruds.removeAll());
                        fetchEnquiry(page);
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
                <EnquiryTable
                    initialData={enquiry.items ?? []}
                    branchId={currentBranch.branchId}
                    token={token}
                    newRow={newRow}
                    fiels={FIELDS}
                    setNewRow={setNewRow}
                />
            </Box>
            <FlexBetween>
                <Box></Box>
                <Pagination
                    count={enquiry.totalPages || 1}
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
