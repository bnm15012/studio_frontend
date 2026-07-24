import { useAppSelector } from "@/state";
import React, { useRef } from "react";
import Views from "@/core/crud/Views";
import type { GenericTemplate } from "../../../api/types";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";
import { genericTemplateCruds } from "../../../api/all.api";
import TemplateCard from "./TemplateCard";
import { useAppUI } from "@/context/UIContext";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import ActionBar from "@/core/components/layout/ActionBar";

const templateTypes = new Set<string>(["COMMUNICATION", "BOOKING"]);

const FIELD_META: FieldMeta = { primary: "id", root: "studioId" };

/** Available {{variable}} tokens for template EDITOR fields. */
const TEMPLATE_VARIABLES = {
    instructor: {
        name: "Instructor Name",
        email: "Instructor Email",
        phone: "Instructor Phone",
        dob: "Instructor Date of Birth",
        address: "Instructor Address",
        emergencyContactNumber: "Instructor Emergency Contact Number",
    },
    instructorActivity: {
        activityName: "Activity Name (Instructor)",
        assignedDate: "Date Assigned",
        startDate: "Activity Start Date",
        endDate: "Activity End Date",
    },
    student: {
        name: "Student Name",
        email: "Student Email",
        phone: "Student Phone",
        dob: "Student Date of Birth",
        address: "Student Address",
        emergencyContactNumber: "Student Emergency Contact Number",
    },
    studentActivity: {
        activityName: "Activity Name (Student)",
        registrationDate: "Registration Date",
        membershipStartDate: "Membership Start Date",
        membershipEndDate: "Membership End Date",
        membershipType: "Membership Type",
        activityAmount: "Activity Fee Amount",
        daysPerWeek: "Days per Week",
        batchName: "Batch Name",
        batchTime: "Batch Time",
    },
    branch: {
        name: "Branch Name",
        address: "Branch Address",
        city: "Branch City",
        state: "Branch State",
        pincode: "Branch Pincode",
        phone: "Branch Phone",
    },
    studio: {
        studioName: "Studio Name",
        location: "Studio Location",
        email: "Studio Email",
        contactDetails: "Studio Contact Details",
    },
};

const FIELDS: FieldDef<GenericTemplate>[] = [
    {
        show: true,
        name: "templateType",
        label: "Template Type",
        type: "SELECT",
        getValue: (value) => (value ? { key: String(value), value } : null),
        extraProp: {
            variant: "outlined",
            getOptions: async () => [...templateTypes].map((type) => ({ key: type, value: type })),
        },
    },
    {
        show: true,
        name: "templateName",
        label: "Template Name",
        extraProp: {
            variant: "outlined",
        },
    },
    {
        show: true,
        name: "templateSubject",
        label: "Template Subject",
        type: "EDITOR",
        extraProp: {
            variant: "outlined",
            variables: TEMPLATE_VARIABLES,
            disableVars: true, // subject line: hide Activity_ tokens
        },
    },
    {
        name: "templateContent",
        label: "Template Content",
        type: "EDITOR",
        view: true,
        extraProp: {
            multiline: true,
            rows: 10,
            variant: "outlined",
            variables: TEMPLATE_VARIABLES,
        },
    },
];

const VIEWS = ["LIST", "CARD"] as const;

const TemplatesPage: React.FC = () => {
    const { isMobile, studio } = useAppUI();

    useAppSelector((state) => state.activities.items).forEach((x) => {
        if (x.activityType) templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType);
    });

    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Views<GenericTemplate>
                size={5}
                tableName={"genericTemplate"}
                tableCruds={genericTemplateCruds}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="templateName"
                fieldsMeta={FIELD_META}
                rootId={studio.studioId}
                apiRef={api}
                dialogProps={{ fullScreen: isMobile, size: "md" }}
                fields={FIELDS}
                CardContentComponent={TemplateCard}
                editMode={"DIALOG"}
            />
        </FlexBetweenColumn>
    );
};

export default TemplatesPage;
