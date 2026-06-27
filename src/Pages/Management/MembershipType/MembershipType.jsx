import { useRef } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Views from "../../../core/crud/Views";
import ActionBar from "../../../core/components/layout/ActionBar";
import { membershipPackageCruds } from "../../../api/all.api";

const LIMIT = 7;

const FIELD_META = {
    primary: "id",
    root: "studioId",
};

const VIEWS = ["LIST"];

const FIELDS = [{ show: true, name: "membershipPackage", label: "Membership Type" }, { show: true, name: "days", label: "Days" }];

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
