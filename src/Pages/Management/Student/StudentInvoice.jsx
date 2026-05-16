import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { useUI } from "../../../context/UIContext";
import StyledDialog from "../../../Components/New/StyledDialog";
import { MailIcon, PrinterIcon } from "lucide-react";
import { Download, WhatsApp } from "@mui/icons-material";
import HtmlToPdfViewer from "../../../Components/New/Html2PDF/HtmlToPdfViewer";

const StudentInvoice = ({ open, onClose, activityData }) => {
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const pdfViewerRef = useRef();
    const { isBatchEnabled } = useUI();
    const studio = useSelector((state) => state.auth.studio);

    const tableState = useSelector((state) => state["students"]);

    const [studentData, setStudentData] = useState();

    useEffect(() => {
        !studentData && setStudentData(tableState.recordById[activityData.studentId] || {});
    }, [activityData.studentId, studentData, tableState.recordById]);

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            confirmText={<Download />}
            onConfirm={() => pdfViewerRef.current.downloadPDF()}
            actions={[
                {
                    key: "email",
                    tip: "E-mail",
                    onClick: () => pdfViewerRef.current.sendMail(studentData?.email),
                    component: <MailIcon />,
                },
                {
                    key: "whatsapp",
                    tip: "WhatsApp",
                    onClick: () => pdfViewerRef.current.sendWhatsApp(studentData?.phone),
                    component: <WhatsApp />,
                },
                {
                    key: "print",
                    tip: "Print",
                    onClick: () => pdfViewerRef.current.printPDF(),
                    component: <PrinterIcon />,
                },
            ]}
        >
            <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    fileName={`student-invoice-${studentData?.studentId}`}
                    remainingPayload={{
                        title: "Invoice",
                        templateName: "MEMBERSHIP_INVOICE",
                        activityType: activityData?.activityName,
                        memberIds: [studentData?.studentId],
                    }}
                    footer={<p>Thank you for choosing {studio?.studioName}!</p>}
                    header={
                        <>
                            <div>
                                <h2>INVOICE</h2>
                                <div>
                                    <strong>Invoice #</strong>: INV-
                                    {activityData?.paymentEntry?.id}
                                </div>
                                <div>
                                    <strong>Invoice Date</strong>:{" "}
                                    {getLocalDateTime(activityData?.registrationDate) || "-"}
                                </div>
                            </div>
                        </>
                    }
                    content={
                        <div
                            style={{
                                display: "flex",
                                height: "100%",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                {/* Invoice Details */}
                                <p
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "2mm",
                                    }}
                                >
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
                                        {studio?.gstNumber && (
                                            <p style={{ margin: 0 }}>GSTIN: {studio.gstNumber}</p>
                                        )}
                                    </p>
                                    <p style={{ textAlign: "right" }}>
                                        <div>
                                            <strong>Bill To</strong>:
                                        </div>
                                        <div>{studentData?.name}</div>
                                        <div>{studentData?.phone}</div>
                                        <div>{studentData?.email}</div>
                                    </p>
                                </p>
                                {/* Table */}
                                <table
                                    border={1}
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        margin: "5mm 0",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={tableHeaderStyle}>Activity</th>
                                            <th style={tableHeaderStyle}>Plan</th>
                                            <th style={tableHeaderStyle}>Start Date</th>
                                            <th style={tableHeaderStyle}>End Date</th>
                                            {!isBatchEnabled && (
                                                <th style={tableHeaderStyle}>Days Per Week</th>
                                            )}
                                            <th style={tableHeaderStyle}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={tableCellStyle}>
                                                {activityData?.activityName}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {activityData?.membershipType}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {getLocalDateTime(
                                                    activityData?.membershipStartDate,
                                                )}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {getLocalDateTime(activityData?.membershipEndDate)}
                                            </td>
                                            {!isBatchEnabled && (
                                                <td style={tableCellStyle}>
                                                    {activityData?.daysPerWeek || "-"}
                                                </td>
                                            )}
                                            <td style={tableCellStyle}>
                                                {activityData?.activityAmount?.toFixed(2) || "0.00"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {isBatchEnabled && (
                                    <>
                                        Batch details:
                                        <table
                                            border={1}
                                            style={{ width: "100%", borderCollapse: "collapse" }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th style={tableHeaderStyle}>Batch Name</th>
                                                    <th style={tableHeaderStyle}>Days Per Week</th>
                                                    <th style={tableHeaderStyle}>Batch Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={tableCellStyle}>
                                                        {activityData?.batchName || "-"}
                                                    </td>
                                                    <td style={tableCellStyle}>
                                                        {activityData?.daysPerWeek || "-"}
                                                    </td>
                                                    <td style={tableCellStyle}>
                                                        {activityData?.batchTime || "-"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {/* Subtotal & Total */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        textAlign: "right",
                                        marginTop: "10mm",
                                        fontSize: "14px",
                                        paddingRight: "5px",
                                    }}
                                >
                                    <table
                                        border={1}
                                        style={{
                                            width: "35%",
                                            borderCollapse: "collapse",
                                            border: "1px solid #000",
                                        }}
                                    >
                                        <tbody>
                                            {/* GST calculation */}
                                            {(() => {
                                                const total = Number(
                                                    activityData?.activityAmount || 0,
                                                );
                                                const gstRate = 0.18;
                                                const baseAmount = total / (1 + gstRate);
                                                const gst = total - baseAmount;

                                                return (
                                                    <>
                                                        {studio?.gstNumber && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            textAlign: "left",
                                                                            padding: "2px 5px",
                                                                        }}
                                                                    >
                                                                        Base Amount
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign: "right",
                                                                            padding: "2px 5px",
                                                                        }}
                                                                    >
                                                                        {baseAmount.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            textAlign: "left",
                                                                            padding: "2px 5px",
                                                                        }}
                                                                    >
                                                                        GST (18%)
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign: "right",
                                                                            padding: "2px 5px",
                                                                        }}
                                                                    >
                                                                        {gst.toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    textAlign: "left",
                                                                    padding: "2px 5px",
                                                                }}
                                                            >
                                                                Discount
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign: "right",
                                                                    padding: "2px 5px",
                                                                }}
                                                            >
                                                                {Math.abs(
                                                                    (
                                                                        Number(
                                                                            activityData
                                                                                ?.paymentEntry
                                                                                ?.amount || 0,
                                                                        ) -
                                                                        Number(
                                                                            activityData?.activityAmount ||
                                                                                0,
                                                                        )
                                                                    ).toFixed(2),
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    textAlign: "left",
                                                                    padding: "2px 5px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Total
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign: "right",
                                                                    padding: "2px 5px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {Number(
                                                                    activityData?.paymentEntry
                                                                        ?.amount || 0,
                                                                ).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style={{ flexGrow: 1 }}></div>
                        </div>
                    }
                />
            </DialogContent>
        </StyledDialog>
    );
};

const tableHeaderStyle = {
    textAlign: "left",
    padding: "8px",
};

const tableCellStyle = {
    padding: "8px",
};

StudentInvoice.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    activityData: PropTypes.shape({
        studentId: PropTypes.number,
        activity: PropTypes.object,
        activityName: PropTypes.string.isRequired,
        activityAmount: PropTypes.number,
        membershipType: PropTypes.string,
        batchName: PropTypes.string,
        batchTime: PropTypes.string,
        daysPerWeek: PropTypes.number,
        registrationDate: PropTypes.string,
        membershipStartDate: PropTypes.string,
        membershipEndDate: PropTypes.string,
        membershipStatus: PropTypes.string,
        paymentEntry: PropTypes.shape({
            amount: PropTypes.number,
            paymentDate: PropTypes.string,
            status: PropTypes.string,
            registrationFee: PropTypes.number,
            totalBeforeTax: PropTypes.number,
            totalAmount: PropTypes.number,
            invoiceId: PropTypes.string,
        }),
    }),
};

export default StudentInvoice;
