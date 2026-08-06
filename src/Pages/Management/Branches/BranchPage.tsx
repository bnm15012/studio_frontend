import { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box, IconButton, Typography, Tooltip, useTheme, alpha } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAppSelector } from "@/state";
import { usersCruds } from "@/api/all.api";
import type { RootState } from "@/state";
import Views from "@/core/crud/Views";
import type { User } from "@/api/types";
import { useAppUI } from "@/context/UIContext";
import UserCard from "@/Pages/Management/Branches/ManagerUser/UserCard";
import UserAccessButton from "@/Pages/Management/Branches/ManagerUser/UserAccessButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import type { FieldDef, FieldMeta, ViewMode, ViewsApiRef } from "@/core/types";

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "userId",
    root: "branchId",
};

const VIEWS: ViewMode[] = ["LIST", "CARD"];

const FIELDS: FieldDef<User>[] = [
    { show: true, name: "userName", label: "User Name" },
    { show: true, name: "email", label: "Email" },
    { show: false, name: "password", label: "password", defaultValue: "123456" },
    { show: true, name: "enabled", label: "Active", defaultValue: true, type: "BOOL" },
    { show: true, name: "phone", label: "Phone", type: "NUMBER" },
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
    const { isMobile, studio } = useAppUI();
    const theme = useTheme();
    const navigate = useNavigate();
    const api = useRef<ViewsApiRef>({});
    const selectedBranch = useAppSelector((state: RootState) => state.branch.selectedBranch);

    if (!selectedBranch) {
        throw new Error("No branch selected");
    }

    const beforeAdd = async (row: User) => {
        const updatedRow = {
            ...row,
        } as User & { branchId?: number; studioEntry?: unknown };
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
        <FlexBetweenColumn gap={1}>
            <FlexBetween
                sx={{
                    mt: 2,
                    width: "100%",
                    pb: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Tooltip title="Back to Branches">
                        <IconButton
                            onClick={() => navigate(`/management/branch`)}
                            sx={{
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                                },
                            }}
                            size="small"
                            color="primary"
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                            {selectedBranch.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Branch Manager Management
                        </Typography>
                    </Box>
                </Box>
            </FlexBetween>

            <Box sx={{ width: "100%" }}>
                <Views<User>
                    actionBarProps={{
                        addBtnText: "Add Manager",
                        search: false,
                        refresh: true,
                    }}
                    beforeAdd={beforeAdd}
                    beforeUpdate={beforeAdd}
                    tableName={"users"}
                    tableCruds={usersCruds}
                    size={LIMIT}
                    key={"users"}
                    fields={FIELDS}
                    actions={[{ name: "delete", hide: true, onClick: () => {} }]}
                    rootId={selectedBranch.branchId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[!isMobile ? 0 : 1] ?? "LIST"}
                    fieldToDisplayOnDelete="userName"
                    CardContentComponent={UserCard}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default BranchPage;
