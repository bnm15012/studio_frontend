import React, { useRef } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import { paymentCruds } from "@/api/all.api";
import Views from "@/core/crud/Views";
import type { Payment, paymentStatus, paymentType } from "@/api/types";
import type { FieldDef, FieldMeta, ViewMode, ViewsApiRef } from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import PaymentCard from "@/Pages/Management/Payments/PaymentCardView";

const PAYMENT_TYPE = ["UPI", "CASH"];
const LIMIT = 12;
const STATUS = ["PENDING", "COMPLETED"];

const FIELD_META: FieldMeta = { primary: "id", root: "branchId" };

const VIEWS: ViewMode[] = ["LIST", "CARD"];

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
        getValue: (value: paymentStatus) => ({ key: value, value }),
        defaultValue: STATUS[1],
        getOptions: async (search: string, page: number, limit: number) =>
            STATUS.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                .slice((page - 1) * limit, page * limit)

                .map((a) => ({ key: a, value: a })),
    },
    {
        show: true,
        name: "paymentDate",
        label: "Payment Date",
        type: "DATETIME",
        defaultValue: getCurrentDateTimeLocal(),
    },
    {
        show: true,
        name: "paymentType",
        label: "Payment Type",
        type: "SELECT",
        getValue: (value: paymentType) => ({ key: value, value }),
        defaultValue: PAYMENT_TYPE[1],
        getOptions: async (search: string, page: number, limit: number) =>
            PAYMENT_TYPE.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                .slice((page - 1) * limit, page * limit)

                .map((a) => ({ key: a, value: a })),
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
    const api = useRef<ViewsApiRef>({});

    return (
        <FlexBetweenColumn>
            <Box>
                <Views<Payment>
                    actionBarProps={{
                        add: false,
                        filterOptions: [
                            { name: "Start Date", key: "startDate", values: [] },
                            { name: "End Date", key: "endDate", values: [] },
                            {
                                name: "Payment Type",
                                key: "paymentType",
                                values: PAYMENT_TYPE,
                            },
                            {
                                name: "Payment Status",
                                key: "paymentStatus",
                                values: STATUS,
                            },
                        ],
                    }}
                    apiRef={api}
                    actions={[
                        { name: "delete", enabled: () => false, hide: true },
                        {
                            name: "edit",
                            enabled: (row: Payment) => row.status !== "COMPLETED",
                        },
                    ]}
                    tableName={"payments"}
                    tableCruds={paymentCruds}
                    size={LIMIT}
                    key={"payments"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    currentView={VIEWS[!isMobile ? 0 : 1] ?? "LIST"}
                    fieldToDisplayOnDelete="name"
                    CardContentComponent={PaymentCard}
                />
            </Box>
        </FlexBetweenColumn>
    );
};

export default Expenses;
