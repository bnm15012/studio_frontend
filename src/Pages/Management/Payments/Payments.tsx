import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import { paymentCruds } from "../../../api/all.api";
import Views from "@/core/crud/Views";
import { FIELD_TYPES } from "@/core/components/fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import PaymentCard from "./PaymentCardView";
import ActionBar from "@/core/components/layout/ActionBar";

const PAYMENT_TYPE = ["UPI", "CASH"];
const LIMIT = 8;
const STATUS = ["PENDING", "COMPLETED"];

const FIELD_META = { primary: "id", root: "branchId" };

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
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
        type: FIELD_TYPES.SELECT,
        getValue: (value: unknown) => value && ({ key: value, value }),
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
        type: FIELD_TYPES.DATE,
        defaultValue: getCurrentDateTimeLocal(),
    },
    {
        show: true,
        name: "paymentType",
        label: "Payment Type",
        type: FIELD_TYPES.SELECT,
        getValue: (value: unknown) => value && ({ key: value, value }),
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
        type: FIELD_TYPES.NUMBER,
        extraProp: { readOnly: true },
    },
];

const Expenses: React.FC = () => {
    const { isMobile, currentBranch } = useUI()
    const api = useRef<Record<string, unknown>>({});

    return (
        <FlexBetweenColumn>
            <ActionBar api={api} add={false} />
            <Box>
                <Views
                    apiRef={api}
                    actions={[
                        { name: "delete", enabled: () => false, hide: true },
                        { name: "edit", enabled: (row: Record<string, unknown>) => row.status !== "COMPLETED" },
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
