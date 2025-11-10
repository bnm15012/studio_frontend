import { useState } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { expenseCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ExpenseCardContent from "./ExpenseCardView";

const categories = [
    "ELECTRICITY",
    "SALARY",
    "MAINTENANCE",
    "RENT",
    "SUPPLIES",
    "MARKETING",
    "OTHER",
];
const LIMIT = 7;

const FIELD_META = {
    primary: "expenseId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "description", label: "Description" },
    {
        show: true,
        name: "expenseDate",
        label: "Expense Date",
        type: FIELD_TYPES.DATE,
        defaultValue: getCurrentDateTimeUTC(),
    },
    {
        show: true,
        name: "expenseCategory",
        label: "Expense Category",
        type: FIELD_TYPES.SELECT,
        getValue: (value) => ({ key: value, value }),
        extraProp: {
            getOptions: async (search, page, limit) =>
                categories
                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    { show: true, name: "amount", label: "Amount", type: FIELD_TYPES.NUMBER },
];
const Expenses = () => {
    const { isMobile } = useUI();
    const [addNewFunc, setAddNewFunc] = useState(null);
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <FlexBetween paddingBottom={2} gap={1}>
                <Box ml={"auto"}></Box>
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
                    tableName={"expenses"}
                    tableCruds={expenseCruds}
                    size={LIMIT}
                    key={"expenses"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    onSetAddNewFunc={setAddNewFunc}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="amount"
                    CardContentComponent={ExpenseCardContent}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Expenses;
