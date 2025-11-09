import { useState, useRef, useMemo, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Button, Popover } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CalendarView from "./Celendar/CalendarView.jsx";
import { FIELD_TYPES } from "../../../Components/Fields/FieldTypes.js";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil.js";
import { usePageSearch } from "../../../hooks/useSearch.js";
import Views from "../../../Components/Views/Views.jsx";
import PropTypes from "prop-types";
import { bookingCruds } from "../../../api/all.api.js";
import { useUI } from "../../../context/UIContext.jsx";
import BookingCard from "./BookingCard.jsx";
import { useAlert } from "../../../utils/Alert.jsx";
import { getCLientByNamesAPI } from "../Client/client.api.js";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog.jsx";
import BookingInvoice from "./BookingInvoice.jsx";
import ReceiptIcon from "@mui/icons-material/Receipt";

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
    const navigate = useNavigate();
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [calendarAnchor, setCalendarAnchor] = useState(null);
    const calendarButtonRef = useRef(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const { triggerSearch } = usePageSearch();

    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const getClientsByName = useCallback(
        async (params) => {
            const { success, data, message } = await getCLientByNamesAPI({
                token,
                params,
            });
            if (success) {
                return data?.map((c) => ({ value: c.pocName, key: c.clientId })) || [];
            } else {
                showAlert(message, "error");
            }
        },
        [showAlert, token],
    );

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

    const beforeUpdate = useCallback(async (row) => {
        const modifiedData = { ...row };
        const clientEntry = modifiedData.clientEntry;
        if (Object.keys(clientEntry).includes("key")) {
            modifiedData.clientEntry = { clientId: clientEntry.key };
        }
        return modifiedData;
    }, []);

    const beforeAdd = useCallback(
        async (row) => {
            const modifiedData = { ...row };

            const paymentInit = {
                actualAmount: 0,
                amount: 0,
                status: paymentStatusTypes[0],
                paymentType: paymentTypes[0],
            };

            const paymentData = await awaitForDialog(paymentInit);

            if (paymentData) {
                modifiedData.paymentEntry = { ...row.paymentEntry, ...paymentData };
            } else {
                return null;
            }
            return modifiedData;
        },
        [awaitForDialog],
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
                type: "SELECT",
                getValue: (value) => value && { value, key: value },
                defaultValue: paymentStatusTypes[0],
                extraProp: {
                    addValue: false,
                    getOptions: (s, p, l) =>
                        paymentStatusTypes.map((value) => ({ value, key: value })),
                },
            },
            {
                show: true,
                name: "bookingDate",
                label: "Booking Date",
                section: "Booking Details",
                type: "DATETIME",
                defaultValue: getCurrentDateTimeUTC(),
            },
            {
                show: false,
                name: "advanceAmount",
                label: "Advance Amount",
                section: "Advance Payment Details",
                type: FIELD_TYPES.NUMBER,
                defaultValue: 0,
            },
            {
                show: true,
                section: "Booking Details",
                name: "startTime",
                label: "Start Time",
                type: "DATETIME",
            },
            {
                show: true,
                section: "Booking Details",
                name: "endTime",
                label: "End Time",
                type: "DATETIME",
            },
            {
                show: false,
                name: "advanceDate",
                section: "Advance Payment Details",
                label: "Advance Date",
            },
            {
                show: false,
                name: "advanceMode",
                label: "Advance Mode",
                section: "Advance Payment Details",
                type: "SELECT",
                defaultValue: paymentTypes[0],
                getValue: (value) => value && { value, key: value },
                extraProp: {
                    addValue: false,
                    getOptions: (s, p, l) => paymentTypes.map((value) => ({ value, key: value })),
                },
            },
            {
                show: false,
                name: "paymentMode",
                label: "Payment Mode",
                section: "Payment Details",
                type: "SELECT",
                addValue: false,
                defaultValue: paymentTypes[0],
                getValue: (value) => value && { value, key: value },
                extraProp: {
                    getOptions: (s, p, l) => paymentTypes.map((value) => ({ value, key: value })),
                },
            },
            {
                show: false,
                name: "finalPaymentDate",
                section: "Payment Details",
                label: "Final Payment Date",
                type: "DATETIME",
            },
            {
                show: false,
                name: "balanceAmount",
                section: "Payment Details",
                label: "Balance Amount",
                type: FIELD_TYPES.NUMBER,
                defaultValue: 0,
            },
            { show: false, section: "Booking Details", name: "notes", label: "Notes" },
        ],
        [getClientsByName],
    );
    const [addNewFunc, setAddNewFunc] = useState(null);

    return (
        <FlexBetweenColumn>
            {!ID && (
                <FlexBetween paddingBottom={2} gap={1}>
                    <SearchField handleSearch={triggerSearch} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => setCalendarAnchor(e.currentTarget)}
                        sx={{ fontWeight: "bold", padding: "1px" }}
                        ref={calendarButtonRef}
                    >
                        <CalendarMonthIcon sx={{ padding: 0, margin: "auto" }} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            addNewFunc();
                            navigate("/management/booking/NEW");
                        }}
                        sx={{ fontWeight: "bold", padding: ".8rem" }}
                    >
                        <AddIcon sx={{ padding: 0, margin: "auto" }} />
                    </Button>
                </FlexBetween>
            )}
            <Views
                formKey={ID}
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
                        sx: { color: "blue" },
                        onClick: (row) => {
                            setShowInvoice(row);
                        },
                    },
                ]}
                rootId={currentBranch.branchId}
                fieldsMeta={FIELD_META}
                currentView={VIEWS[!isMobile ? 0 : 1]}
                fieldToDisplayOnDelete="purpose"
                onSetAddNewFunc={setAddNewFunc}
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
                    onSave={(data) => openPaymentDialog?.onSave?.(data)}
                    onClose={() => openPaymentDialog?.onClose?.()}
                    initialData={openPaymentDialog.paymentInit}
                    paymentStatus={paymentStatusTypes.map((ps) => ({ label: ps, value: ps }))}
                    paymentType={paymentTypes.map((pt) => ({ label: pt, value: pt }))}
                />
            )}
            {showInvoice && (
                <BookingInvoice
                    open={true}
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
