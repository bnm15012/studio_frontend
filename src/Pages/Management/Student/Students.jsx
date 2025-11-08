import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Views from "../../../Components/Views/Views";
import { studentsCruds, studentsAssignmentsCruds } from "../../../api/all.api";
import StudentCard from "./StudentCard.jsx";
import { useUI } from "../../../context/UIContext";
import { usePageSearch } from "../../../hooks/useSearch";
import SearchField from "../../../Components/SearchField";
import PropTypes from "prop-types";
import { useState } from "react";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";

const size = 7;

const FIELD_META = {
    primary: "studentId",
    root: "branchId",
};

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
    { show: true, section: "Contact Details", name: "email", label: "Email" },
    { show: true, section: "Contact Details", name: "phone", label: "Phone" },
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
        name: "membershipStatus",
        label: "Status",
        getValue: (value) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {value}
            </Box>
        ),
        extraProp: { readOnly: true },
    },
    { show: false, section: "Contact Details", name: "address", label: "Address" },
    {
        show: false,
        section: "Contact Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact Number",
    },
];
const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Students = ({ ID }) => {
    const navigate = useNavigate();
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const { triggerSearch } = usePageSearch();
    const allActivities = useSelector((state) => state.activity.activities);

    const [selectedActivity, setSelectedActivity] = useState();

    const ASSIGNMENT_FIELD = {
        show: false,
        name: "assignments",
        label: "Contracts",
        type: "VIEW",

        viewProps: {
            tableCruds: studentsAssignmentsCruds,
            tableName: "studentActivities",
            size: 2,
            actions: [],
            fields: [
                {
                    show: true,
                    name: "activityName",
                    label: "Activity",
                    type: "SELECT",
                    getValue: (value) =>
                        // if (editingId) {
                        // setSelectedActivity(allActivities.find((a) => a.activityType === value));
                        // }
                        ({ value, key: value }),
                    editable: (row) => row.assignmentId === "NEW",
                    extraProp: {
                        getOptions: async (search, page, limit) =>
                            allActivities
                                .filter((a) =>
                                    a.activityType.toLowerCase().includes(search.toLowerCase()),
                                )
                                .slice(page * limit, (page + 1) * limit)
                                .map((a) => ({ key: a.activityType, value: a.activityType })),
                    },
                },
                {
                    show: true,
                    name: "membershipType",
                    label: "Membership Type",
                    type: "SELECT",
                    getValue: (value) => ({ value, key: value }),
                    extraProp: {
                        getOptions: async (search, page, limit) =>
                            selectedActivity.batchEntries
                                .filter((b) =>
                                    b.planType.toLowerCase().includes(search.toLowerCase()),
                                )
                                .slice(page * limit, (page + 1) * limit)
                                .map((a) => ({ key: a.planType, value: a.planType })),
                    },
                },
                { show: true, name: "daysPerWeek", label: "Days Per week" },
                { show: true, name: "activityAmount", label: "Amount" },
                { show: true, name: "batchName", label: "Batch Name" },
                { show: true, name: "batchTime", label: "Batch Time" },
                {
                    show: true,
                    name: "registrationDate",
                    label: "Registration Date",
                    type: "DATE",
                    extraProp: { readOnly: true },
                    defaultValue: getCurrentDateTimeUTC(),
                },
                { show: true, name: "membershipStartDate", label: "Start Date", type: "DATE" },
                { show: true, name: "membershipEndDate", label: "End Date", type: "DATE" },
                {
                    show: true,
                    name: "membershipStatus",
                    label: "Membership Status",
                    defaultValue: "INACTIVE",
                    getValue: (value) => (
                        <Box
                            sx={{
                                color: value === "ACTIVE" ? "green" : "red",
                                fontWeight: "bolder",
                            }}
                        >
                            {value}
                        </Box>
                    ),
                    extraProp: { readOnly: true },
                },
            ],
            fieldsMeta: {
                primary: "assignmentId",
                root: "studentId",
            },
            fieldToDisplayOnDelete: "activityName",
        },
    };

    const [addNewFunc, setAddNewFunc] = useState(null);
    return (
        <FlexBetweenColumn>
            {!ID && (
                <FlexBetween paddingBottom={2} gap={1}>
                    <SearchField handleSearch={triggerSearch} filterOptions={filterOptions} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            addNewFunc();
                            navigate("/management/students/NEW");
                        }}
                        sx={{ fontWeight: "bold", padding: ".8rem" }}
                    >
                        <AddIcon sx={{ padding: 0, margin: "auto" }} />
                    </Button>
                </FlexBetween>
            )}
            <Views
                formKey={ID}
                tableName={"students"}
                tableCruds={studentsCruds}
                size={size}
                key={"students"}
                fields={[...FIELDS, ASSIGNMENT_FIELD]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                onSetAddNewFunc={setAddNewFunc}
                CardContentComponent={StudentCard}
                editMode={"FORM"}
            />
        </FlexBetweenColumn>
    );
};

Students.propTypes = {
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Students;
