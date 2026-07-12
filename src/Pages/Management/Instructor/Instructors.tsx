import { useAppSelector } from "@/state";
import { FlexBetweenColumn } from "../../../core/components/layout/FlexBox";
import { Box } from "@mui/material";
import Views from "@/core/crud/Views";
import type { Instructor } from "../../../api/types";
import { instructorsAssignmentsCruds, instructorsCruds } from "../../../api/all.api";
import InstructorCard from "./InstructorCard";
import { useAppUI } from "@/context/UIContext";

import FeedIcon from "@mui/icons-material/Feed";
import InstructorContract from "./Activity/IntructorContract";
import { useMemo, useRef, useState } from "react";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import InstructorAssignedActivityCard from "./InstructorAssignedActivityCard";
import ActionBar from "@/core/components/layout/ActionBar";

const size = 12;

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
        extraProp: { includeCurrentTime: false },
    },
    {
        show: true,
        section: "Personal Details",
        name: "instructorStatus",
        label: "Status",
        getValue: (value: unknown) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {String(value)}
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

interface InstructorsProps {
    ID?: string | number;
}

const Instructors: React.FC<InstructorsProps> = ({ ID }) => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<Record<string, unknown>>({});
    const apiInstructor = useRef<Record<string, unknown>>({});
    const [generateContractDoc, setGenerateContractDoc] = useState<Record<string, unknown> | null>(
        null,
    );
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
                        sx: { color: "primary.main" },
                        onClick: (row: Record<string, unknown>) => {
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
                        getValue: (value: unknown) => value && { value, key: value },
                        editable: (row: Record<string, unknown>) => row.assignmentId === "NEW",
                        extraProp: {
                            getOptions: async (search: string, page: number, limit: number) =>
                                allActivities
                                    .filter((a) =>
                                        a
                                            .activityType!.toLowerCase()
                                            .includes(search.toLowerCase()),
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
                        getValue: (value: unknown) => (
                            <Box
                                sx={{
                                    color: value === "ACTIVE" ? "green" : "red",
                                    fontWeight: "bolder",
                                }}
                            >
                                {String(value)}
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
            <Views<Instructor>
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
                    onClose={() => setGenerateContractDoc(null)}
                    activityData={generateContractDoc}
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Instructors;
