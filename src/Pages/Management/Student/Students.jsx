import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Views from "../../../Components/Views/Views";
import { studentsCruds, studentsAssignmentsCruds } from "../../../api/all.api";
import StudentCard from "./StudentCard.jsx";
import { useUI } from "../../../context/UIContext";
import PropTypes from "prop-types";
import { useCallback, useMemo, useRef, useState } from "react";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import StudentInvoice from "./StudentInvoice.jsx";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog.jsx";
import StudentAssignActivityCard from "./StudentAssignActivityCard.jsx";
import { getEndDateBySubscriptionPlan } from "../../../utils/SubscriptionPlanUtil.js";
import ActionBar from "../../../Components/ActionBar.jsx";

const size = 7;

const FIELD_META = {
    primary: "studentId",
    root: "branchId",
};

const PAYMENT_STATUS = ["COMPLETED", "PENDING"];
const PAYMENT_TYPE = ["CASH", "UPI"];

const FIELDS = [
    {
        show: true,
        section: "Personal Details",
        name: "imageUrl",
        label: "Image",
        type: "IMAGE",
        extraProp: { size: "30px" },
    },
    { show: true, section: "Personal Details", name: "name", label: "Name" },
    { show: true, section: "Contact Details", name: "email", label: "Email" },
    {
        show: true,
        section: "Contact Details",
        name: "phone",
        label: "Phone",
        validation: {
            regex: /^[6-9]\d{9}$/,
            message: "Must be exactly 10 digit with no spaces and start with 6,7,8,9 only",
        },
    },
    {
        show: true,
        section: "Personal Details",
        name: "dob",
        label: "Date of Birth",
        type: "DATE",
    },
    {
        show: true,
        section: "Personal Details",
        name: "membershipStatus",
        label: "Status",
        getValue: (value) => (
            <Box sx={{ color: value === "ACTIVE" ? "green" : "red", fontWeight: "bolder" }}>
                {value}
            </Box>
        ),
        defaultValue: "ACTIVE",
        extraProp: { readOnly: true },
    },
    { show: false, section: "Contact Details", name: "address", label: "Address" },
    {
        show: false,
        section: "Contact Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact",
        validation: {
            regex: /^[6-9]\d{9}$/,
            message: "Must be exactly 10 digit with no spaces and start with 6,7,8,9 only",
        },
    },
];
const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Students = ({ ID }) => {
    const { isMobile, isEnabled, FEATURE_KEYS } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const allActivities = useSelector((state) => state.activity.activities);
    const [showInvoice, setShowInvoice] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const api = useRef({});
    const apiStudent = useRef({});

    const awaitForDialog = useCallback(
        (paymentInit) =>
            new Promise((resolve) => {
                const handleSave = (data) => {
                    setOpenPaymentDialog(false);
                    resolve(data);
                };

                const handleClose = () => {
                    setOpenPaymentDialog(false);
                    resolve(null);
                };

                setOpenPaymentDialog({
                    onSave: handleSave,
                    onClose: handleClose,
                    paymentInit,
                });
            }),
        [],
    );

    const beforeAdd = useCallback(
        async (row) => {
            const modifiedData = { ...row };

            let paymentInit = {
                actualAmount: 0,
                amount: 0,
                status: PAYMENT_STATUS[0],
                paymentType: PAYMENT_TYPE[0],
            };

            paymentInit = {
                actualAmount: modifiedData.activityAmount,
                amount: modifiedData.activityAmount,
                status: PAYMENT_STATUS[0],
                paymentType: PAYMENT_TYPE[0],
            };

            const paymentData = await awaitForDialog(paymentInit);

            if (paymentData) {
                modifiedData.paymentEntry = { ...row.paymentEntry, ...paymentData };
            } else {
                throw new Error("Payment cancelled");
            }
            return modifiedData;
        },
        [awaitForDialog],
    );

    const getBatchEntries = useCallback(
        (activityName, membershipType, daysPerWeek, batchName) =>
            allActivities
                .find((a) => a.activityType === activityName)
                ?.batchEntries?.filter(
                    (b) =>
                        (!membershipType || b.planType === membershipType) &&
                        (!daysPerWeek || b.daysPerWeek === daysPerWeek) &&
                        (!batchName || b.name === batchName),
                ) || null,
        [allActivities],
    );
    const overRideOnChange = useCallback(
        (value, obj, fieldPath) => {
            if (!value) return obj;

            const newObj = { ...obj };

            if (fieldPath === "activityName") {
                const entries = getBatchEntries(value);
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.membershipType = entry?.planType;
                newObj.daysPerWeek = entry?.daysPerWeek;
                newObj.batchName = entry?.name;
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
                newObj.membershipEndDate =
                    entry?.planType &&
                    getEndDateBySubscriptionPlan(newObj.membershipStartDate, entry?.planType);
            } else if (fieldPath === "membershipType") {
                const entries = getBatchEntries(newObj.activityName, value);
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.daysPerWeek = entry?.daysPerWeek;
                newObj.batchName = entry?.name;
                newObj.membershipEndDate = getEndDateBySubscriptionPlan(
                    newObj.membershipStartDate,
                    value,
                );
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "daysPerWeek") {
                const entries = getBatchEntries(newObj.activityName, newObj.membershipType, value);
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.batchName = entry?.name;
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "batchName") {
                const entry = getBatchEntries(
                    newObj.activityName,
                    newObj.membershipType,
                    newObj.daysPerWeek,
                    value,
                )?.[0];
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "membershipStartDate") {
                newObj.membershipEndDate = getEndDateBySubscriptionPlan(
                    value,
                    newObj.membershipType,
                );
            }
            return newObj;
        },
        [getBatchEntries],
    );

    const ASSIGNMENT_FIELD = useMemo(
        () => ({
            show: false,
            name: "assignments",
            label: "Assigned Activities",
            type: "VIEW",
            api: api,
            viewProps: {
                showAddButton: true,
                tableCruds: studentsAssignmentsCruds,
                tableName: "studentActivities",
                beforeAdd,
                overRideOnChange,
                size: 4,
                actions: [
                    {
                        name: "Document",
                        icon: <ReceiptIcon />,
                        enabled: (row) => row.paymentEntry?.status === "COMPLETED",
                        sx: { color: "blue" },
                        onClick: (row) => {
                            setShowInvoice(row);
                        },
                    },
                ],
                fields: [
                    {
                        show: true,
                        name: "activityName",
                        label: "Activity",
                        type: "SELECT",
                        getValue: (value) => value && { value, key: value },
                        editable: (row) => row.assignmentId === "NEW",
                        extraProp: {
                            getOptions: async (search, page, limit) =>
                                allActivities
                                    .filter((a) =>
                                        a.activityType.toLowerCase().includes(search.toLowerCase()),
                                    )
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a) => ({ key: a.activityType, value: a.activityType })),
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "membershipType",
                        label: "Membership Type",
                        type: "SELECT",
                        editable: (row) => row.assignmentId === "NEW",
                        getValue: (value) => value && { value, key: value },
                        extraProp: {
                            addValue: false,
                            getOptions: async (search, page, limit, row) => {
                                const batchEntries = allActivities.find(
                                    (a) => a.activityType === row["activityName"],
                                )?.batchEntries;
                                return [
                                    ...new Set(
                                        batchEntries
                                            ?.filter((b) =>
                                                b.planType
                                                    .toLowerCase()
                                                    .includes(search.toLowerCase()),
                                            )
                                            .map((b) => b.planType),
                                    ),
                                ]
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a) => ({ key: a, value: a }));
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "daysPerWeek",
                        label: "Days Per week",
                        editable: (row) => row.assignmentId === "NEW",
                        type: "SELECT",
                        getValue: (value) => value && { value, key: value },
                        extraProp: {
                            addValue: false,
                            getOptions: async (search, page, limit, row) => {
                                const batchEntries = allActivities
                                    .find((a) => a.activityType === row["activityName"])
                                    ?.batchEntries?.filter(
                                        (b) => b.planType === row["membershipType"],
                                    );
                                return [...new Set(batchEntries?.map((b) => b.daysPerWeek))].map(
                                    (a) => ({
                                        key: a,
                                        value: a,
                                    }),
                                );
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: isEnabled(FEATURE_KEYS.BATCH),
                        name: "batchName",
                        label: "Batch Name",
                        type: "SELECT",
                        editable: (row) => row.assignmentId === "NEW",
                        getValue: (value) => value && { value, key: value },
                        extraProp: {
                            addValue: false,
                            getOptions: async (search, page, limit, row) => {
                                const batchEntries = allActivities
                                    .find((a) => a.activityType === row["activityName"])
                                    ?.batchEntries?.filter(
                                        (b) =>
                                            b.planType === row["membershipType"] &&
                                            b.daysPerWeek === row["daysPerWeek"],
                                    );
                                return [
                                    ...new Set(
                                        batchEntries
                                            ?.filter((b) =>
                                                b.name.toLowerCase().includes(search.toLowerCase()),
                                            )
                                            .map((b) => b.name),
                                    ),
                                ]
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a) => ({ key: a, value: a }));
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "activityAmount",
                        label: "Amount",
                        getValue: (v, row, isEdit) => {
                            if (!isEdit) {
                                if (!row || !row.paymentEntry) return null;
                                return row.paymentEntry.amount !== row.paymentEntry.actualAmount ? (
                                    <>
                                        Rs. {row.paymentEntry.amount}{" "}
                                        <span
                                            style={{
                                                textDecoration: "line-through",
                                                color: "red",
                                            }}
                                        >
                                            Rs. {row.paymentEntry.actualAmount}
                                        </span>
                                    </>
                                ) : (
                                    `Rs. ${row.paymentEntry.amount}`
                                );
                            } else {
                                return v;
                            }
                        },
                        extraProp: { readOnly: true },
                        validation: { required: true },
                    },
                    {
                        show: isEnabled(FEATURE_KEYS.BATCH),
                        name: "batchTime",
                        label: "Batch Time",
                        extraProp: { readOnly: true },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "registrationDate",
                        label: "Registration Date",
                        type: "DATE",
                        extraProp: { readOnly: true },
                        defaultValue: getCurrentDateTimeUTC(),
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "membershipStartDate",
                        label: "Start Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeUTC(),
                        validation: { required: true },
                        extraProp: { min: getCurrentDateTimeUTC() },
                    },
                    {
                        show: true,
                        name: "membershipEndDate",
                        label: "End Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeUTC(),
                        validation: { required: true },
                        extraProp: { min: getCurrentDateTimeUTC(), readOnly: true },
                    },
                    {
                        show: isEnabled(FEATURE_KEYS.PAYMENT_DATE),
                        name: "paymentEntry.paymentDate",
                        label: "Payment Date",
                        type: "DATE",
                        editable: (row) => row?.paymentEntry?.paymentStatus !== "COMPLETED",
                        defaultValue: getCurrentDateTimeUTC(),
                    },
                    {
                        show: false,
                        name: "paymentEntry.payeeType",
                        label: "Payee",
                        defaultValue: "STUDENT",
                    },
                    {
                        show: false,
                        name: "paymentEntry.status",
                        label: "Payee",
                        defaultValue: PAYMENT_STATUS[0],
                    },
                    {
                        show: false,
                        name: "paymentEntry.paymentType",
                        label: "Payee",
                        defaultValue: PAYMENT_TYPE[0],
                    },
                    {
                        show: false,
                        name: "paymentEntry.actualAmount",
                        label: "Payee",
                        defaultValue: 0,
                    },
                    {
                        show: false,
                        name: "paymentEntry.amount",
                        label: "Payee",
                        defaultValue: 0,
                    },
                    {
                        show: false,
                        name: "paymentEntry.branchId",
                        label: "Payee",
                        defaultValue: currentBranch.branchId,
                    },
                    {
                        show: true,
                        name: "membershipStatus",
                        label: "Membership Status",
                        defaultValue: "INACTIVE",
                        getValue: (value) => (
                            <Box
                                sx={{
                                    color: value === "ACTIVE" ? "green" : "red",
                                    fontWeight: "bolder",
                                }}
                            >
                                {value}
                            </Box>
                        ),
                        extraProp: { readOnly: true },
                    },
                ],
                fieldsMeta: {
                    primary: "assignmentId",
                    root: "studentId",
                },
                CardContentComponent: StudentAssignActivityCard,
                fieldToDisplayOnDelete: "activityName",
                cardLayout: "horizontal",
                apiRef: api,
            },
        }),
        [
            FEATURE_KEYS.BATCH,
            FEATURE_KEYS.PAYMENT_DATE,
            allActivities,
            beforeAdd,
            currentBranch.branchId,
            isEnabled,
            overRideOnChange,
        ],
    );

    return (
        <FlexBetweenColumn>
            {!ID && (
                <ActionBar
                    api={apiStudent}
                    filterOptions={filterOptions}
                    qrProps={{ link: "student-form" }}
                    tableName={"students"}
                />
            )}
            <Views
                formKey={ID}
                tableName={"students"}
                apiRef={apiStudent}
                tableCruds={studentsCruds}
                size={size}
                key={"students"}
                fields={[...FIELDS, ASSIGNMENT_FIELD]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                CardContentComponent={StudentCard}
                editMode={"FORM"}
            />
            {showInvoice && (
                <StudentInvoice
                    open={true}
                    onClose={() => setShowInvoice(false)}
                    activityData={showInvoice}
                />
            )}
            {openPaymentDialog && (
                <PaymentEntryDialog
                    open={true}
                    onSave={(data) => openPaymentDialog?.onSave?.(data)}
                    onClose={() => openPaymentDialog?.onClose?.()}
                    initialData={openPaymentDialog.paymentInit}
                    paymentStatus={PAYMENT_STATUS.map((ps) => ({ label: ps, value: ps }))}
                    paymentType={PAYMENT_TYPE.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
        </FlexBetweenColumn>
    );
};

Students.propTypes = {
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Students;
