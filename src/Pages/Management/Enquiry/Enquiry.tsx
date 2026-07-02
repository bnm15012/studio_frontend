import { useAppSelector } from "@/state";
import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { FIELD_TYPES } from "@/core/components/fields/FieldTypes";
import { enquiryCruds } from "../../../api/all.api";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import Views from "@/core/crud/Views";
import { useUI } from "../../../context/UIContext";
import EnquiryCardComponent from "./EnquiryCardComponent";
import ActionBar from "@/core/components/layout/ActionBar";

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

const Enquiry: React.FC = () => {
    const { isMobile } = useUI();
    const api = useRef<any>({});
    const currentBranch = useAppSelector((state: any) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} qrProps={{ link: "enquiry-form" }} />
            <Box>
                <Views
                    tableName={"enquiries"}
                    tableCruds={enquiryCruds}
                    size={LIMIT}
                    key={"enquiries"}
                    fields={FIELDS as any}
                    rootId={currentBranch?.branchId}
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
