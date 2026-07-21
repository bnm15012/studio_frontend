import { useAppSelector } from "@/state";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box } from "@mui/material";
import Views from "@/core/crud/Views";
import { studentsCruds, studentsAssignmentsCruds } from "../../../api/all.api";
import StudentCard from "./StudentCard";
import { useAppUI } from "@/context/UIContext";
import { useAlert } from "@/core/components/feedback/Alert";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import StudentInvoice from "./StudentInvoice";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog";
import StudentAssignActivityCard from "./StudentAssignActivityCard";
import { getEndDateBySubscriptionPlan } from "../../../utils/SubscriptionPlanUtil";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import StudentAttendence from "./StudentAttendence";
import OtherInfo from "./OtherInfo";
import { WhatsApp } from "@mui/icons-material";
import SelectTemplateDialog from "../Communication/SelectTemplateDialog";
import type {
    Activity,
    BatchEntry,
    genderType,
    Payment,
    paymentStatus,
    paymentType,
    Student,
    StudentAssignment,
} from "@/api/types";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";

const LIMIT = 12;

const FIELD_META: FieldMeta = {
    primary: "studentId",
    root: "branchId",
};

const PAYMENT_STATUS: paymentStatus[] = ["COMPLETED", "PENDING"];
const PAYMENT_TYPE: paymentType[] = ["CASH", "UPI"];

const FIELDS: FieldDef<Student>[] = [
    {
        show: true,
        section: "Personal Details",
        name: "imageUrl",
        label: "Image",
        type: "IMAGE",
        extraProp: { size: "30px" },
    },
    {
        show: true,
        section: "Personal Details",
        name: "name",
        label: "Name",
        validation: { required: true },
    },
    {
        show: true,
        section: "Contact Details",
        name: "email",
        label: "Email",
        validation: {
            required: true,
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email is not valid",
        },
    },
    {
        show: true,
        section: "Contact Details",
        name: "phone",
        label: "Phone",
        validation: {
            required: true,
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
        extraProp: { includeCurrentTime: false },
    },
    {
        show: false,
        section: "Personal Details",
        name: "age",
        label: "Age",
        type: "NUMBER",
        getValue: (_value, row) => {
            if (!row.dob) return null;

            const dob = new Date(String(row.dob));
            const today = new Date();

            const hasBirthdayPassed =
                today.getMonth() > dob.getMonth() ||
                (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

            const age = today.getFullYear() - dob.getFullYear();
            return hasBirthdayPassed ? age : age - 1;
        },
        extraProp: { readOnly: true },
    },
    {
        show: true,
        section: "Personal Details",
        name: "membershipStatus",
        label: "Status",
        getValue: (value) => (
            <Box
                sx={{
                    color: value === "ACTIVE" ? "green" : "red",
                    fontWeight: "bolder",
                }}
            >
                {String(value)}
            </Box>
        ),
        defaultValue: "ACTIVE",
        extraProp: { readOnly: true },
    },
    {
        show: false,
        section: "Personal Details",
        name: "gender",
        label: "Gender",
        type: "SELECT",
        validation: { required: true },
        getValue: (value: genderType) => value && { key: value, value },
        defaultValue: "MALE",
        extraProp: {
            getOptions: async (search: string, page: number, limit: number) =>
                ["MALE", "FEMALE", "NOT_TO_SAY"]
                    .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                    .slice(page * limit, (page + 1) * limit)
                    .map((a) => ({ key: a, value: a })),
        },
    },
    {
        show: false,
        section: "Contact Details",
        name: "address",
        label: "Address",
    },
    {
        show: false,
        section: "Contact Details",
        name: "emergencyContactNumber",
        label: "Emergency Contact",
        validation: {
            required: true,
            regex: /^[6-9]\d{9}$/,
            message: "Must be exactly 10 digit with no spaces and start with 6,7,8,9 only",
        },
    },
];

const VIEWS = ["LIST", "CARD", "FORM"] as const;

const filterOptions = [{ name: "Status", key: "membershipStatus", values: ["ACTIVE", "INACTIVE"] }];

interface StudentsProps {
    ID?: number;
}

const Students: React.FC<StudentsProps> = ({ ID }) => {
    const { studio, currentBranch, isMobile, permissions } = useAppUI();
    const allActivities = useAppSelector((state) => state.activities.items);
    const cachedMembershipTypes = useAppSelector((state) => state.membershipPackages.items);
    const showAlert = useAlert();

    const [showInvoice, setShowInvoice] = useState<StudentAssignment>();
    const [showAttendence, setShowAttendence] = useState<StudentAssignment>();
    const tableState = useAppSelector((state) => state["students"]) || {
        recordById: {},
    };
    const [openPaymentDialog, setOpenPaymentDialog] = useState<
        | false
        | {
              onSave: (data: Partial<Payment>) => void;
              onClose: () => void;
              paymentInit: Partial<Payment>;
          }
    >(false);
    const [openTemplateDialog, setOpenTemplateDialog] = useState<{
        open: boolean;
        data?: Student;
    }>({ open: false });
    const api = useRef<ViewsApiRef>({});
    const apiStudent = useRef<ViewsApiRef>({});
    let extraField: FieldDef<Student>[] = [];
    if (permissions.ENROLMENT) {
        extraField = [
            {
                show: false,
                section: "Additional Info",
                name: "additionalData",
                label: "",
                type: "CUSTOM",
                extraProp: {
                    CustomComponent: OtherInfo,
                },
            },
        ];
    }

    const awaitForDialog = useCallback(
        (paymentInit: Partial<Payment>) =>
            new Promise((resolve) => {
                const handleSave = (data: Partial<Payment>) => {
                    setOpenPaymentDialog(false);
                    resolve(data);
                };

                const handleClose = () => {
                    setOpenPaymentDialog(false);
                    throw new Error("Payment cancelled");
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
        async (row: StudentAssignment) => {
            const modifiedData = { ...row };

            const paymentInit: Partial<Payment> = {
                actualAmount: Number(modifiedData.activityAmount ?? 0),
                amount: Number(modifiedData.activityAmount ?? 0),
                status: PAYMENT_STATUS[0],
                paymentType: PAYMENT_TYPE[0],
                paymentDate:
                    modifiedData.paymentEntry.paymentDate ?? getCurrentDateTimeLocal() ?? "",
            };

            const paymentData = await awaitForDialog(paymentInit);
            if (paymentData) {
                modifiedData.paymentEntry = { ...row.paymentEntry, ...paymentData };
            }
            return modifiedData;
        },
        [awaitForDialog],
    );

    const getBatchEntries = useCallback(
        (
            activityName: string,
            membershipType?: string,
            daysPerWeek?: string | number,
            batchName?: string,
        ) =>
            allActivities
                .find((a: Activity) => a.activityType === activityName)
                ?.batchEntries?.filter(
                    (b: BatchEntry) =>
                        (!membershipType || b.planType === membershipType) &&
                        (!daysPerWeek || b.daysPerWeek === daysPerWeek) &&
                        (!batchName || b.name === batchName),
                ) || null,
        [allActivities],
    );

    const overRideOnChange = useCallback(
        (value: unknown, obj: Record<string, unknown>, fieldPath: string) => {
            if (!value) return obj;

            const newObj = { ...obj };

            if (fieldPath === "activityName") {
                const entries = getBatchEntries(String(value));
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.membershipType = entry?.planType;
                newObj.daysPerWeek = entry?.daysPerWeek;
                newObj.batchName = entry?.name;
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
                newObj.membershipEndDate =
                    entry?.planType &&
                    getEndDateBySubscriptionPlan(
                        String(newObj.membershipStartDate ?? ""),
                        entry?.planType,
                        cachedMembershipTypes,
                    );
            } else if (fieldPath === "membershipType") {
                const entries = getBatchEntries(String(newObj.activityName), String(value));
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.daysPerWeek = entry?.daysPerWeek;
                newObj.batchName = entry?.name;
                newObj.membershipEndDate = getEndDateBySubscriptionPlan(
                    String(newObj.membershipStartDate ?? ""),
                    String(value),
                    cachedMembershipTypes,
                );
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "daysPerWeek") {
                const entries = getBatchEntries(
                    String(newObj.activityName),
                    String(newObj.membershipType),
                    String(value),
                );
                const entry = entries?.length === 1 ? entries[0] : undefined;
                newObj.batchName = entry?.name;
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "batchName") {
                const entry = getBatchEntries(
                    String(newObj.activityName),
                    String(newObj.membershipType),
                    String(newObj.daysPerWeek ?? ""),
                    String(value),
                )?.[0];
                newObj.batchTime = entry ? `${entry.startTime}-${entry.endTime}` : undefined;
                newObj.activityAmount = entry?.price;
            } else if (fieldPath === "membershipStartDate") {
                newObj.membershipEndDate = getEndDateBySubscriptionPlan(
                    String(value),
                    String(newObj.membershipType),
                    cachedMembershipTypes,
                );
            }
            return newObj;
        },
        [getBatchEntries, cachedMembershipTypes],
    );

    const ASSIGNMENT_FIELD = useMemo(
        (): FieldDef<Student> => ({
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
                        enabled: (row: StudentAssignment) =>
                            row?.paymentEntry?.status === "COMPLETED",
                        sx: { color: "primary.main" },
                        onClick: (row: StudentAssignment) => {
                            setShowInvoice(row);
                        },
                    },
                    {
                        hide: permissions.ATTENDANCE,
                        name: "Attendance",
                        icon: <HowToRegIcon />,
                        enabled: () => true,
                        sx: { color: "primary.main" },
                        onClick: (row: StudentAssignment) => {
                            setShowAttendence(row);
                        },
                    },
                ],
                fields: [
                    {
                        show: true,
                        name: "activityName",
                        label: "Activity",
                        type: "SELECT",
                        getValue: (value: string) => value && { value, key: String(value) },
                        editable: (row: Record<string, unknown>) => row.assignmentId === 0,
                        extraProp: {
                            getOptions: async (search: string, page: number, limit: number) =>
                                allActivities
                                    .filter((a: Activity) =>
                                        (a.activityType as string)
                                            .toLowerCase()
                                            .includes(search.toLowerCase()),
                                    )
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a: Activity) => ({
                                        key: a.activityType,
                                        value: a.activityType,
                                    })),
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "membershipType",
                        label: "Membership Type",
                        type: "SELECT",
                        editable: (row: Record<string, unknown>) => row.assignmentId === 0,
                        getValue: (value: unknown) => value && { value, key: String(value) },
                        extraProp: {
                            addValue: false,
                            getOptions: async (
                                search: string,
                                page: number,
                                limit: number,
                                row: Record<string, unknown>,
                            ) => {
                                const batchEntries = allActivities.find(
                                    (a: Activity) => a.activityType === row["activityName"],
                                )?.batchEntries;
                                return [
                                    ...new Set(
                                        (batchEntries as BatchEntry[] | undefined)
                                            ?.filter((b: BatchEntry) =>
                                                (b.planType as string)
                                                    .toLowerCase()
                                                    .includes(search.toLowerCase()),
                                            )
                                            .map((b: BatchEntry) => b.planType),
                                    ),
                                ]
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a: unknown) => ({ key: a, value: a }));
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "daysPerWeek",
                        label: "Days / week",
                        editable: (row: Record<string, unknown>) => row.assignmentId === 0,
                        type: "SELECT",
                        getValue: (value: unknown) => value && { value, key: String(value) },
                        extraProp: {
                            addValue: false,
                            getOptions: async (
                                search: string,
                                page: number,
                                limit: number,
                                row: Record<string, unknown>,
                            ) => {
                                const batchEntries = allActivities
                                    .find((a: Activity) => a.activityType === row["activityName"])
                                    ?.batchEntries?.filter(
                                        (b: BatchEntry) => b.planType === row["membershipType"],
                                    );
                                return [
                                    ...new Set(
                                        (batchEntries as BatchEntry[] | undefined)?.map(
                                            (b: BatchEntry) => b.daysPerWeek,
                                        ),
                                    ),
                                ].map((a: unknown) => ({
                                    key: a,
                                    value: a,
                                }));
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: permissions.BATCH,
                        name: "batchName",
                        label: "Batch Name",
                        type: "SELECT",
                        editable: (row: Record<string, unknown>) => row.assignmentId === 0,
                        getValue: (value: unknown) => value && { value, key: String(value) },
                        extraProp: {
                            addValue: false,
                            getOptions: async (
                                search: string,
                                page: number,
                                limit: number,
                                row: Record<string, unknown>,
                            ) => {
                                const batchEntries = allActivities
                                    .find((a: Activity) => a.activityType === row["activityName"])
                                    ?.batchEntries?.filter(
                                        (b: BatchEntry) =>
                                            b.planType === row["membershipType"] &&
                                            b.daysPerWeek === row["daysPerWeek"],
                                    );
                                return [
                                    ...new Set(
                                        (batchEntries as BatchEntry[] | undefined)
                                            ?.filter((b: BatchEntry) =>
                                                (b.name as string)
                                                    .toLowerCase()
                                                    .includes(search.toLowerCase()),
                                            )
                                            .map((b: BatchEntry) => b.name),
                                    ),
                                ]
                                    .slice(page * limit, (page + 1) * limit)
                                    .map((a: unknown) => ({ key: a, value: a }));
                            },
                        },
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "activityAmount",
                        label: "Amount",
                        getValue: (v: unknown, row: Record<string, unknown>, isEdit: boolean) => {
                            if (!isEdit) {
                                const paymentEntry = row.paymentEntry as
                                    | Record<string, unknown>
                                    | undefined;
                                if (!row || !paymentEntry) return null;
                                return (
                                    <>
                                        Rs. {String(paymentEntry.amount)}{" "}
                                        {paymentEntry.actualAmount &&
                                            paymentEntry.actualAmount !== paymentEntry.amount && (
                                                <span
                                                    style={{
                                                        textDecoration: "line-through",
                                                        color: "#EF4444",
                                                    }}
                                                >
                                                    Rs. {String(paymentEntry.actualAmount)}
                                                </span>
                                            )}
                                    </>
                                );
                            } else {
                                return v;
                            }
                        },
                        extraProp: { readOnly: true },
                        validation: { required: true },
                    },
                    {
                        show: permissions.BATCH,
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
                        defaultValue: getCurrentDateTimeLocal(),
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "membershipStartDate",
                        label: "Start Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeLocal(),
                        validation: { required: true },
                    },
                    {
                        show: true,
                        name: "membershipEndDate",
                        label: "End Date",
                        type: "DATE",
                        defaultValue: getCurrentDateTimeLocal(),
                        validation: { required: true },
                        extraProp: { min: getCurrentDateTimeLocal(), readOnly: true },
                    },
                    {
                        show: permissions.PAYMENT_DATE,
                        name: "paymentEntry.paymentDate",
                        label: "Payment Date",
                        type: "DATE",
                        editable: (row: Record<string, unknown>) =>
                            (row?.paymentEntry as Record<string, unknown> | undefined)
                                ?.paymentStatus !== "COMPLETED",
                        defaultValue: getCurrentDateTimeLocal(),
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
                        label: "Status",
                        defaultValue: "INACTIVE",
                        getValue: (value: string) => (
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
                infiniteScroll: false,
            },
        }),
        [permissions, allActivities, beforeAdd, currentBranch.branchId, overRideOnChange],
    );

    return (
        <FlexBetweenColumn>
            <Views<Student>
                actionBarProps={{
                    filterOptions: filterOptions,
                    qrProps: { link: "student-form" },
                    tableName: "students",
                }}
                formKey={ID}
                beforeAdd={(row: Student) => {
                    delete row.otherinfo;
                    delete row.age;
                    return row;
                }}
                beforeUpdate={async (row: Student) => {
                    delete row.otherinfo;
                    delete row.age;
                    return row;
                }}
                actions={[
                    {
                        name: "WhatsApp",
                        icon: <WhatsApp />,
                        enabled: () => true,
                        sx: { color: "success.main" },
                        onClick: (row: Student) => {
                            if (row.studentId) {
                                setOpenTemplateDialog({ open: true, data: row });
                            } else {
                                showAlert("No student data available, please try again", "error");
                            }
                        },
                    },
                ]}
                tableName={"students"}
                apiRef={apiStudent}
                tableCruds={studentsCruds}
                size={LIMIT}
                key={"students"}
                fields={[...FIELDS, ...extraField, ASSIGNMENT_FIELD]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="name"
                CardContentComponent={StudentCard}
                editMode={"FORM"}
            />
            {showInvoice && (
                <StudentInvoice
                    studio={studio}
                    currentBranch={currentBranch}
                    open={true}
                    isUser={true}
                    onClose={() => setShowInvoice(undefined)}
                    studentData={tableState.recordById[showInvoice.studentId]}
                    activityData={showInvoice}
                />
            )}
            {openPaymentDialog && (
                <PaymentEntryDialog
                    open={true}
                    onSave={(data) => {
                        if (openPaymentDialog) openPaymentDialog.onSave(data);
                    }}
                    onClose={() => {
                        if (openPaymentDialog) openPaymentDialog.onClose();
                    }}
                    initialData={openPaymentDialog?.paymentInit}
                    paymentStatus={PAYMENT_STATUS}
                    paymentType={PAYMENT_TYPE.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
            {showAttendence && (
                <StudentAttendence
                    open={true}
                    onClose={() => setShowAttendence(undefined)}
                    activityData={showAttendence}
                />
            )}
            {openTemplateDialog.open && (
                <SelectTemplateDialog
                    open={openTemplateDialog.open}
                    onClose={() => setOpenTemplateDialog({ open: false })}
                    data={{
                        ids: [openTemplateDialog.data!.studentId],
                        raw: openTemplateDialog.data!,
                        phoneNumber: openTemplateDialog.data!.phone,
                        email: openTemplateDialog.data!.email,
                        notificationType: "WHATSAPP",
                    }}
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Students;
