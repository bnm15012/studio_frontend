import { useState } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { activityMembershipTypeCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";

const LIMIT = 7;

const FIELD_META = {
    primary: "activityMembershipTypeId",
    root: "studioId",
};

const VIEWS = ["LIST"];

const FIELDS = [{ show: true, name: "activityMembershipType", label: "Membership Type" }];

const MembershipType = () => {
    // const { triggerSearch } = usePageSearch();
    const [addNewFunc, setAddNewFunc] = useState(null);
    const studio = useSelector((s) => s.auth.studio);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                {/* <SearchField handleSearch={triggerSearch} /> */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        if (addNewFunc) addNewFunc();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <Views
                    tableName={"activityMembershipType"}
                    tableCruds={activityMembershipTypeCruds}
                    size={LIMIT}
                    key={"activityMembershipType"}
                    fields={FIELDS}
                    rootId={studio.studioId}
                    fieldsMeta={FIELD_META}
                    onSetAddNewFunc={setAddNewFunc}
                    currentView={VIEWS[0]}
                    fieldToDisplayOnDelete="activityMembershipType"
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default MembershipType;
