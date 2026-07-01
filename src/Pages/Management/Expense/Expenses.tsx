import React, { useRef } from "react";
import { FlexBetweenColumn } from "../../../core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { getCurrentDateTimeLocal } from "../../../core/utils/DateUtil";
import { expenseCruds } from "../../../api/all.api";
import Views from "../../../core/crud/Views";
import { FIELD_TYPES } from "../../../core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import ExpenseCardContent from "./ExpenseCardView";
import ActionBar from "../../../core/components/layout/ActionBar";

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
const PAYMENT_TYPE = ["CASH", "UPI"];
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
        defaultValue: getCurrentDateTimeLocal(),
    },
    {
        show: true,
        name: "expenseCategory",
        label: "Expense Category",
        type: FIELD_TYPES.SELECT,
        validation: { required: true },
        getValue: (value: any) => value && { key: value, value },
        extraProp: {
            getOptions: async (search: string, page: number, limit: number) =>
                categories
                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    {
        show: true,
        name: "paymentType",
        label: "Payment Type",
        type: FIELD_TYPES.SELECT,
        getValue: (value: any) => value && ({ key: value, value }),
        defaultValue: PAYMENT_TYPE[0],
        extraProp: {
            getOptions: async (search: string, page: number, limit: number) =>
                PAYMENT_TYPE.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
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

const Expenses: React.FC = () => {
    const { isMobile } = useUI();
    const api = useRef<any>({});
    const currentBranch = useSelector((state: any) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views
                    tableName={"expenses"}
                    tableCruds={expenseCruds}
                    size={LIMIT}
                    key={"expenses"}
                    fields={FIELDS as any}
                    rootId={currentBranch?.branchId}
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
