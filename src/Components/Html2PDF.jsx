import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Divider, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useSelector } from "react-redux";
import FlexEvenly from "./FlexEvenly";
import Loading from "./Loading/Loading";
import { useAlert } from "../utils/Alert";
import { generatePresignUrl } from "../api/s3.api";
import { sendMessageApi } from "../Pages/Management/Communication/communication.api";

const HtmlToPdfViewer = forwardRef(({ content, header, fileName = "document", footer, remainingPayload }, ref) => {
    const showAlert = useAlert();
    const contentRef = useRef();
    const token = useSelector((state) => state.auth.token);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false)

    const pdfOptions = {
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    const handleDownloadPDF = () => {
        if (contentRef.current) {
            window.html2pdf().set(pdfOptions).from(contentRef.current).save();
        }
    };

    const handlePrintPDF = () => {
        if (contentRef.current) {
            window.html2pdf()
                .set(pdfOptions)
                .from(contentRef.current)
                .toPdf()
                .get("pdf")
                .then((pdf) => {
                    const blob = pdf.output("blob");
                    const blobUrl = URL.createObjectURL(blob);

                    const printWindow = window.open(blobUrl, "_blank");
                    printWindow.onload = function () {
                        printWindow.focus();
                        printWindow.print();
                    };
                });
        }
    };



    const handleSendMail = async () => {
        try {
            setLoading(true);
            const element = contentRef.current;
            const pdfBlob = await window.html2pdf()
                .set(pdfOptions)
                .from(element)
                .outputPdf('blob');

            const { data: s3Bucket, success } = await generatePresignUrl(
                `${fileName}.pdf`,
                token
            );

            if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
                showAlert('Failed to get upload URL', 'error');
                return;
            }
            showAlert('Preparing to upload invoice...', 'info');

            const uploadResponse = await fetch(s3Bucket.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/pdf' },
                body: pdfBlob,
            });

            if (!uploadResponse.ok) {
                showAlert('Failed to upload invoice to S3', 'error');
                throw new Error('Upload to S3 failed');
            }
            showAlert('Invoice uploaded successfully', 'success');

            const payload = {
                branchId: currentBranch.branchId,
                studioId: studio.studioId,
                invoiceUrl: s3Bucket.fileUrl,
                notificationType: 'EMAIL',
                ...remainingPayload
            };

            showAlert('Sending email...', 'info');
            const { success: emailSent, message } = await sendMessageApi({
                token,
                data: payload,
            });
            if (emailSent) {
                showAlert(message || 'Mail sent successfully', 'success');
            } else {
                showAlert('Failed to send email', 'error');
            }
        } catch (error) {
            console.error(error);
            showAlert('Something went wrong, please try again later', 'error');
        } finally {
            setLoading(false);
        }
    };
    useImperativeHandle(ref, () => ({
        downloadPDF: handleDownloadPDF,
        printPDF: handlePrintPDF,
        sendMail: handleSendMail,
    }));

    return (
        <Box>{loading && <Loading />}
            <FlexBetween flexDirection={"column"}
                ref={contentRef}
                sx={{
                    width: "210mm",
                    minHeight: "295mm",
                    margin: "auto",
                    padding: "24px",
                    backgroundColor: "#fff",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    color: "#333",
                    borderRadius: "8px",
                    boxSizing: "border-box",

                    // Page-break handling
                    "@media print": {
                        ".page-break": {
                            pageBreakAfter: "always"
                        },
                        div: {
                            pageBreakInside: "avoid"
                        }
                    }
                }}
            >
                <Box>
                    <FlexBetween>
                        <Box>
                            <FlexBetween gap={1}>
                                {studio?.logo && (
                                    <img
                                        src={studio.logo}
                                        alt="Studio Logo"
                                        style={{ width: 100, height: 100, margin: "auto" }}
                                        crossOrigin="anonymous"
                                    />
                                )}
                                <Typography variant="h5" sx={{ my: "auto", textWrap: "wrap" }}>
                                    {studio?.studioName}
                                </Typography>
                            </FlexBetween>
                        </Box>
                        <Box flexGrow={1} textAlign="right">
                            {header}
                        </Box>
                    </FlexBetween>
                    <Divider sx={{ my: 2 }} />
                    {content}
                </Box>
                <FlexEvenly>
                    <Box>
                        <Typography textAlign={"center"} style={{ marginTop: '5mm', fontSize: '10px', color: '#555' }}>
                            {footer}
                            <p>Powered by Book & Manage</p>
                        </Typography>
                    </Box>
                </FlexEvenly>
            </FlexBetween>
        </Box>
    );
});

HtmlToPdfViewer.displayName = "HtmlToPdfViewer";

HtmlToPdfViewer.propTypes = {
    content: PropTypes.node.isRequired,
    header: PropTypes.node,
    fileName: PropTypes.string,
    remainingPayload: PropTypes.object,
    footer: PropTypes.node,
};

export default HtmlToPdfViewer;
