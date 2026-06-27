import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { useRef } from "react";
import { getLocalDateTime } from "../../../utils/DateUtil";
import FlexBetween from "../../../Components/FlexBetween";
import { replacePlaceholders } from "../../../utils/globalFuns";
import { Typography } from "@mui/material";
import StyledDialog from "../../../core/components/StyledDialog";
import { MailIcon, PrinterIcon } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";
import HtmlToPdfViewer from "../../../core/components/Html2PDF/HtmlToPdfViewer";

const sectionTitle = {
    marginTop: "10mm",
    marginBottom: "3mm",
    paddingBottom: "2mm",
    fontSize: "14px",
};

const tableHeaderStyle = { textAlign: "left", padding: "6px" };
const tableCellStyle = { padding: "6px", textAlign: "left" };

const BookingInvoice = ({ open, onClose, bookingData, studio, currentBranch, isUser = false, template }) => {
    const pdfViewerRef = useRef();

    const preparedDescription = template
        ? replacePlaceholders(template.templateContent, {
            studio,
            branch: currentBranch,
            getLocalDateTime,
        })
        : "";
    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            fullScreen={!isUser}
            confirmText="Download"
            onConfirm={() => pdfViewerRef.current.downloadPDF()}
            cancelText="Close"
            maxWidth="md"
            actions={isUser ? [
                {
                    key: "send-mail",
                    tip: "Send Mail",
                    onClick: () => pdfViewerRef.current.downloadPDF(),
                    component: <MailIcon />,
                },
                {
                    key: "print",
                    tip: "Print PDF",
                    onClick: () => pdfViewerRef.current.printPDF(),
                    component: <PrinterIcon />,
                },
                {
                    key: "whatsapp",
                    tip: "Send WhatsApp",
                    disabled: !bookingData?.invoiceToken,
                    onClick: () =>
                        pdfViewerRef.current.sendWhatsApp(bookingData?.clientEntry?.pocPhone),
                    component: <WhatsApp />,
                },
            ] : []}
        >
            <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    studio={studio}
                    fileName={`booking-invoice-${bookingData?.clientEntry?.clientId}`}
                    whatsAppPayload={{
                        name: bookingData?.clientEntry?.pocName,
                        studioName: studio?.studioName,
                        invoiceToken: bookingData?.invoiceToken,
                    }}
                    remainingPayload={{
                        title: "Booking Invoice",
                        templateName: "BOOKING_INVOICE",
                        clientIds: [bookingData?.clientEntry?.clientId],
                    }}
                    footer={<p>Thank you for choosing {studio?.studioName}!</p>}
                    header={
                        <>
                            <div>
                                <FlexBetween flexDirection="row-reverse">
                                    {studio?.gstNumber && (
                                        <p style={{ margin: 0 }}>GSTIN: {studio.gstNumber}</p>
                                    )}
                                </FlexBetween>
                                <div>
                                    <div>
                                        <strong>Invoice #</strong>: INV-{bookingData?.id}
                                    </div>
                                    <div>
                                        <strong>Invoice Date</strong>:{" "}
                                        {getLocalDateTime(bookingData?.bookingDate)}
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    content={
                        <>
                            {/* Invoice Info */}
                            <p>
                                <p style={{ margin: 0, textWrap: "wrap" }}>
                                    {currentBranch?.address}
                                </p>
                                <p style={{ margin: 0 }}>
                                    {currentBranch?.city}, {currentBranch?.state}{" "}
                                    {currentBranch?.pincode}
                                </p>
                                <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                                <p style={{ margin: 0 }}>{studio?.email}</p>
                            </p>
                            <p style={{ textAlign: "right" }}>
                                <strong>Bill To</strong>:
                                <p style={{ margin: 0 }}>{bookingData?.clientEntry?.pocName}</p>
                                <p style={{ margin: 0 }}>{bookingData?.clientEntry?.pocPhone}</p>
                                <p style={{ margin: 0 }}>{bookingData?.clientEntry?.pocEmail}</p>
                            </p>

                            {/* Booking Table */}
                            <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Purpose</th>
                                        <th style={tableHeaderStyle}>Start Time</th>
                                        <th style={tableHeaderStyle}>End Time</th>
                                        <th style={tableHeaderStyle}>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={tableCellStyle}>{bookingData?.purpose}</td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(bookingData?.startTime, "DATETIME")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(bookingData?.endTime, "DATETIME")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {bookingData?.totalAmount?.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table
                                border={1}
                                style={{ width: "100%", borderCollapse: "collapse", marginTop: "2mm" }}
                            >
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Amount</th>
                                        <th style={tableHeaderStyle}>Date</th>
                                        <th style={tableHeaderStyle}>Payment Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData?.paymentEntries?.map((paymentEntry) => {
                                        return <tr key={paymentEntry?.id}>
                                            <td style={tableCellStyle}>
                                                {paymentEntry?.amount?.toFixed(2)}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {getLocalDateTime(
                                                    paymentEntry?.paymentDate,
                                                )}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {paymentEntry?.paymentType}
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>

                            <div style={sectionTitle}>
                                <h3>Terms and Conditions</h3>
                                {preparedDescription ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textAlign: "justify",
                                            whiteSpace: "pre-wrap",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: preparedDescription.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "red",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: "20px",
                                        }}
                                    >
                                        No Contract Template Created.
                                    </Typography>
                                )}
                            </div>
                        </>
                    }
                />
            </DialogContent>
        </StyledDialog>
    );
};

BookingInvoice.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    bookingData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        branchId: PropTypes.number.isRequired,
        purpose: PropTypes.string.isRequired,
        totalAmount: PropTypes.number.isRequired,
        bookingDate: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        notes: PropTypes.string,
        clientEntry: PropTypes.shape({
            clientId: PropTypes.number,
            pocName: PropTypes.string,
            pocPhone: PropTypes.string,
            pocEmail: PropTypes.string,
            groupName: PropTypes.string,
            clientType: PropTypes.string,
        }),
        paymentEntry: PropTypes.shape({
            amount: PropTypes.number,
            paymentDate: PropTypes.string,
            paymentMode: PropTypes.string,
        }),
    }).isRequired,
};

export default BookingInvoice;
