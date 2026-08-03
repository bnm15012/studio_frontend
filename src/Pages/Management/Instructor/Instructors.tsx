import { useAppSelector } from "@/state";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import Views from "@/core/crud/Views";
import type { Activity, activityStatus, Instructor, InstructorAssignment } from "@/api/types";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";
import type { ViewsProps } from "@/core/crud/Views";
import type { CrudRecord } from "@/api/types";
import { instructorsAssignmentsCruds, instructorsCruds } from "@/api/all.api";
import InstructorCard from "@/Pages/Management/Instructor/InstructorCard";
import { useAppUI } from "@/context/UIContext";

import FeedIcon from "@mui/icons-material/Feed";
import InstructorContract from "@/Pages/Management/Instructor/Activity/IntructorContract";
import { useMemo, useRef, useState } from "react";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import InstructorAssignedActivityCard from "@/Pages/Management/Instructor/InstructorAssignedActivityCard";

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "instructorId",
    root: "branchId",
};

const FIELDS: FieldDef<Instructor>[] = [
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
        validation: {
            required: true,
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email is not valid",
        },
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
        getValue: (value: activityStatus) => (
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
        validation: {
            required: true,
            regex: /^[6-9]\d{9}$/,
            message: "Must be exactly 10 digit with no spaces and start with 6,7,8,9 only",
        },
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
const VIEWS = ["LIST", "CARD", "FORM"] as const;

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

interface InstructorsProps {
    ID?: number;
}

const Instructors: React.FC<InstructorsProps> = ({ ID }) => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<ViewsApiRef>({});
    const apiInstructor = useRef<ViewsApiRef>({});
    const [generateContractDoc, setGenerateContractDoc] = useState<InstructorAssignment | null>(
        null,
    );
    const allActivities = useAppSelector((state) => state.activities.items);

    const ASSIGNMENT_FIELD = useMemo(
        (): FieldDef<Instructor> => ({
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
                        onClick: (row: InstructorAssignment) => {
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
                        getValue: (value: string) => ({ value, key: value }),
                        editable: (row: InstructorAssignment) => row.assignmentId === 0,
                        getOptions: async (search: string, page: number, limit: number) =>
                            allActivities
                                .filter((a: Activity) =>
                                    a.activityType!.toLowerCase().includes(search.toLowerCase()),
                                )
                                .slice((page - 1) * limit, page * limit)

                                .map((a: Activity) => ({
                                    key: a.activityType,
                                    value: a.activityType,
                                })),
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
                        label: "Status",
                        defaultValue: "INACTIVE",
                        getValue: (value: activityStatus) => (
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
            } as Partial<ViewsProps<CrudRecord>>,
        }),
        [allActivities],
    );

    return (
        <FlexBetweenColumn>
            <Views<Instructor>
                actionBarProps={{
                    filterOptions,
                    tableName: "instructors",
                }}
                formKey={ID}
                apiRef={apiInstructor}
                tableName={"instructors"}
                tableCruds={instructorsCruds}
                size={LIMIT}
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
