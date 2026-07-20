import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import { expenseCruds } from "../../../api/all.api";
import Views from "@/core/crud/Views";
import type { Expense, paymentType } from "../../../api/types";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import ExpenseCardContent from "./ExpenseCardView";
import ActionBar from "@/core/components/layout/ActionBar";

const categories = [
    "ELECTRICITY",
    "SALARY",
    "MAINTENANCE",
    "RENT",
    "SUPPLIES",
    "MARKETING",
    "OTHER",
];
const LIMIT = 12;
const PAYMENT_TYPE = ["CASH", "UPI"];
const FIELD_META: FieldMeta = {
    primary: "expenseId",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"] as const;

const FIELDS: FieldDef<Expense>[] = [
    { show: true, name: "description", label: "Description" },
    {
        show: true,
        name: "expenseDate",
        label: "Expense Date",
        type: "DATE",
        validation: { required: true },
        defaultValue: getCurrentDateTimeLocal(),
    },
    {
        show: true,
        name: "expenseCategory",
        label: "Expense Category",
        type: "SELECT",
        validation: { required: true },
        getValue: (value: string) => value && { key: value, value },
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
        type: "SELECT",
        getValue: (value: paymentType) => value && { key: value, value },
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
        type: "NUMBER",
        defaultValue: 0,
    },
];

const Expenses: React.FC = () => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} />
            <Box>
                <Views<Expense>
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
