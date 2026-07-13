import { useAppDispatch } from "@/state";
import { useRef } from "react";
import { FlexBetweenColumn } from "../../../core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { branchCruds } from "../../../api/all.api";
import type { Branch } from "../../../api/types";
import Views from "@/core/crud/Views";
import type { FieldDef, ViewsApiRef } from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import BranchCardView from "./BranchCardView";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import ActionBar from "@/core/components/layout/ActionBar";

interface BranchActions {
    setSelectedBranch: (branch: Branch) => { type: string; payload: Branch };
}

const LIMIT = 12;

const FIELD_META = {
    primary: "branchId",
    root: "studioId",
};

const VIEWS = ["LIST", "CARD"] as const;

const FIELDS: FieldDef<Branch>[] = [
    { show: true, name: "name", label: "Name" },
    { show: true, name: "address", label: "Address" },
    { show: true, name: "city", label: "City" },
    { show: true, name: "state", label: "State" },
    { show: true, name: "pincode", label: "Pincode" },
    { show: true, name: "phone", label: "Phone" },
    { show: true, name: "isActive", label: "Active", type: "BOOL", defaultValue: true },
];

const Branches = () => {
    const { isMobile, studio } = useAppUI();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <ActionBar search={false} api={api} addBtnText={"New Branch"} refresh={false} />
            <Box>
                <Views<Branch>
                    tableName={"branch"}
                    tableCruds={branchCruds}
                    actions={[
                        { name: "delete", hide: true, enabled: false, onClick: () => {} },
                        {
                            name: "users",
                            icon: <GroupIcon />,
                            enabled: (row) => !!row.isActive,
                            sx: { color: "primary.main" },
                            onClick: (row) => {
                                dispatch(
                                    (
                                        branchCruds.actions as unknown as BranchActions
                                    ).setSelectedBranch(row as Branch),
                                );
                                navigate(`/management/branch/${row.branchId}`);
                            },
                        },
                    ]}
                    size={LIMIT}
                    key={"branch"}
                    fields={FIELDS}
                    rootId={studio.studioId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="amount"
                    CardContentComponent={BranchCardView}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Branches;
