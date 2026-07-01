import { useAppSelector } from "@/state";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Views from "@/core/crud/Views";
import { genericTemplateCruds } from "../../../api/all.api";
import TemplateCard from "./TemplateCard";
import { useUI } from "../../../context/UIContext";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import ActionBar from "@/core/components/layout/ActionBar";

const templateTypes = new Set<string>(["COMMUNICATION", "BOOKING"]);

const FIELD_META = {
    primary: "id",
    root: "studioId",
};

const FIELDS = [
    {
        show: true,
        name: "templateType",
        label: "Template Type",
        type: "SELECT",
        getValue: (value: any) => value && { key: value, value },
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
        },
    },
    {
        name: "templateContent",
        label: "Template Content",
        type: "EDITOR",
        view: true,
        extraProp: { multiline: true, rows: 10, variant: "outlined" },
    },
];

const VIEWS = ["LIST", "CARD"];

const TemplatesPage: React.FC = () => {
    const { isMobile } = useUI();

    useAppSelector((state: any) => state.activities.items)?.forEach((x: any) =>
        templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType),
    );
    const studio = useAppSelector((state: any) => state.auth.studio);

    const api = useRef<any>({});

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Views
                size={5}
                tableName={"genericTemplate"}
                tableCruds={genericTemplateCruds}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="templateName"
                fieldsMeta={FIELD_META}
                rootId={studio?.studioId}
                apiRef={api}
                dialogProps={{ fullScreen: isMobile, size: "md" }}
                fields={FIELDS as any}
                CardContentComponent={TemplateCard}
                editMode={"DIALOG"}
            />
        </FlexBetweenColumn>
    );
};

export default TemplatesPage;
