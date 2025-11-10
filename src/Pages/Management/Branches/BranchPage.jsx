import { useState } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { usersCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
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
    { show: false, name: "role", label: "Role", defaultValue: "Manager" },
    { show: true, name: "enabled", label: "Active", defaultValue: true, type: FIELD_TYPES.BOOL },
    { show: true, name: "phone", label: "Phone", type: FIELD_TYPES.NUMBER },
    {
        show: true,
        name: "userAccessEntry",
        label: "Access Rights",
        type: "CUSTOME",
        extraProp: {
            CustomComponent: UserAccessButton,
        },
    },
];

const BranchPage = () => {
    const { isMobile } = useUI();
    const navigate = useNavigate();
    const [addNewFunc, setAddNewFunc] = useState(null);
    const selectedBranch = useSelector((state) => state.branch.selectedBranch);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <IconButton onClick={() => navigate(`/management/branch`)}>
                    <ArrowBackIcon sx={{ color: "black" }} />
                </IconButton>
                <Typography variant="h5" fontWeight={"bold"} my={"auto"}>
                    Branch: {selectedBranch.name}
                </Typography>
                <Box ml={"auto"}></Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon sx={{ padding: 0, margin: "auto" }} />}
                    onClick={() => {
                        if (addNewFunc) addNewFunc();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    Add New Manager
                </Button>
            </FlexBetween>
            <Box>
                <Views
                    tableName={"users"}
                    tableCruds={usersCruds}
                    size={LIMIT}
                    key={"users"}
                    fields={FIELDS}
                    actions={[{ name: "delete", hide: true }]}
                    rootId={selectedBranch.branchId}
                    fieldsMeta={FIELD_META}
                    onSetAddNewFunc={setAddNewFunc}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="userName"
                    CardContentComponent={UserCard}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default BranchPage;
