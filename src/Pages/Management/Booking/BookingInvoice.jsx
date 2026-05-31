import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import { getLocalDateTime } from "../../../utils/DateUtil";
import FlexBetween from "../../../Components/FlexBetween";
import { getAllTemplatesAPI } from "../TemplatesPage/Template.api";
import { replacePlaceholders } from "../../../utils/globalFuns";
import { Typography } from "@mui/material";
import StyledDialog from "../../../Components/New/StyledDialog";
import { MailIcon, PrinterIcon } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";
import HtmlToPdfViewer from "../../../Components/New/Html2PDF/HtmlToPdfViewer";

const sectionTitle = {
    marginTop: "10mm",
    marginBottom: "3mm",
    paddingBottom: "2mm",
    fontSize: "14px",
};

const tableHeaderStyle = { textAlign: "left", padding: "6px" };
const tableCellStyle = { padding: "6px" };

const BookingInvoice = ({ open, onClose, bookingData }) => {
    const pdfViewerRef = useRef();
    const studio = useSelector((state) => state.auth.studio);
    const token = useSelector((state) => state.auth.token);
    const showAlert = useAlert();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await getAllTemplatesAPI({
                    studioId: studio.studioId,
                    token,
                    templateType: "BOOKING",
                });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || "Failed to load templates", "error");
                }
            } catch {
                showAlert("Error loading templates", "error");
            } finally {
                setLoading(false);
            }
        };
        if (open) fetchTemplates();
    }, [open, showAlert, studio.studioId, token]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find((t) =>
                t.templateType?.toLowerCase().includes("booking"),
            );
            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id);
            }
        }
    }, [templates, selectedTemplateId]);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent, {
            studio,
            branch: currentBranch,
            getLocalDateTime,
        })
        : "";

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            confirmText="Download"
            onConfirm={() => pdfViewerRef.current.downloadPDF()}
            cancelText="Close"
            maxWidth="md"
            actions={[
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
                    onClick: () =>
                        pdfViewerRef.current.sendWhatsApp(bookingData?.clientEntry?.pocPhone),
                    component: <WhatsApp />,
                },
            ]}
        >
            <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                {loading && <Loading />}
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    studio={studio}
                    fileName={`booking-invoice-${bookingData?.clientEntry?.clientId}`}
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
