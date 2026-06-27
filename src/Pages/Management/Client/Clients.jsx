import { useRef } from "react";
import { FlexBetween }Column from "../../../Components/FlexBoxColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { clientCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ClientCardComponent from "./ClientCardComponent";
import ActionBar from "../../../Components/ActionBar";

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
