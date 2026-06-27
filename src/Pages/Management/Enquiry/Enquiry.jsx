import { useRef } from "react";
import { FlexBetween }Column from "../../../Components/FlexBoxColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes.js";
import { enquiryCruds } from "../../../api/all.api";
import { getCurrentDateTimeLocal } from "../../../core/util/DateUtil.js";
import Views from "../../../Components/Views/Views.jsx";
import { useUI } from "../../../context/UIContext.jsx";
import EnquiryCardComponent from "./EnquiryCardComponent.jsx";
import ActionBar from "../../../Components/ActionBar.jsx";

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
        defaultValue: getCurrentDateTimeLocal(),
    },
    { name: "name", label: "Name", show: true },
    { name: "contact", label: "Contact", show: true, type: FIELD_TYPES.NUMBER },
    { name: "enquiryPurpose", label: "Purpose", show: true },
];

const Enquiry = () => {
    const { isMobile } = useUI();
    const api = useRef({});
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} qrProps={{ link: "enquiry-form" }} />
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
