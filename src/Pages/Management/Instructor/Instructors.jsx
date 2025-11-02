import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Views from "../../../Components/Views/Views";
import { instructorsCruds } from "../../../api/all.api";
import InstructorCard from "./InstructorCard";
import { useUI } from "../../../context/UIContext";
import { usePageSearch } from "../../../hooks/useSearch";
import SearchField from "../../../Components/SearchField";

const size = 7;
const FIELDS = [
    { show: true, name: "imageUrl", label: "Image", type: "IMAGE", extraProp: { size: "30px" } },
    { show: true, name: "name", label: "Name" },
    { show: true, name: "email", label: "Email" },
    { show: true, name: "phone", label: "Phone" },
    {
        show: true,
        name: "dob",
        label: "Date of Birth",
        type: "DATE",
    },
    {
        show: true,
        name: "instructorStatus",
        label: "Status",
        type: "STATUS",
        getValue: (value) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {value}
            </Box>
        ),
        extraProp: { readOnly: true },
    },
    { show: false, name: "address", label: "Address" },
    { show: false, name: "emergencyContactNumber", label: "Emergency Contact Number" },
    { show: false, name: "bankAccountDetails.accountNumber", label: "Account Number" },
    { show: false, name: "bankAccountDetails.bankName", label: "Bank Name" },
    { show: false, name: "bankAccountDetails.branchName", label: "Branch Name" },
    { show: false, name: "bankAccountDetails.ifscCode", label: "IFSE CODE" },
    { show: false, name: "bankAccountDetails.upiId", label: "UPI" },
];

const FIELD_META = {
    primary: "instructorId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Instructors = () => {
    const navigate = useNavigate();
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const { triggerSearch } = usePageSearch();

    return (
        <FlexBetweenColumn sx={{ overflow: "auto" }}>
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={triggerSearch} filterOptions={filterOptions} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate("/management/instructors/NEW");
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Views
                tableName={"instructors"}
                tableCruds={instructorsCruds}
                size={size}
                key={"expenses"}
                fields={FIELDS}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                CardContentComponent={InstructorCard}
                editMode={"FORM"}
            />
        </FlexBetweenColumn>
    );
};

export default Instructors;
