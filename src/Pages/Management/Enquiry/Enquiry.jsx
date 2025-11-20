import { useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import QrForm from "../../../Components/QrForm.jsx";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes.js";
import { enquiryCruds } from "../../../api/all.api";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil.js";
import Views from "../../../Components/Views/Views.jsx";
import { useUI } from "../../../context/UIContext.jsx";
import EnquiryCardComponent from "./EnquiryCardComponent.jsx";
import SearchField from "../../../Components/SearchField.jsx";
import { usePageSearch } from "../../../hooks/useSearch.js";

const LIMIT = 7;

const FIELD_META = {
    primary: "enquiryId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    {
        name: "enquiryDate",
        label: "Date",
        show: true,
        type: FIELD_TYPES.DATE,
        defaultValue: getCurrentDateTimeUTC(),
    },
    { name: "name", label: "Name", show: true },
    { name: "contact", label: "Contact", show: true, type: FIELD_TYPES.NUMBER },
    { name: "enquiryPurpose", label: "Purpose", show: true },
];

const Enquiry = () => {
    const dispatch = useDispatch();
    const { isMobile } = useUI();
    const { triggerSearch } = usePageSearch();
    const api = useRef({});
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={triggerSearch} />
                <QrForm title="" link={"enquiry-form"} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        dispatch(enquiryCruds.removeAll());
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <RefreshIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        api.current?.addNewRow();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <Views
                    tableName={"enquiries"}
                    tableCruds={enquiryCruds}
                    size={LIMIT}
                    key={"enquiries"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    CardContentComponent={EnquiryCardComponent}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Enquiry;
