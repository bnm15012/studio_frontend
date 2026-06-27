import { useRef } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { clientCruds } from "../../../api/all.api";
import Views from "../../../core/crud/Views";
import { FIELD_TYPES } from "../../../core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ClientCardComponent from "./ClientCardComponent";
import ActionBar from "../../../core/components/layout/ActionBar";

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
        getValue: (value) => value && { value, key: value },
        extraProp: {
            getOptions: async (search, page, limit) =>
                clientTypes.map((a) => ({ key: a, value: a })),
        },
    },
    { show: true, name: "notes", label: "Notes" },
];
const Clients = () => {
    const { isMobile } = useUI();
    const api = useRef({});
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views
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
