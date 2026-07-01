import { useAppSelector } from "@/state";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Button, Popover } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useDispatch, useSelector } from "react-redux";
import CalendarView from "./Celendar/CalendarView.jsx";
import { FIELD_TYPES } from "@/core/components/fields/FieldTypes.js";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil.js";
import Views from "@/core/crud/Views.jsx";
import PropTypes from "prop-types";
import { bookingCruds, genericTemplateCruds } from "../../../api/all.api.js";
import { useUI } from "../../../context/UIContext.jsx";
import BookingCard from "./BookingCard.jsx";
import { useAlert } from "@/core/components/feedback/Alert.jsx";
import { getCLientByNamesAPI } from "../Client/client.api.js";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog.jsx";
import BookingInvoice from "./BookingInvoice.jsx";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ActionBar from "@/core/components/layout/ActionBar.jsx";
import PaymentList from "./PaymentList.jsx";

const paymentTypes = ["CASH", "UPI"];
const paymentStatusTypes = ["COMPLETED", "PENDING"];

const LIMIT = 7;

const FIELD_META = {
    primary: "id",
    root: "branchId",
};

const VIEWS = ["LIST", "CARD"];

const Bookings = ({ ID }) => {
    const { isMobile } = useUI();
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const token = useAppSelector((state: any) => state.auth.token);
    const studio = useAppSelector((state: any) => state.auth.studio);
    const currentBranch = useAppSelector((state: any) => state.branch.currentBranch);
    const [calendarAnchor, setCalendarAnchor] = useState<HTMLButtonElement | null>(null);
    const calendarButtonRef = useRef(null);
    const [showInvoice, setShowInvoice] = useState<any>(null);
    const api = useRef({});
    const templates = useAppSelector((state: any) => state.genericTemplate.items);

    useEffect(() => {
        dispatch(
            genericTemplateCruds.getAll(
                showAlert,
                () => { },
                token,
                { searchTerm: "BOOKING" },
                studio.studioId,
                false,
            ),
        );
    }, [dispatch, showAlert, studio.studioId, token]);

    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const pendingPaymentRef = useRef<any>(null);
    const getClientsByName = useCallback(
        async (params) => {
            const { success, data, message } = await getCLientByNamesAPI({
                branchId: currentBranch?.branchId,
                token,
                params,
            });
            if (success) {
                return data?.map((c) => ({ value: c.pocName, key: c.clientId })) || [];
            } else {
                showAlert(message, "error");
                return [];
            }
        },
        [currentBranch?.branchId, showAlert, token],
    );

    const awaitForDialog = useCallback(
        (paymentInit: any) =>
            new Promise<any>((resolve) => {
                const handleSave = (data) => {
                    setOpenPaymentDialog(false);
                    resolve(data);
                };

                const handleClose = () => {
                    setOpenPaymentDialog(false);
                    resolve(null);
                };

                setOpenPaymentDialog(true);
                pendingPaymentRef.current = { onSave: handleSave, onClose: handleClose, paymentInit };
            }),
        [],
    );

    const beforeUpdate = useCallback(async (row) => {
        const modifiedData = { ...row };
        const clientEntry = modifiedData.clientEntry;
        if (Object.keys(clientEntry).includes("key")) {
            modifiedData.clientEntry = { clientId: clientEntry.key };
        }
        return modifiedData;
    }, []);

    const beforeAdd = useCallback(
        async (row: any) => {
            const modifiedData = { ...row };
            delete modifiedData.dueAmount;
            delete modifiedData.paidAmount;
            const clientEntry = modifiedData.clientEntry;

            if (Object.keys(clientEntry).includes("key")) {
                modifiedData.clientEntry = { clientId: clientEntry.key };
            }

            const paymentInit = {
                type: "BOOKING",
                actualAmount: row.totalAmount,
                amount: row.totalAmount,
                status: paymentStatusTypes[0],
                paymentType: paymentTypes[0],
                branchId: currentBranch?.branchId,
                paymentDate: getCurrentDateTimeLocal(),
            };

            const paymentData = await awaitForDialog(paymentInit);

            if (paymentData) {
                modifiedData.paymentEntries = [{ ...(row.paymentEntry || {}), ...(paymentData || {}) }];
            } else {
                throw new Error("Payment cancelled");
            }
            modifiedData.paymentStatus = paymentStatusTypes[0];
            return modifiedData;
        },
        [awaitForDialog, currentBranch?.branchId],
    );

    const FIELDS = useMemo(
        () => [
            { show: true, section: "Booking Details", name: "purpose", label: "Purpose" },
            {
                show: true,
                section: "Booking Details",
                name: "clientEntry",
                label: "Poc Name",
                type: "SELECT",
                getValue: (obj, row) =>
                    obj && { value: obj.value || obj.pocName, key: obj.key || obj.clientId },
                extraProp: {
                    addValue: false,
                    saveType: "object",
                    getOptions: (searchTerm = "", page, size) =>
                        getClientsByName({ clientName: searchTerm, page, size }),
                },
            },
            {
                show: true,
                section: "Payment Details",
                name: "totalAmount",
                label: "Total Amount",
                type: FIELD_TYPES.NUMBER,
            },
            {
                show: true,
                name: "paymentStatus",
                label: "Payment Status",
                section: "Payment Details",
                getValue: (value, row) => {
                    const dueAmount =
                        (row.totalAmount || 0) -
                        ((Array.isArray(row?.paymentEntries) &&
                            row.paymentEntries
                                .filter((p) => p.status == "COMPLETED")
                                .map((p) => p.amount)
                                .reduce((a, b) => a + b, 0)) ||
                            0);
                    if (dueAmount === 0) {
                        return "COMPLETED";
                    } else if (dueAmount > 0 && dueAmount != row?.totalAmount) {
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
                type: FIELD_TYPES.NUMBER,
                extraProp: { readOnly: true },
                getValue: (obj, row) =>
                    (Array.isArray(row?.paymentEntries) &&
                        row.paymentEntries
                            .filter((p) => p.status == "COMPLETED")
                            .map((p) => p.amount)
                            .reduce((a, b) => a + b, 0)) ||
                    0,
            },
            {
                show: false,
                name: "dueAmount",
                label: "Due Amount",
                section: "Payment Details",
                type: FIELD_TYPES.NUMBER,
                extraProp: { readOnly: true },
                getValue: (obj, row) =>
                    (row.totalAmount || 0) -
                    ((Array.isArray(row?.paymentEntries) &&
                        row.paymentEntries
                            .filter((p) => p.status == "COMPLETED")
                            .map((p) => p.amount)
                            .reduce((a, b) => a + b, 0)) ||
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
        ],
        [getClientsByName],
    );

    return (
        <FlexBetweenColumn>
            {!ID && (
                <ActionBar api={api} tableName={"booking"}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => setCalendarAnchor(e.currentTarget)}
                        sx={{ fontWeight: "bold", padding: "1px" }}
                        ref={calendarButtonRef}
                    >
                        <CalendarMonthIcon sx={{ padding: 0, margin: "auto" }} />
                    </Button>
                </ActionBar>
            )}
            <Views
                formKey={ID}
                apiRef={api}
                tableName={"booking"}
                tableCruds={bookingCruds}
                size={LIMIT}
                beforeAdd={beforeAdd}
                beforeUpdate={beforeUpdate}
                key={"booking"}
                fields={FIELDS as any}
                actions={[
                    {
                        name: "Document",
                        icon: <ReceiptIcon />,
                        enabled: true,
                        sx: { color: "blue" },
                        onClick: (row) => {
                            setShowInvoice(row);
                        },
                    },
                ]}
                rootId={currentBranch?.branchId}
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
                    paymentStatus={paymentStatusTypes.map((ps) => ({ label: ps, value: ps }))}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
            {showInvoice && (
                <BookingInvoice
                    open={true}
                    isUser={true}
                    studio={studio}
                    template={templates?.find((t) => t.templateType === "BOOKING")}
                    currentBranch={currentBranch}
                    onClose={() => setShowInvoice(false)}
                    bookingData={showInvoice}
                />
            )}
        </FlexBetweenColumn>
    );
};

Bookings.propTypes = {
    ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Bookings;
