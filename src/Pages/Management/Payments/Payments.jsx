import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { getCurrentDateTimeLocal } from "../../../utils/DateUtil";
import { paymentCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import PaymentCard from "./PaymentCardView";
import ActionBar from "../../../Components/ActionBar";
import { useRef } from "react";

const PAYMENT_TYPE = ["UPI", "CASH"];
const LIMIT = 8;
const STATUS = ["PENDING", "COMPLETED"];

const FIELD_META = { primary: "id", root: "branchId" };

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "payeeType", label: "Payee Type", extraProp: { readOnly: true } },
    // TODO: need to change for client too.
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
        getValue: (value) => ({ key: value, value }),
        extraProp: {
            getOptions: async (search, page, limit) =>
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
        getValue: (value) => ({ key: value, value }),
        extraProp: {
            getOptions: async (search, page, limit) =>
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
const Expenses = () => {
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const api = useRef({});
    return (
        <FlexBetweenColumn>
            <ActionBar api={api} add={false} />
            <Box>
                <Views
                    apiRef={api}
                    actions={[
                        { name: "delete", enabled: false, hide: true },
                        { name: "edit", enabled: (row) => row.status !== "COMPLETED" },
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
