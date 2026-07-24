import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { clientCruds } from "../../../api/all.api";
import Views from "@/core/crud/Views";
import type { Client } from "../../../api/types";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import ClientCardComponent from "./ClientCardComponent";
import ActionBar from "@/core/components/layout/ActionBar";

const clientTypes = ["GROUP", "INDIVIDUAL", "COMPANY"];

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "clientId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"] as const;

const FIELDS: FieldDef<Client>[] = [
    { show: true, name: "groupName", label: "Group Name" },
    { show: true, name: "pocName", label: "Poc Name" },
    { show: true, name: "pocPhone", label: "Group Phone", type: "NUMBER" },
    { show: true, name: "pocEmail", label: "Group Email" },
    {
        show: true,
        name: "clientType",
        label: "Client Type",
        type: "SELECT",
        getValue: (value) => (value ? { value, key: String(value) } : null),
        extraProp: {
            getOptions: async () => clientTypes.map((a) => ({ key: a, value: a })),
        },
    },
    { show: true, name: "notes", label: "Notes" },
];

const Clients: React.FC = () => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views<Client>
                    tableName={"clients"}
                    tableCruds={clientCruds}
                    size={LIMIT}
                    key={"clients"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
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
