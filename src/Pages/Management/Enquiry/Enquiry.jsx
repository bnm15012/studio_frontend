import { useState } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import EnquiryTable from "./EnquiryTable.jsx";
import QrForm from "../../../Components/QrForm.jsx";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes.js";
import { enquiryCruds } from "../../../api/all.api";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil.js";

const LIMIT = 7;

const FIELD_META = {
    primary: "enquiryId",
    root: "branchId",
};

const FIELDS = [
    {
        name: "enquiryDate",
        label: "Date",
        show: true,
        type: FIELD_TYPES.DATE,
        defaultValue: getCurrentDateTimeUTC(),
    },
    { name: "name", label: "Name", show: true },
    { name: "contact", label: "Contact", show: true, type: FIELD_TYPES.NUMBER },
    { name: "enquiryPurpose", label: "Purpose", show: true },
];
const Enquiry = () => {
    const dispatch = useDispatch();
    const [addNewFunc, setAddNewFunc] = useState(null);
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <Box ml={"auto"}></Box>
                <QrForm title="" link={"enquiry-form"} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        dispatch(enquiryCruds.removeAll());
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <RefreshIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    // disabled={newRow != null}
                    onClick={() => {
                        if (addNewFunc) addNewFunc();
                    }}
                    sx={{ fontWeight: "bold", padding: ".8rem" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <EnquiryTable
                    tableName={"enquiry"}
                    tableCruds={enquiryCruds}
                    size={LIMIT}
                    key={"enquiry"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    onSetAddNewFunc={setAddNewFunc}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Enquiry;
