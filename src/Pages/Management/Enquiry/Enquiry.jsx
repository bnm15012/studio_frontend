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
import QrForm from "../../../Components/QrForm.jsx";
import { useUI } from "../../../context/UIContext.jsx";
import { enquiryCruds } from "../../../api/all.api.js";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes.js";

const size = 7;

const FIELD_META = {
    primary: "enquiryId",
    root: "branchId",
};

const FIELDS = [
    { name: "enquiryDate", label: "Date", show: true, type: FIELD_TYPES.DATE },
    { name: "name", label: "Name", show: true },
    { name: "contact", label: "Contact", show: true, type: FIELD_TYPES.NUMBER },
    { name: "enquiryPurpose", label: "Purpose", show: true },
];
const Enquiry = () => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const [loading, setLoading] = useState(false);
    const [addNewFunc, setAddNewFunc] = useState(null);

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
                <QrForm title="" link={"enquiry-form"} />
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
                    onClick={() => {
                        if (addNewFunc) addNewFunc();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <EnquiryTable
                    initialData={enquiry.items ?? []}
                    fields={FIELDS}
                    fieldsMeta={FIELD_META}
                    setNewRow={setNewRow}
                    onSetAddNewFunc={setAddNewFunc}
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
