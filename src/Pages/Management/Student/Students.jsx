import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Views from "../../../Components/Views/Views";
import { studentsCruds, studentsAssignmentsCruds } from "../../../api/all.api";
import StudentCard from "./StudentCard.jsx";
import { useUI } from "../../../context/UIContext";
import { usePageSearch } from "../../../hooks/useSearch";
import SearchField from "../../../Components/SearchField";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import StudentInvoice from "./StudentInvoice.jsx";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog.jsx";

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
    { show: true, section: "Contact Details", name: "phone", label: "Phone" },
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
        extraProp: { readOnly: true },
    },
    { show: false, section: "Contact Details", name: "address", label: "Address" },
    {
        show: false,
        section: "Contact Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact Number",
    },
];
const VIEWS = ["LIST", "CARD", "FORM"];

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

const Students = ({ ID }) => {
    const navigate = useNavigate();
    const { isMobile } = useUI();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const { triggerSearch } = usePageSearch();
    const allActivities = useSelector((state) => state.activity.activities);
    const [showInvoice, setShowInvoice] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

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
            const batchEntry = allActivities
                ?.find((a) => a.activityType === modifiedData["activityName"])
                ?.batchEntries?.find(
                    (b) =>
                        b.planType === modifiedData["membershipType"] &&
                        b.name === modifiedData["batchName"] &&
                        b.daysPerWeek === modifiedData["daysPerWeek"],
                );

            let paymentInit = {
                actualAmount: 0,
                amount: 0,
                status: PAYMENT_STATUS[0],
                paymentType: PAYMENT_TYPE[0],
            };

            if (batchEntry) {
                modifiedData.activityAmount = batchEntry.price;
                modifiedData.batchTime = batchEntry.startTime + "-" + batchEntry.endTime;
                paymentInit = {
                    actualAmount: batchEntry.price,
                    amount: batchEntry.price,
                    status: PAYMENT_STATUS[0],
                    paymentType: PAYMENT_TYPE[0],
                };
            }
            const paymentData = await awaitForDialog(paymentInit);

            if (paymentData) {
                modifiedData.paymentEntry = { ...row.paymentEntry, ...paymentData };
            } else {
                return null;
            }
            return modifiedData;
        },
        [allActivities, awaitForDialog],
    );

    const ASSIGNMENT_FIELD = useMemo(
        () => ({
            show: false,
            name: "assignments",
            label: "Assigned Activities",
            type: "VIEW",

            viewProps: {
                tableCruds: studentsAssignmentsCruds,
                tableName: "studentActivities",
                beforeAdd,
                size: 2,
                actions: [
                    {
                        name: "Document",
                        icon: <ReceiptIcon />,
                        enabled: true,
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
                    },
                    {
                        show: true,
                        name: "membershipType",
                        label: "Membership Type",
                        type: "SELECT",
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
                    },
                    {
                        show: true,
                        name: "daysPerWeek",
                        label: "Days Per week",
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
                    },
                    {
                        show: true,
                        name: "batchName",
                        label: "Batch Name",
                        type: "SELECT",
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
                    },
                    {
                        show: true,
                        name: "activityAmount",
                        label: "Amount",
                        getValue: (v, row, isEdit) => {
                            if (isEdit) {
                                const batchEntry = allActivities
                                    .find((a) => a.activityType === row["activityName"])
                                    ?.batchEntries?.find(
                                        (b) =>
                                            b.planType === row["membershipType"] &&
                                            b.name === row["batchName"] &&
                                            b.daysPerWeek === row["daysPerWeek"],
                                    );
                                return batchEntry?.["price"] || v;
                            } else {
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
                            }
                        },
                        extraProp: { readOnly: true },
                        defaultValue: "-",
                    },
                    {
                        show: true,
                        name: "batchTime",
                        label: "Batch Time",
                        getValue: (v, row) => {
                            const batchEntry = allActivities
                                .find((a) => a.activityType === row["activityName"])
                                ?.batchEntries?.find(
                                    (b) =>
                                        b.planType === row["membershipType"] &&
                                        b.name === row["batchName"] &&
                                        b.daysPerWeek === row["daysPerWeek"],
                                );
                            return batchEntry
                                ? batchEntry["startTime"] + "-" + batchEntry["endTime"]
                                : v;
                        },
                        extraProp: { readOnly: true },
                        defaultValue: "-",
                    },
                    {
                        show: true,
                        name: "registrationDate",
                        label: "Registration Date",
                        type: "DATE",
                        extraProp: { readOnly: true },
                        defaultValue: getCurrentDateTimeUTC(),
                    },
                    {
                        show: true,
                        name: "membershipStartDate",
                        label: "Start Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeUTC(),
                    },
                    {
                        show: true,
                        name: "membershipEndDate",
                        label: "End Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeUTC(),
                    },
                    {
                        show: true,
                        name: "paymentEntry.paymentDate",
                        label: "Payment Date",
                        type: "DATE",
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
                fieldToDisplayOnDelete: "activityName",
            },
        }),
        [allActivities, beforeAdd, currentBranch.branchId],
    );

    return (
        <FlexBetweenColumn>
            {!ID && (
                <FlexBetween paddingBottom={2} gap={1}>
                    <SearchField handleSearch={triggerSearch} filterOptions={filterOptions} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate("/management/students/NEW");
                        }}
                        sx={{ fontWeight: "bold", padding: ".8rem" }}
                    >
                        <AddIcon sx={{ padding: 0, margin: "auto" }} />
                    </Button>
                </FlexBetween>
            )}
            <Views
                formKey={ID}
                tableName={"students"}
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
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Students;
