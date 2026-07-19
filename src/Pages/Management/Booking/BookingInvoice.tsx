import DialogContent from "@mui/material/DialogContent";
import { useRef } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { replacePlaceholders } from "../../../utils/globalFuns";
import { Typography } from "@mui/material";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { MailIcon, PrinterIcon } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";
import HtmlToPdfViewer, { HtmlToPdfViewerRef } from "@/core/components/Html2PDF/HtmlToPdfViewer";
import { Booking, Branch, GenericTemplate, Studio } from "@/api/types";

const sectionTitle = {
    marginTop: "10mm",
    marginBottom: "3mm",
    paddingBottom: "2mm",
    fontSize: "14px",
};

const tableHeaderStyle: React.CSSProperties = { textAlign: "left", padding: "6px" };
const tableCellStyle: React.CSSProperties = { padding: "6px", textAlign: "left" };

const BookingInvoice = ({
    open,
    onClose,
    bookingData,
    studio,
    currentBranch,
    isUser = false,
    template,
}: {
    open: boolean;
    onClose: () => void;
    bookingData: Booking;
    studio: Studio;
    currentBranch: Branch;
    isUser?: boolean;
    template?: GenericTemplate;
}) => {
    const pdfViewerRef = useRef<HtmlToPdfViewerRef>(null);
    const bd = bookingData;
    const ce = bd.clientEntry;

    const preparedDescription = template
        ? replacePlaceholders(String(template.templateContent), {
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
            onConfirm={() => pdfViewerRef.current!.downloadPDF()}
            cancelText="Close"
            maxWidth="md"
            actions={
                isUser
                    ? [
                          {
                              key: "send-mail",
                              tip: "Send Mail",
                              onClick: () => pdfViewerRef.current!.downloadPDF(),
                              component: <MailIcon />,
                          },
                          {
                              key: "print",
                              tip: "Print PDF",
                              onClick: () => pdfViewerRef.current!.printPDF(),
                              component: <PrinterIcon />,
                          },
                          {
                              key: "whatsapp",
                              tip: "Send WhatsApp",
                              disabled: !bd.invoiceToken,
                              onClick: () =>
                                  pdfViewerRef.current!.sendWhatsApp(ce.pocPhone as string),
                              component: <WhatsApp />,
                          },
                      ]
                    : []
            }
        >
            <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    studio={studio as { logo: string; studioName: string }}
                    fileName={`booking-invoice-${ce.clientId}`}
                    whatsAppPayload={{
                        name: ce.pocName,
                        studioName: studio.studioName,
                        invoiceToken: bd.invoiceToken,
                    }}
                    remainingPayload={{
                        title: "Booking Invoice",
                        templateName: "BOOKING_INVOICE",
                        clientIds: String(ce.clientId),
                    }}
                    footer={<p>Thank you for choosing {studio.studioName}!</p>}
                    header={
                        <>
                            <div>
                                <FlexBetween flexDirection="row-reverse">
                                    {studio.gstNumber && (
                                        <p style={{ margin: 0 }}>
                                            GSTIN: {String(studio.gstNumber)}
                                        </p>
                                    )}
                                </FlexBetween>
                                <div>
                                    <div>
                                        <strong>Invoice #</strong>: INV-{String(bd.id)}
                                    </div>
                                    <div>
                                        <strong>Invoice Date</strong>:{" "}
                                        {getLocalDateTime(String(bd.bookingDate))}
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
                                    {String(currentBranch.address)}
                                </p>
                                <p style={{ margin: 0 }}>
                                    {String(currentBranch.city)}, {String(currentBranch.state)}{" "}
                                    {String(currentBranch.pincode)}
                                </p>
                                <p style={{ margin: 0 }}>{String(currentBranch.phone)}</p>
                                <p style={{ margin: 0 }}>{String(studio.email)}</p>
                            </p>
                            <p style={{ textAlign: "right" }}>
                                <strong>Bill To</strong>:
                                <p style={{ margin: 0 }}>{String(ce.pocName)}</p>
                                <p style={{ margin: 0 }}>{String(ce.pocPhone)}</p>
                                <p style={{ margin: 0 }}>{String(ce.pocEmail)}</p>
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
                                        <td style={tableCellStyle}>{String(bd.purpose)}</td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(String(bd.startTime), "DATETIME")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(String(bd.endTime), "DATETIME")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {Number(bd.totalAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table
                                border={1}
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    marginTop: "2mm",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Amount</th>
                                        <th style={tableHeaderStyle}>Date</th>
                                        <th style={tableHeaderStyle}>Payment Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(bd.paymentEntries as Record<string, unknown>[])?.map(
                                        (paymentEntry: Record<string, unknown>) => (
                                            <tr key={String(paymentEntry?.id)}>
                                                <td style={tableCellStyle}>
                                                    {Number(paymentEntry?.amount).toFixed(2)}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {getLocalDateTime(
                                                        String(paymentEntry?.paymentDate),
                                                    )}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {String(paymentEntry?.paymentType)}
                                                </td>
                                            </tr>
                                        ),
                                    )}
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
                                            color: "error.main",
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

export default BookingInvoice;
