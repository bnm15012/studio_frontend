import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import type { FieldDef, FieldMeta, ViewMode, ViewsApiRef } from "@/core/types";
import { enquiryCruds } from "../../../api/all.api";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import Views from "@/core/crud/Views";
import type { Enquiry } from "../../../api/types";
import { useAppUI } from "@/context/UIContext";
import EnquiryCardComponent from "./EnquiryCardComponent";

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "enquiryId",
    root: "branchId",
};

const VIEWS: ViewMode[] = ["LIST", "CARD"];

const FIELDS: FieldDef<Enquiry>[] = [
    {
        name: "enquiryDate",
        label: "Date",
        show: true,
        type: "DATETIME",
        defaultValue: getCurrentDateTimeLocal(),
    },
    { name: "name", label: "Name", show: true },
    { name: "contact", label: "Contact", show: true, type: "NUMBER" },
    { name: "enquiryPurpose", label: "Purpose", show: true },
];

const Enquiry: React.FC = () => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <Box>
                <Views<Enquiry>
                    actionBarProps={{ qrProps: { link: "enquiry-form" } }}
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
