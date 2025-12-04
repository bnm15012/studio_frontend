import { useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Views from "../../../Components/Views/Views";
import ActionBar from "../../../Components/ActionBar";
import { membershipPackageCruds } from "../../../api/all.api";

const LIMIT = 7;

const FIELD_META = {
    primary: "id",
    root: "studioId",
};

const VIEWS = ["LIST"];

const FIELDS = [{ show: true, name: "membershipPackage", label: "Membership Type" }];

const MembershipType = () => {
    const api = useRef({});
    const studio = useSelector((s) => s.auth.studio);

    return (
        <FlexBetweenColumn>
            <ActionBar search={false} api={api} addBtnText={"New Package"} />
            <Box>
                <Views
                    tableName={"membershipPackages"}
                    tableCruds={membershipPackageCruds}
                    size={LIMIT}
                    key={"membershipPackages"}
                    fields={FIELDS}
                    rootId={studio.studioId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[0]}
                    fieldToDisplayOnDelete="membershipPackage"
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default MembershipType;
