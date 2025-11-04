import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Views from "../../../Components/Views/Views";
import { instructorsAssignmentsCruds, instructorsCruds } from "../../../api/all.api";
import InstructorCard from "./InstructorCard";
import { useUI } from "../../../context/UIContext";
import { usePageSearch } from "../../../hooks/useSearch";
import SearchField from "../../../Components/SearchField";
import PropTypes from "prop-types";

const size = 7;
const FIELDS = [
    {
        show: true,
        section: "Personal Details",
        name: "imageUrl",
        label: "Image",
        type: "IMAGE",
        extraProp: { size: "30px" },
    },
    { show: true, section: "Personal Details", name: "name", label: "Name" },
    { show: true, section: "Personal Details", name: "email", label: "Email" },
    { show: true, section: "Personal Details", name: "phone", label: "Phone" },
    {
        show: true,
        section: "Personal Details",
        name: "dob",
        label: "Date of Birth",
        type: "DATE",
    },
    {
        show: true,
        section: "Personal Details",
        name: "instructorStatus",
        label: "Status",
        // type: "STATUS",
        getValue: (value) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {value}
            </Box>
        ),
        extraProp: { readOnly: true },
    },
    { show: false, section: "Personal Details", name: "address", label: "Address" },
    {
        show: false,
        section: "Personal Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact Number",
    },
    {
        show: false,
        section: "Bank Details",
        name: "bankAccountDetails.accountNumber",
        label: "Account Number",
    },
    {
        show: false,
        section: "Bank Details",
        name: "bankAccountDetails.bankName",
        label: "Bank Name",
    },
    {
        show: false,
        section: "Bank Details",
        name: "bankAccountDetails.branchName",
        label: "Branch Name",
    },
    {
        show: false,
        section: "Bank Details",
        name: "bankAccountDetails.ifscCode",
        label: "IFSE CODE",
    },
    { show: false, section: "Bank Details", name: "bankAccountDetails.upiId", label: "UPI" },
    // {
    //     show: false,
    //     name: "assignments",
    //     label: "Contracts",
    //     type: "VIEW",
    //     cruds: instructorsAssignmentsCruds,
    //     tableName: "instructorActivities",
    // },
];

const FIELD_META = {
    primary: "instructorId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Instructors = ({ ID }) => {
    const navigate = useNavigate();
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const { triggerSearch } = usePageSearch();

    return (
        <FlexBetweenColumn sx={{ overflow: "auto" }}>
            {!ID && (
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
            )}
            <Views
                formKey={ID}
                tableName={"instructors"}
                tableCruds={instructorsCruds}
                size={size}
                key={"instructors"}
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

Instructors.propTypes = {
    page: PropTypes.string.isRequired,
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Instructors;
