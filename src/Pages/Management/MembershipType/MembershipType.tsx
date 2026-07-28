import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import Views from "@/core/crud/Views";
import type { MembershipPackage } from "@/api/types";
import { membershipPackageCruds } from "@/api/all.api";
import { useAppUI } from "@/context/UIContext";
import type { FieldMeta, ViewsApiRef } from "@/core/types";

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "id",
    root: "studioId",
};

const VIEWS = ["LIST"] as const;

const FIELDS = [
    { show: true, name: "membershipPackage", label: "Membership Type" },
    { show: true, name: "days", label: "Days" },
];

const MembershipType: React.FC = () => {
    const api = useRef<ViewsApiRef>({});
    const { studio } = useAppUI();
    return (
        <FlexBetweenColumn>
            <Box>
                <Views<MembershipPackage>
                    actionBarProps={{ search: false, addBtnText: "New Package" }}
                    tableName={"membershipPackages"}
                    tableCruds={membershipPackageCruds}
                    size={LIMIT}
                    key={"membershipPackages"}
                    fields={FIELDS}
                    rootId={studio.studioId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[0]}
                    fieldToDisplayOnDelete="membershipPackage"
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default MembershipType;
