import { useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { activityMembershipTypeCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import ActionBar from "../../../Components/ActionBar";

const LIMIT = 7;

const FIELD_META = {
    primary: "activityMembershipTypeId",
    root: "studioId",
};

const VIEWS = ["LIST"];

const FIELDS = [{ show: true, name: "activityMembershipType", label: "Membership Type" }];

const MembershipType = () => {
    const api = useRef({});
    const studio = useSelector((s) => s.auth.studio);

    return (
        <FlexBetweenColumn>
            <ActionBar search={false} api={api} addBtnText={"New Package"} />
            <Box>
                <Views
                    tableName={"activityMembershipType"}
                    tableCruds={activityMembershipTypeCruds}
                    size={LIMIT}
                    key={"activityMembershipType"}
                    fields={FIELDS}
                    rootId={studio.studioId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[0]}
                    fieldToDisplayOnDelete="activityMembershipType"
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default MembershipType;
