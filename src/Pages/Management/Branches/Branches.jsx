import { useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { branchCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import BranchCardView from "./BranchCardView";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";

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
    { show: true, name: "isActive", label: "Active", type: FIELD_TYPES.BOOL },
];

const Branches = () => {
    const { isMobile } = useUI();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const api = useRef({});
    const studio = useSelector((state) => state.auth.studio);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <Box ml={"auto"}></Box>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        api.current?.addNewRow();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    Add new Branch
                </Button>
            </FlexBetween>
            <Box>
                <Views
                    tableName={"branch"}
                    tableCruds={branchCruds}
                    actions={[
                        { name: "delete", hide: true, enabled: false },
                        {
                            name: "users",
                            icon: <GroupIcon />,
                            enabled: true,
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
