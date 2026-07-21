import { useAppSelector, useAppDispatch } from "@/state";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import type { FieldDef, FieldMeta, ViewsApiRef } from "@/core/types";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { IconButton, Popover } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarView from "./Calendar/CalendarView.tsx";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil.js";
import Views from "@/core/crud/Views.jsx";
import type { Booking, Client, Payment, paymentStatus, paymentType } from "../../../api/types";

import { bookingCruds, genericTemplateCruds } from "../../../api/all.api.js";
import { useAppUI } from "@/context/UIContext";
import BookingCard from "./BookingCard.jsx";
import { useAlert } from "@/core/components/feedback/Alert.jsx";
import { getCLientByNamesAPI } from "../Client/client.api.js";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog.jsx";
import BookingInvoice from "./BookingInvoice.jsx";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ActionBar from "@/core/components/layout/ActionBar.jsx";
import PaymentList from "./PaymentList.jsx";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle.ts";

const paymentTypes = ["CASH", "UPI"];
const paymentStatusTypes = ["COMPLETED", "PENDING"];

const LIMIT = 10;

const FIELD_META: FieldMeta = {
    primary: "id",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"] as const;

const Bookings = ({ ID }: { ID?: number }) => {
    const { isMobile, token, studio, currentBranch } = useAppUI();
    const dispatch = useAppDispatch();
    const showAlert = useAlert();

    const [calendarAnchor, setCalendarAnchor] = useState<HTMLButtonElement | null>(null);
    const calendarButtonRef = useRef(null);
    const [showInvoice, setShowInvoice] = useState<Booking | null>(null);
    const api = useRef<ViewsApiRef>({});
    const templates = useAppSelector((state) => state.genericTemplate.items);

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
        (paymentInit: Partial<Payment>) =>
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
                };
            }),
        [],
    );

    const beforeUpdate = useCallback(async (row: Booking) => {
        const modifiedData = { ...row };
        const clientEntry = modifiedData.clientEntry;
        if (typeof clientEntry === "object" && clientEntry !== null && "key" in clientEntry) {
            const entry = clientEntry as { key?: number; clientId?: number };
            modifiedData.clientEntry = { clientId: entry.clientId };
        }
        return modifiedData;
    }, []);

    const beforeAdd = useCallback(
        async (row: Booking): Promise<Booking> => {
            const modifiedData: Booking = { ...row };
            const clientEntry = modifiedData.clientEntry;

            if (typeof clientEntry === "object" && clientEntry !== null && "key" in clientEntry) {
                const entry = clientEntry as { key?: number };
                modifiedData.clientEntry = { clientId: entry.key };
            }

            const paymentInit: Partial<Payment> = {
                type: "BOOKING",
                actualAmount: row.totalAmount,
                amount: row.totalAmount,
                status: paymentStatusTypes[0] as paymentStatus,
                paymentType: paymentTypes[0] as paymentType,
                branchId: currentBranch.branchId,
                paymentDate: getCurrentDateTimeLocal() ?? "",
            };

            const paymentData = await awaitForDialog(paymentInit);

            if (paymentData) {
                modifiedData.paymentEntries = [
                    { ...(row.paymentEntries?.[0] ?? {}), ...(paymentData ?? {}) } as Payment,
                ];
            } else {
                throw new Error("Payment cancelled");
            }
            modifiedData.paymentStatus = "COMPLETED";
            return modifiedData;
        },
        [awaitForDialog, currentBranch.branchId],
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
                    getValue: (obj: Booking) =>
                        obj && { value: obj.value || obj.pocName, key: obj.key || obj.clientId },
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
                    name: "paymentStatus",
                    label: "Payment Status",
                    section: "Payment Details",
                    getValue: (value: unknown, row: Booking) => {
                        const dueAmount =
                            ((row.totalAmount as number) || 0) -
                            ((Array.isArray(row.paymentEntries) &&
                                (row.paymentEntries as Payment[])
                                    .filter((p) => p.status == "COMPLETED")
                                    .map((p) => p.amount as number)
                                    .reduce((a: number, b: number) => a + b, 0)) ||
                                0);
                        if (dueAmount === 0) {
                            return "COMPLETED";
                        } else if (dueAmount > 0 && dueAmount != (row.totalAmount as number)) {
                            return "PARTIALLY PAID";
                        }
                        return "PENDING";
                    },
                    extraProp: { readOnly: true },
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
                    getValue: (obj: unknown, row: Booking) =>
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
                    getValue: (obj: unknown, row: Booking) =>
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
            {!ID && (
                <ActionBar api={api} tableName={"booking"}>
                    <IconButton
                        onClick={(e) => setCalendarAnchor(e.currentTarget)}
                        sx={iconBtnFilledSx}
                        ref={calendarButtonRef}
                    >
                        <CalendarMonthIcon sx={{ padding: 0, margin: "auto" }} />
                    </IconButton>
                </ActionBar>
            )}
            <Views<Booking>
                formKey={ID}
                apiRef={api}
                tableName={"booking"}
                tableCruds={bookingCruds}
                size={LIMIT}
                beforeAdd={beforeAdd}
                beforeUpdate={beforeUpdate}
                key={"booking"}
                fields={FIELDS}
                actions={[
                    {
                        name: "Document",
                        icon: <ReceiptIcon />,
                        enabled: true,
                        sx: { color: "primary.main" },
                        onClick: (row: Booking) => {
                            setShowInvoice(row);
                        },
                    },
                ]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
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
                    initialData={pendingPaymentRef.current?.paymentInit}
                    paymentStatus={paymentStatusTypes as paymentStatus[]}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
            {showInvoice && (
                <BookingInvoice
                    open={true}
                    isUser={true}
                    studio={studio}
                    template={templates.find((t) => t.templateType === "BOOKING")}
                    currentBranch={currentBranch}
                    onClose={() => setShowInvoice(null)}
                    bookingData={showInvoice}
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Bookings;
