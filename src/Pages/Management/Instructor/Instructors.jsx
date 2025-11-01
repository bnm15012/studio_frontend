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
import { OpenInNew } from "@mui/icons-material";

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

const Instructors = () => {
    const navigate = useNavigate();
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    const onClickOnRow = (row) => {
        navigate(`/management/instructor/${row.instructorId}`);
    };

    return (
        <FlexBetweenColumn sx={{ overflow: "auto" }}>
            <FlexBetween paddingBottom={2} gap={1}>
                <Box ml={"auto"}></Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate("/management/instructor/NEW");
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Views
                tableName={"instructors"}
                tableCruds={instructorsCruds}
                actions={[
                    { name: "edit", hide: true },
                    {
                        name: "view",
                        icon: <OpenInNew />,
                        sx: { color: "blue" },
                        enabled: true,
                        onClick: onClickOnRow,
                    },
                ]}
                size={size}
                key={"expenses"}
                fields={FIELDS}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                CardContentComponent={InstructorCard}
                dialogEdit={false}
            />
        </FlexBetweenColumn>
    );
};

export default Instructors;
