import { useAppSelector } from "@/state";
import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { clientCruds } from "../../../api/all.api";
import Views from "@/core/crud/Views";
import { FIELD_TYPES } from "@/core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ClientCardComponent from "./ClientCardComponent";
import ActionBar from "@/core/components/layout/ActionBar";

const clientTypes = ["GROUP", "INDIVIDUAL", "COMPANY"];

const LIMIT = 7;

const FIELD_META = {
    primary: "clientId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "groupName", label: "Group Name" },
    { show: true, name: "pocName", label: "Poc Name" },
    { show: true, name: "pocPhone", label: "Group Phone", type: FIELD_TYPES.NUMBER },
    { show: true, name: "pocEmail", label: "Group Email" },
    {
        show: true,
        name: "clientType",
        label: "Client Type",
        type: FIELD_TYPES.SELECT,
        getValue: (value: any) => value && { value, key: value },
        extraProp: {
            getOptions: async (search: string, page: number, limit: number) =>
                clientTypes.map((a) => ({ key: a, value: a })),
        },
    },
    { show: true, name: "notes", label: "Notes" },
];

const Clients: React.FC = () => {
    const { isMobile } = useUI();
    const api = useRef<any>({});
    const currentBranch = useAppSelector((state: any) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views
                    tableName={"clients"}
                    tableCruds={clientCruds}
                    size={LIMIT}
                    key={"clients"}
                    fields={FIELDS as any}
                    rootId={currentBranch?.branchId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="groupName"
                    CardContentComponent={ClientCardComponent}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Clients;
