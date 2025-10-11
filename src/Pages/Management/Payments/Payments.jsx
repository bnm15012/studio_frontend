import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import { paymentCruds } from "../../../api/all.api";
import Views from "../../../Components/Views/Views";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes";
import { useUI } from "../../../context/UIContext";
import PaymentCard from "./PaymentCardView";
// import PaymentCard from "./PaymentCardView.jsx";

const PAYMENT_TYPE = ["UPI", "CASH"];
const LIMIT = 8;
const STATUS = ["PENDING", "COMPLETED"];

const FIELD_META = { primary: "paymentId", root: "branchId" };

const VIEWS = ["LIST", "CARD"];

const FIELDS = [
    { show: true, name: "payeeType", label: "Payee Type" },
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
        defaultValue: getCurrentDateTimeUTC(),
    },
    {
        show: true,
        name: "paymentType",
        label: "Payment Category",
        type: FIELD_TYPES.SELECT,
        getValue: (value) => ({ key: value, value }),
        extraProp: {
            getOptions: async (search, page, limit) =>
                PAYMENT_TYPE.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    { show: true, name: "amount", label: "Amount", type: FIELD_TYPES.NUMBER },
];
const Expenses = () => {
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    return (
        <FlexBetweenColumn>
            <Box>
                <Views
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
