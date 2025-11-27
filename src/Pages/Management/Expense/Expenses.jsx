import { useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { expenseCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ExpenseCardContent from "./ExpenseCardView";
import ActionBar from "../../../Components/ActionBar";

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
        validation: { required: true },

        defaultValue: getCurrentDateTimeUTC(),
    },
    {
        show: true,
        name: "expenseCategory",
        label: "Expense Category",
        type: FIELD_TYPES.SELECT,
        validation: { required: true },
        getValue: (value) => value && { key: value, value },
        extraProp: {
            getOptions: async (search, page, limit) =>
                categories
                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    {
        show: true,
        name: "amount",
        validation: { required: true },
        label: "Amount",
        type: FIELD_TYPES.NUMBER,
        defaultValue: 0,
    },
];
const Expenses = () => {
    const { isMobile } = useUI();
    const api = useRef({});
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views
                    tableName={"expenses"}
                    tableCruds={expenseCruds}
                    size={LIMIT}
                    key={"expenses"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    apiRef={api}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="amount"
                    CardContentComponent={ExpenseCardContent}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Expenses;
