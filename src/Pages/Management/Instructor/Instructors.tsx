import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Views from "@/core/crud/Views";
import { instructorsAssignmentsCruds, instructorsCruds } from "../../../api/all.api";
import InstructorCard from "./InstructorCard";
import { useUI } from "../../../context/UIContext";
import PropTypes from "prop-types";
import FeedIcon from "@mui/icons-material/Feed";
import InstructorContract from "./Activity/IntructorContract";
import { useMemo, useRef, useState } from "react";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import InstructorAssignedActivityCard from "./InstructorAssignedActivityCard";
import ActionBar from "@/core/components/layout/ActionBar";

const size = 7;

const FIELD_META = {
    primary: "instructorId",
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
    {
        show: true,
        section: "Personal Details",
        name: "name",
        label: "Name",
        validation: { required: true },
    },
    {
        show: true,
        section: "Contact Details",
        name: "email",
        label: "Email",
        validation: { required: true },
    },
    {
        show: true,
        section: "Contact Details",
        name: "phone",
        label: "Phone",
        validation: {
            required: true,
            regex: /^[6-9]\d{9}$/,
            message: "Must be exactly 10 digit with no spaces and start with 6,7,8,9 only",
        },
    },
    {
        show: true,
        section: "Personal Details",
        name: "dob",
        label: "Date of Birth",
        type: "DATE",
        extraProp: { includeCurrentTime: false }
    },
    {
        show: true,
        section: "Personal Details",
        name: "instructorStatus",
        label: "Status",
        getValue: (value: any) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {value}
            </Box>
        ),
        defaultValue: "ACTIVE",
        extraProp: { readOnly: true },
    },
    { show: false, section: "Contact Details", name: "address", label: "Address" },
    {
        show: false,
        section: "Contact Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact",
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
];
const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Instructors = ({ ID }) => {
    const { isMobile } = useUI();
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);
    const api = useRef({});
    const apiInstructor = useRef({});
    const [generateContractDoc, setGenerateContractDoc] = useState(false);
    const allActivities = useAppSelector((state) => state.activities.items);

    const ASSIGNMENT_FIELD = useMemo(
        () => ({
            show: false,
            name: "assignments",
            label: "Contracts",
            type: "VIEW",
            api: api,
            viewProps: {
                apiRef: api,
                tableCruds: instructorsAssignmentsCruds,
                tableName: "instructorActivities",
                size: 3,
                showAddButton: true,
                actions: [
                    {
                        name: "Document",
                        icon: <FeedIcon />,
                        enabled: true,
                        sx: { color: "blue" },
                        onClick: (row) => {
                            setGenerateContractDoc(row);
                        },
                    },
                ],
                fields: [
                    {
                        show: true,
                        name: "activityName",
                        label: "Activity",
                        type: "SELECT",
                        getValue: (value: any) => value && { value, key: value },
                        editable: (row: any) => row.assignmentId === "NEW",
                        extraProp: {
                            getOptions: async (search, page, limit) =>
                                allActivities
                                    .filter((a) =>
                                        a.activityType.toLowerCase().includes(search.toLowerCase()),
                                    )
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a) => ({ key: a.activityType, value: a.activityType })),
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "assignedDate",
                        label: "Assigned Date",
                        type: "DATE",
                        extraProp: { readOnly: true },
                        defaultValue: getCurrentDateTimeLocal(),
                    },
                    {
                        show: true,
                        name: "startDate",
                        label: "Start Date",
                        type: "DATE",
                        validation: { required: true },
                    },
                    { show: true, name: "endDate", label: "End Date", type: "DATE" },
                    {
                        show: true,
                        name: "contractDocument",
                        label: "Contract Document",
                        type: "IMAGE_DIALOG",
                        extraProp: { defaultImage: "/assets/paper_2.jpg" },
                    },
                    {
                        show: true,
                        name: "membershipStatus",
                        label: "Membership Status",
                        defaultValue: "INACTIVE",
                        getValue: (value: any) => (
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
                    root: "instructorId",
                },
                fieldToDisplayOnDelete: "activityName",
                CardContentComponent: InstructorAssignedActivityCard,
                cardLayout: "horizontal",
            },
        }),
        [allActivities],
    );

    return (
        <FlexBetweenColumn>
            {!ID && (
                <ActionBar
                    api={apiInstructor}
                    filterOptions={filterOptions}
                    tableName={"instructors"}
                />
            )}
            <Views
                formKey={ID}
                apiRef={apiInstructor}
                tableName={"instructors"}
                tableCruds={instructorsCruds}
                size={size}
                key={"instructors"}
                fields={[...FIELDS, ASSIGNMENT_FIELD]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                CardContentComponent={InstructorCard}
                editMode={"FORM"}
            />
            {generateContractDoc && (
                <InstructorContract
                    open={true}
                    onClose={() => setGenerateContractDoc(false)}
                    activityData={generateContractDoc}
                />
            )}
        </FlexBetweenColumn>
    );
};

Instructors.propTypes = {
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Instructors;
