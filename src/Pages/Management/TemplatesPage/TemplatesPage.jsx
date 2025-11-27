import { useRef } from "react";
import { useSelector } from "react-redux";
import Views from "../../../Components/Views/Views";
import { genericTemplateCruds } from "../../../api/all.api";
import TemplateCard from "./TemplateCard";
import { useUI } from "../../../context/UIContext";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import ActionBar from "../../../Components/ActionBar";

const templateTypes = new Set(["COMMUNICATION", "BOOKING"]);

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
        getValue: (value) => ({ key: value, value }),
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

const TemplatesPage = () => {
    const { isMobile } = useUI();

    useSelector((state) => state.activity.activities)?.map((x) =>
        templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType),
    ) || [];
    const studio = useSelector((state) => state.auth.studio);

    const api = useRef({});

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
                rootId={studio.studioId}
                apiRef={api}
                dialogProps={{ fullScreen: true }}
                fields={FIELDS}
                CardContentComponent={TemplateCard}
                editMode={"DIALOG"}
            />
        </FlexBetweenColumn>
    );
};

export default TemplatesPage;
