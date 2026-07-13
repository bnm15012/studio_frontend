import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import { paymentCruds } from "../../../api/all.api";
import Views from "@/core/crud/Views";
import type { Payment } from "../../../api/types";
import type { FieldDef } from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import PaymentCard from "./PaymentCardView";

const PAYMENT_TYPE = ["UPI", "CASH"];
const LIMIT = 12;
const STATUS = ["PENDING", "COMPLETED"];

const FIELD_META = { primary: "id", root: "branchId" };

const VIEWS = ["LIST", "CARD"] as const;

const FIELDS: FieldDef<Payment>[] = [
    { show: true, name: "payeeType", label: "Payee Type", extraProp: { readOnly: true } },
    {
        show: true,
        name: "payeeName",
        label: "Payee Name",
        extraProp: { readOnly: true },
    },
    {
        show: true,
        name: "status",
        label: "Status",
        type: "SELECT",
        getValue: (value: unknown) => value && { key: value, value },
        defaultValue: STATUS[1],
        extraProp: {
            getOptions: async (search: string, page: number, limit: number) =>
                STATUS.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    {
        show: true,
        name: "paymentDate",
        label: "Payment Date",
        type: "DATE",
        defaultValue: getCurrentDateTimeLocal(),
    },
    {
        show: true,
        name: "paymentType",
        label: "Payment Type",
        type: "SELECT",
        getValue: (value: unknown) => value && { key: value, value },
        defaultValue: PAYMENT_TYPE[1],
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
        label: "Amount",
        type: "NUMBER",
        extraProp: { readOnly: true },
    },
];

const Expenses: React.FC = () => {
    const { isMobile, currentBranch } = useAppUI();
    const api = useRef<Record<string, unknown>>({});

    return (
        <FlexBetweenColumn>
            <Box>
                <Views<Payment>
                    actionBarProps={{ add: false }}
                    apiRef={api}
                    actions={[
                        { name: "delete", enabled: () => false, hide: true },
                        {
                            name: "edit",
                            enabled: (row: Record<string, unknown>) => row.status !== "COMPLETED",
                        },
                    ]}
                    tableName={"payments"}
                    tableCruds={paymentCruds}
                    size={LIMIT}
                    key={"payments"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    fieldToDisplayOnDelete="name"
                    CardContentComponent={PaymentCard}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Expenses;
