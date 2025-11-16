import { useState } from "react";
import { Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import { useSelector } from "react-redux";
import Views from "../../../Components/Views/Views";
import { genericTemplateCruds } from "../../../api/all.api";
import TemplateCard from "./TemplateCard";
import { useUI } from "../../../context/UIContext";
import { usePageSearch } from "../../../hooks/useSearch";
import SearchField from "../../../Components/SearchField";
import { Add } from "@mui/icons-material";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";

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
    const { triggerSearch } = usePageSearch();

    useSelector((state) => state.activity.activities)?.map((x) =>
        templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType),
    ) || [];
    const studio = useSelector((state) => state.auth.studio);

    const [addNewFunc, setAddNewFunc] = useState(null);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={triggerSearch} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        if (addNewFunc) addNewFunc();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <Add sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>

            <Views
                size={5}
                tableName={"genericTemplate"}
                tableCruds={genericTemplateCruds}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="templateName"
                fieldsMeta={FIELD_META}
                rootId={studio.studioId}
                onSetAddNewFunc={setAddNewFunc}
                fields={FIELDS}
                CardContentComponent={TemplateCard}
                editMode={"DIALOG"}
            />
        </FlexBetweenColumn>
    );
};

export default TemplatesPage;
