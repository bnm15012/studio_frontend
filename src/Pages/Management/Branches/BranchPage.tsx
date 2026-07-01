import { useRef } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box, Button, IconButton, Typography } from "@mui/material";
import { FlexBetween } from "../../../core/components/layout/FlexBox";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { usersCruds } from "../../../api/all.api";
import Views from "../../../core/crud/Views";
import { FIELD_TYPES } from "../../../core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import UserCard from "./ManagerUser/UserCard";
import UserAccessButton from "./ManagerUser/UserAccessButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const LIMIT = 7;

const FIELD_META = {
    primary: "userId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "userName", label: "User Name" },
    { show: true, name: "email", label: "Email" },
    { show: false, name: "password", label: "password", defaultValue: "123456" },
    { show: true, name: "enabled", label: "Active", defaultValue: true, type: FIELD_TYPES.BOOL },
    { show: true, name: "phone", label: "Phone", type: FIELD_TYPES.NUMBER },
    {
        show: true,
        name: "userAccessEntry",
        label: "Access Rights",
        type: "CUSTOM",
        defaultValue: {},
        extraProp: {
            CustomComponent: UserAccessButton,
        },
    },
];

const BranchPage = () => {
    const { isMobile } = useUI();
    const navigate = useNavigate();
    const api = useRef({});
    const studio = useSelector((s) => s.auth.studio);
    const selectedBranch = useSelector((state: any) => state.branch.selectedBranch);

    const beforeAdd = async (row) => {
        const updatedRow = { ...row };
        delete updatedRow["branchId"];
        updatedRow["studioEntry"] = {
            studioId: studio.studioId,
            branchList: [
                {
                    branchId: selectedBranch.branchId,
                },
            ],
        };
        return updatedRow;
    };
    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <IconButton onClick={() => navigate(`/management/branch`)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={"bold"} my={"auto"}>
                    Branch: {selectedBranch.name}
                </Typography>
                <Box ml={"auto"}></Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ padding: 0, margin: "auto" }} />}
                    onClick={() => {
                        api.current?.addNewRow();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    Add Manager
                </Button>
            </FlexBetween>
            <Box>
                <Views
                    beforeAdd={beforeAdd}
                    beforeUpdate={beforeAdd}
                    tableName={"users"}
                    tableCruds={usersCruds}
                    size={LIMIT}
                    key={"users"}
                    fields={FIELDS}
                    actions={[{ name: "delete", hide: true }]}
                    rootId={selectedBranch.branchId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="userName"
                    CardContentComponent={UserCard}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default BranchPage;
