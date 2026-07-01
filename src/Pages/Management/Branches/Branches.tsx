import { useRef } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { branchCruds } from "../../../api/all.api";
import Views from "../../../core/crud/Views";
import { FIELD_TYPES } from "../../../core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import BranchCardView from "./BranchCardView";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import ActionBar from "../../../core/components/layout/ActionBar";

const LIMIT = 7;

const FIELD_META = {
    primary: "branchId",
    root: "studioId",
};

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "name", label: "Name" },
    { show: true, name: "address", label: "Address" },
    { show: true, name: "city", label: "City" },
    { show: true, name: "state", label: "State" },
    { show: true, name: "pincode", label: "Pincode" },
    { show: true, name: "phone", label: "Phone" },
    { show: true, name: "isActive", label: "Active", type: FIELD_TYPES.BOOL, defaultValue: true },
];

const Branches = () => {
    const { isMobile } = useUI();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const api = useRef({});
    const studio = useSelector((state: any) => state.auth.studio);

    return (
        <FlexBetweenColumn>
            <ActionBar search={false} api={api} addBtnText={"New Branch"} refresh={false} />
            <Box>
                <Views
                    tableName={"branch"}
                    tableCruds={branchCruds}
                    actions={[
                        { name: "delete", hide: true, enabled: false, onClick: () => {} },
                        {
                            name: "users",
                            icon: <GroupIcon />,
                            enabled: (row) => row.isActive,
                            sx: { color: "blue" },
                            onClick: (row) => {
                                dispatch(branchCruds.actions.setSelectedBranch(row));
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
