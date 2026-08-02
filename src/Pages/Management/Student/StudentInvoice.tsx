import React, { useRef } from "react";
import DialogContent from "@mui/material/DialogContent";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { useAppUI } from "@/context/UIContext";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { MailIcon, PrinterIcon } from "lucide-react";
import { Download, WhatsApp } from "@mui/icons-material";
import HtmlToPdfViewer, { HtmlToPdfViewerRef } from "@/core/components/Html2PDF/HtmlToPdfViewer";
import { Branch, Student, StudentAssignment, Studio } from "@/api/types";

interface StudentInvoiceProps {
    open: boolean;
    onClose: () => void;
    studentData: Student;
    activityData: StudentAssignment;
    studio: Studio;
    currentBranch: Branch;
    isUser?: boolean;
}

const StudentInvoice: React.FC<StudentInvoiceProps> = ({
    open,
    onClose,
    activityData,
    studentData,
    studio,
    currentBranch,
    isUser = false,
}) => {
    const pdfViewerRef = useRef<HtmlToPdfViewerRef | null>(null);
    const { permissions } = useAppUI();
    const discount = (
        Number(activityData.paymentEntry.amount || 0) - Number(activityData.activityAmount || 0)
    ).toFixed(2);

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullScreen={!isUser}
            confirmText={<Download />}
            onConfirm={() => pdfViewerRef.current?.downloadPDF()}
            actions={
                isUser
                    ? [
                          {
                              key: "email",
                              tip: "E-mail",
                              onClick: () => pdfViewerRef.current?.sendMail(studentData.email),
                              component: <MailIcon />,
                          },
                          {
                              key: "whatsapp",
                              disabled: !activityData.invoiceToken,
                              tip: "WhatsApp",
                              onClick: () =>
                                  pdfViewerRef.current?.sendWhatsApp(
                                      String(studentData.phone ?? ""),
                                  ),
                              component: <WhatsApp />,
                          },
                          {
                              key: "print",
                              tip: "Print",
                              onClick: () => pdfViewerRef.current?.printPDF(),
                              component: <PrinterIcon />,
                          },
                      ]
                    : []
            }
        >
            <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    studio={studio as { logo: string; studioName: string }}
                    fileName={`student-invoice-${studentData.name.replace(/ /g, "-")}-${String(activityData.activityName ?? "").replace(/ /g, "-")}`}
                    remainingPayload={{
                        title: "Invoice",
                        templateName: "MEMBERSHIP_INVOICE",
                        activityType: String(activityData.activityName ?? ""),
                        memberIds: [Number(studentData.studentId)],
                    }}
                    whatsAppPayload={{
                        name: studentData.name,
                        studioName: studio.studioName,
                        invoiceToken: String(activityData.invoiceToken ?? ""),
                    }}
                    footer={<p>Thank you for choosing {String(studio.studioName)}!</p>}
                    header={
                        <>
                            <div>
                                <h2>INVOICE</h2>
                                <div>
                                    <strong>Invoice #</strong>: INV-
                                    {activityData.paymentEntry.id ?? ""}
                                </div>
                                <div>
                                    <strong>Invoice Date</strong>:{" "}
                                    {getLocalDateTime(
                                        String(activityData.registrationDate ?? null),
                                    ) || "-"}
                                </div>
                            </div>
                        </>
                    }
                    content={
                        <>
                            {/* Invoice Details */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "2mm",
                                }}
                            >
                                <div>
                                    <p style={{ margin: 0, textWrap: "wrap" }}>
                                        {String(currentBranch.address ?? "")}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        {String(currentBranch.city ?? "")},{" "}
                                        {String(currentBranch.state ?? "")}{" "}
                                        {String(currentBranch.pincode ?? "")}
                                    </p>
                                    <p style={{ margin: 0 }}>{String(currentBranch.phone ?? "")}</p>
                                    <p style={{ margin: 0 }}>{String(studio.email ?? "")}</p>
                                    {String(studio.gstNumber ?? "") && (
                                        <p style={{ margin: 0 }}>
                                            GSTIN: {String(studio.gstNumber)}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div>
                                        <strong>Bill To</strong>:
                                    </div>
                                    <div>{String(studentData.name)}</div>
                                    <div>{String(studentData.phone ?? "")}</div>
                                    <div>{String(studentData.email ?? "")}</div>
                                </div>
                            </div>
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
                                        {!permissions.BATCH && (
                                            <th style={tableHeaderStyle}>Days Per Week</th>
                                        )}
                                        <th style={tableHeaderStyle}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={tableCellStyle}>
                                            {String(activityData.activityName ?? "")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {String(activityData.membershipType ?? "")}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(
                                                String(activityData.membershipStartDate ?? null),
                                            )}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(
                                                String(activityData.membershipEndDate ?? null),
                                            )}
                                        </td>
                                        {!permissions.BATCH && (
                                            <td style={tableCellStyle}>
                                                {String(activityData.daysPerWeek ?? "") || "-"}
                                            </td>
                                        )}
                                        <td style={tableCellStyle}>
                                            {Number(activityData.activityAmount ?? 0).toFixed(2) ||
                                                "0.00"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {permissions.BATCH && (
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
                                                    {String(activityData.batchName ?? "") || "-"}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {String(activityData.daysPerWeek ?? "") || "-"}
                                                </td>
                                                <td style={tableCellStyle}>
                                                    {String(activityData.batchTime ?? "") || "-"}
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
                                            const total = Number(activityData.activityAmount || 0);
                                            const gstRate = 0.18;
                                            const baseAmount = total / (1 + gstRate);
                                            const gst = total - baseAmount;

                                            return (
                                                <>
                                                    {studio.gstNumber && (
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
                                                            Discount / Other
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign: "right",
                                                                padding: "2px 5px",
                                                            }}
                                                        >
                                                            {discount}
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
                                                                activityData.paymentEntry.amount ||
                                                                    0,
                                                            ).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    }
                />
            </DialogContent>
        </StyledDialog>
    );
};

const tableHeaderStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "8px",
};

const tableCellStyle: React.CSSProperties = {
    padding: "8px",
    textAlign: "left",
};

export default StudentInvoice;
