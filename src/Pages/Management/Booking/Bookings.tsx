import { useAppSelector, useAppDispatch } from "@/state";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import type { FieldDef, FieldMeta, ViewMode, ViewsApiRef } from "@/core/types";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { IconButton, Popover, DialogContentText } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import CalendarView from "@/Pages/Management/Booking/Calendar/CalendarView.tsx";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil.js";
import Views from "@/core/crud/Views.jsx";
import type {
    Booking,
    Client,
    Payment,
    paymentStatus,
    paymentType,
    bookingStatus,
} from "@/api/types";

import { bookingCruds, genericTemplateCruds } from "@/api/all.api.js";
import { useAppUI } from "@/context/UIContext";
import BookingCard from "@/Pages/Management/Booking/BookingCard.jsx";
import { useAlert } from "@/core/components/feedback/Alert.jsx";
import { getCLientByNamesAPI } from "@/Pages/Management/Client/client.api.js";
import PaymentEntryDialog from "@/Pages/Management/Payments/PaymentEntryDialog.jsx";
import BookingInvoice from "@/Pages/Management/Booking/BookingInvoice.jsx";
import PaymentList from "@/Pages/Management/Booking/PaymentList.jsx";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle.ts";

const paymentTypes: paymentType[] = ["CASH", "UPI"];
const paymentStatusTypes: paymentStatus[] = ["COMPLETED", "PENDING"];
const bookingStatusTypes: bookingStatus[] = ["CONFIRMED", "CANCELLED", "COMPLETED"];

const LIMIT = 10;

const FIELD_META: FieldMeta = {
    primary: "id",
    root: "branchId",
};

const VIEWS: ViewMode[] = ["LIST", "CARD"];

const Bookings = ({ ID }: { ID?: number }) => {
    const { isMobile, token, studio, currentBranch } = useAppUI();
    const dispatch = useAppDispatch();
    const showAlert = useAlert();

    const [calendarAnchor, setCalendarAnchor] = useState<HTMLButtonElement | null>(null);
    const calendarButtonRef = useRef(null);
    const [showInvoice, setShowInvoice] = useState<Booking | null>(null);
    const [confirmStateDialog, setConfirmStateDialog] = useState<{
        row: Booking;
        newState: bookingStatus;
        title: string;
        message: string;
    } | null>(null);
    const api = useRef<ViewsApiRef>({});
    const templates = useAppSelector((state) => state.genericTemplate.items);
    const bookingTemplate = templates.find((t) => t.templateType === "BOOKING");

    useEffect(() => {
        dispatch(
            genericTemplateCruds.getAll(
                showAlert,
                () => {},
                token,
                { searchTerm: "BOOKING" },
                studio.studioId,
                false,
            ),
        );
    }, [dispatch, showAlert, studio, token]);

    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const pendingPaymentRef = useRef<{
        onSave: (data: Partial<Payment> | null) => void;
        onClose: () => void;
        paymentInit: Partial<Payment>;
        refund?: boolean;
        type?: string;
        actualAmount?: number;
    } | null>(null);
    const getClientsByName = useCallback(
        async (params: { clientName?: string; page?: number; size?: number }) => {
            const { success, data, message } = await getCLientByNamesAPI({
                branchId: currentBranch.branchId,
                token,
                params,
            });
            if (success) {
                return (
                    data.map((c: Partial<Client>) => ({
                        value: c.pocName,
                        key: c.clientId,
                    })) || []
                );
            } else {
                showAlert(message, "error");
                return [];
            }
        },
        [currentBranch.branchId, showAlert, token],
    );

    const awaitForDialog = useCallback(
        (
            paymentInit: Partial<Payment>,
            options?: { refund?: boolean; type?: string; actualAmount?: number },
        ) =>
            new Promise<Partial<Payment> | null>((resolve) => {
                const handleSave = (data: Partial<Payment> | null) => {
                    setOpenPaymentDialog(false);
                    resolve(data);
                };

                const handleClose = () => {
                    setOpenPaymentDialog(false);
                    resolve(null);
                };

                setOpenPaymentDialog(true);
                pendingPaymentRef.current = {
                    onSave: handleSave,
                    onClose: handleClose,
                    paymentInit,
                    ...(options?.refund !== undefined && { refund: options.refund }),
                    ...(options?.type !== undefined && { type: options.type }),
                    ...(options?.actualAmount !== undefined && {
                        actualAmount: options.actualAmount,
                    }),
                };
            }),
        [],
    );

    const beforeUpdate = useCallback(async (row: Booking) => {
        const {
            paymentStatus: _paymentStatus,
            dueAmount: _dueAmount,
            paidAmount: _paidAmount,
            ...rest
        } = row;
        const modifiedData: Booking = { ...rest } as Booking;
        const clientEntry = modifiedData.clientEntry;
        if (typeof clientEntry === "object" && clientEntry !== null && "key" in clientEntry) {
            const entry = clientEntry as { key?: number; clientId?: number };
            modifiedData.clientEntry = { clientId: entry.clientId ?? 0 };
        }
        return modifiedData;
    }, []);

    const beforeAdd = useCallback(
        async (row: Booking): Promise<Booking> => {
            const {
                paymentStatus: _paymentStatus,
                dueAmount: _dueAmount,
                paidAmount: _paidAmount,
                ...rest
            } = row;
            const modifiedData: Booking = { ...rest } as Booking;
            const clientEntry = modifiedData.clientEntry;

            if (typeof clientEntry === "object" && clientEntry !== null && "key" in clientEntry) {
                const entry = clientEntry as { key?: number };
                modifiedData.clientEntry = { clientId: entry.key ?? 0 };
            }

            const paymentInit: Partial<Payment> = {
                amount: row.totalAmount,
                status: paymentStatusTypes[0] ?? "PENDING",
                paymentType: paymentTypes[0] ?? "CASH",
                branchId: currentBranch.branchId,
                paymentDate: getCurrentDateTimeLocal() ?? "",
            };

            const paymentData = await awaitForDialog(paymentInit, {
                type: "BOOKING",
                actualAmount: row.totalAmount,
            });

            if (paymentData) {
                modifiedData.paymentEntries = [
                    { ...(row.paymentEntries?.[0] ?? {}), ...(paymentData ?? {}) } as Payment,
                ];
            } else {
                throw new Error("Payment cancelled");
            }
            return modifiedData;
        },
        [awaitForDialog, currentBranch.branchId],
    );

    const actions = useMemo(
        () => [
            {
                name: "Complete",
                help: "Mark as Completed",
                icon: <CheckCircleIcon />,
                sx: { color: "success.main" },
                hide: (row: Booking) => row.state === "COMPLETED",
                onClick: (row: Booking) => {
                    setConfirmStateDialog({
                        row,
                        newState: "COMPLETED",
                        title: "Confirm Booking Completion",
                        message: `Are you sure you want to mark booking "${row.purpose || row.id}" as COMPLETED?`,
                    });
                },
            },
            {
                name: "Cancel",
                help: "Cancel Booking",
                icon: <CancelIcon />,
                sx: { color: "error.main" },
                hide: (row: Booking) => row.state === "CANCELLED",
                onClick: (row: Booking) => {
                    setConfirmStateDialog({
                        row,
                        newState: "CANCELLED",
                        title: "Confirm Booking Cancellation",
                        message: `Are you sure you want to CANCEL booking "${row.purpose || row.id}"?`,
                    });
                },
            },
            {
                name: "Document",
                help: "View Invoice",
                icon: <ReceiptIcon />,
                enabled: true,
                sx: { color: "primary.main" },
                onClick: (row: Booking) => {
                    setShowInvoice(row);
                },
            },
        ],
        [],
    );

    const FIELDS = useMemo(
        () =>
            [
                { show: true, section: "Booking Details", name: "purpose", label: "Purpose" },
                {
                    show: true,
                    section: "Booking Details",
                    name: "clientEntry",
                    label: "Poc Name",
                    type: "SELECT",
                    getValue: (value: Booking["clientEntry"] | undefined, row: Booking) => {
                        const client = value || row.clientEntry;
                        return { value: client?.pocName || "", key: client?.clientId || 0 };
                    },
                    extraProp: {
                        addValue: false,
                        saveType: "object",
                        getOptions: (searchTerm = "", page: number, size: number) =>
                            getClientsByName({ clientName: searchTerm, page, size }),
                    },
                },
                {
                    show: true,
                    section: "Payment Details",
                    name: "totalAmount",
                    label: "Total Amount",
                    type: "NUMBER",
                },
                {
                    show: true,
                    section: "Booking Details",
                    name: "state",
                    label: "Booking Status",
                    type: "STATE",
                    colorMap: {
                        CONFIRMED: "#22c55e",
                        CANCELLED: "#ef4444",
                        COMPLETED: "#3b82f6",
                    },
                    defaultValue: bookingStatusTypes[0],
                },
                {
                    show: true,
                    name: "paymentStatus",
                    label: "Payment Status",
                    section: "Payment Details",
                    type: "STATE",
                    colorMap: {
                        PAID: "#22c55e",
                        PARTIAL: "#f59e0b",
                        PENDING: "#ef4444",
                        REFUNDED: "#ef4444",
                    },
                    getValue: (_value: paymentStatus | undefined, row: Booking) => {
                        const dueAmount =
                            ((row.totalAmount as number) || 0) -
                            ((Array.isArray(row.paymentEntries) &&
                                (row.paymentEntries as Payment[])
                                    .filter((p) => p.status == "COMPLETED")
                                    .map((p) => p.amount as number)
                                    .reduce((a: number, b: number) => a + b, 0)) ||
                                0);
                        if (dueAmount === 0) {
                            return "PAID";
                        } else if (row.state === "CANCELLED") {
                            return "REFUNDED";
                        } else if (dueAmount > 0 && dueAmount != (row.totalAmount as number)) {
                            return "PARTIAL";
                        }
                        return "PENDING";
                    },
                },
                {
                    show: true,
                    name: "bookingDate",
                    label: "Booking Date",
                    section: "Booking Details",
                    type: "DATETIME",
                    defaultValue: getCurrentDateTimeLocal(),
                },
                {
                    show: false,
                    name: "paidAmount",
                    label: "Paid Amount",
                    section: "Payment Details",
                    type: "NUMBER",
                    extraProp: { readOnly: true },
                    getValue: (_obj: number | undefined, row: Booking) =>
                        (Array.isArray(row.paymentEntries) &&
                            (row.paymentEntries as Payment[])
                                .filter((p) => p.status == "COMPLETED")
                                .map((p) => p.amount as number)
                                .reduce((a: number, b: number) => a + b, 0)) ||
                        0,
                },
                {
                    show: false,
                    name: "dueAmount",
                    label: "Due Amount",
                    section: "Payment Details",
                    type: "NUMBER",
                    extraProp: { readOnly: true },
                    getValue: (_obj: number | undefined, row: Booking) =>
                        ((row.totalAmount as number) || 0) -
                        ((Array.isArray(row.paymentEntries) &&
                            (row.paymentEntries as Payment[])
                                .filter((p) => p.status == "COMPLETED")
                                .map((p) => p.amount as number)
                                .reduce((a: number, b: number) => a + b, 0)) ||
                            0),
                },
                {
                    show: true,
                    section: "Booking Details",
                    name: "startTime",
                    label: "Start Time",
                    type: "DATETIME",
                    defaultValue: getCurrentDateTimeLocal(),
                },
                {
                    show: true,
                    section: "Booking Details",
                    name: "endTime",
                    label: "End Time",
                    type: "DATETIME",
                    defaultValue: getCurrentDateTimeLocal(),
                },
                { show: false, section: "Booking Details", name: "notes", label: "Notes" },
                {
                    show: false,
                    section: "Payments",
                    name: "paymentEntries",
                    label: "Payments",
                    type: "COMPONENT",
                    CustomComponent: PaymentList,
                },
            ] as FieldDef<Booking>[],
        [getClientsByName],
    );

    return (
        <FlexBetweenColumn>
            <Views<Booking>
                actionBarProps={{
                    tableName: "booking",
                    children: (
                        <IconButton
                            onClick={(e) => setCalendarAnchor(e.currentTarget)}
                            sx={iconBtnFilledSx}
                            ref={calendarButtonRef}
                        >
                            <CalendarMonthIcon sx={{ padding: 0, margin: "auto" }} />
                        </IconButton>
                    ),
                }}
                {...(ID !== undefined && { formKey: ID })}
                apiRef={api}
                tableName={"booking"}
                tableCruds={bookingCruds}
                size={LIMIT}
                beforeAdd={beforeAdd}
                beforeUpdate={beforeUpdate}
                key={"booking"}
                fields={FIELDS}
                actions={actions}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1] ?? "LIST"}
                fieldToDisplayOnDelete="purpose"
                CardContentComponent={BookingCard}
                editMode={"FORM"}
            />
            <Popover
                open={Boolean(calendarAnchor)}
                anchorEl={calendarAnchor}
                onClose={() => setCalendarAnchor(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <CalendarView />
            </Popover>
            {openPaymentDialog && (
                <PaymentEntryDialog
                    open={true}
                    onSave={(data) => pendingPaymentRef.current?.onSave?.(data)}
                    onClose={() => pendingPaymentRef.current?.onClose?.()}
                    initialData={pendingPaymentRef.current?.paymentInit ?? {}}
                    paymentStatus={paymentStatusTypes}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                    {...(pendingPaymentRef.current?.refund !== undefined && {
                        refund: pendingPaymentRef.current.refund,
                    })}
                    {...(pendingPaymentRef.current?.type !== undefined && {
                        type: pendingPaymentRef.current.type,
                    })}
                    {...(pendingPaymentRef.current?.actualAmount !== undefined && {
                        actualAmount: pendingPaymentRef.current.actualAmount,
                    })}
                />
            )}
            {showInvoice && (
                <BookingInvoice
                    open={true}
                    isUser={true}
                    studio={studio}
                    {...(bookingTemplate ? { template: bookingTemplate } : {})}
                    currentBranch={currentBranch}
                    onClose={() => setShowInvoice(null)}
                    bookingData={showInvoice}
                />
            )}
            {confirmStateDialog && (
                <StyledDialog
                    open={Boolean(confirmStateDialog)}
                    onClose={() => setConfirmStateDialog(null)}
                    title={confirmStateDialog.title}
                    titleBgColor={confirmStateDialog.newState === "COMPLETED" ? "success" : "error"}
                    confirmText={
                        confirmStateDialog.newState === "COMPLETED"
                            ? "Mark Complete"
                            : "Cancel Booking"
                    }
                    onConfirm={async () => {
                        const { row, newState } = confirmStateDialog;
                        setConfirmStateDialog(null);
                        try {
                            let updatedRow = await beforeUpdate({ ...row, state: newState });
                            if (newState === "CANCELLED") {
                                const paidAmount = Array.isArray(row.paymentEntries)
                                    ? row.paymentEntries.reduce(
                                          (acc, curr) => acc + (curr.amount || 0),
                                          0,
                                      )
                                    : 0;
                                const refundInit: Partial<Payment> = {
                                    amount: paidAmount > 0 ? paidAmount : row.totalAmount,
                                    status: paymentStatusTypes[0] ?? "COMPLETED",
                                    paymentType: paymentTypes[0] ?? "CASH",
                                    branchId: currentBranch.branchId,
                                    paymentDate: getCurrentDateTimeLocal() ?? "",
                                };
                                const refundData = await awaitForDialog(refundInit, {
                                    refund: true,
                                    type: "BOOKING",
                                    actualAmount: row.totalAmount,
                                });
                                if (refundData) {
                                    const updatedPaymentEntries = [
                                        ...(row.paymentEntries ?? []),
                                        { ...refundData } as Payment,
                                    ];
                                    updatedRow = {
                                        ...updatedRow,
                                        paymentEntries: updatedPaymentEntries,
                                    };
                                } else {
                                    return;
                                }
                            }
                            dispatch(
                                bookingCruds.update(
                                    Number(row.id),
                                    updatedRow,
                                    token,
                                    showAlert,
                                    () => {},
                                ),
                            );
                        } catch (err) {
                            showAlert(
                                err instanceof Error
                                    ? err.message
                                    : "Failed to update booking status",
                                "error",
                            );
                        }
                    }}
                >
                    <DialogContentText sx={{ textAlign: "center", py: 1 }}>
                        {confirmStateDialog.message}
                    </DialogContentText>
                </StyledDialog>
            )}
        </FlexBetweenColumn>
    );
};

export default Bookings;
