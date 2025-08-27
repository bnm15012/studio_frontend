import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Card,
    Divider,
    Typography,
    styled
} from '@mui/material';
import FlexBetween from "./FlexBetween";
import { useSelector } from "react-redux";
import FlexEvenly from "./FlexEvenly";
import Loading from "./Loading/Loading";
import { useAlert } from "../utils/Alert";
import { generatePresignUrl } from "../api/s3.api";
import { sendMessageApi } from "../Pages/Management/Communication/communication.api";


const PdfContainer = styled(Card)(() => ({
    width: '210mm',
    height: '297mm',
    overflow: "auto",
    margin: '0 auto',
    padding: "24px",
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    color: '#333',
    boxSizing: 'border-box',
    border: '1px solid hsl(220, 13%, 85%)',

    // Page-break handling for PDF generation
    '& .page-break': {
        pageBreakAfter: 'always'
    },

    '& .pdf-table': {
        width: '100%',
        borderCollapse: 'collapse',
        pageBreakInside: 'auto',

        '& th, & td': {
            border: '1px solid hsl(220, 13%, 85%)',
            padding: '8px 12px',
            textAlign: 'left',
            verticalAlign: 'top',
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
        },

        '& thead tr': {
            pageBreakAfter: 'avoid',
            breakAfter: 'avoid'
        },

        '& tbody tr': {
            pageBreakInside: 'avoid',
            breakInside: 'avoid'
        }
    },

    // Prevent text overflow and ensure proper distribution
    '& .pdf-text': {
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto'
    },

    '@media print': {
        width: '100%',
        minHeight: 'unset',
        margin: 0,
        boxShadow: 'none',
        border: 'none',

        '& .no-print': {
            display: 'none !important'
        },

        '& table': {
            pageBreakInside: 'auto'
        },

        '& tr': {
            pageBreakInside: 'avoid',
            pageBreakAfter: 'auto'
        },

        '& td': {
            pageBreakInside: 'avoid',
            pageBreakAfter: 'auto'
        },

        '& thead': {
            display: 'table-header-group'
        },

        '& tfoot': {
            display: 'table-footer-group'
        }
    }
}));

const HtmlToPdfViewer = forwardRef(({
    content,
    header,
    fileName = "document",
    footer,
    remainingPayload = {}
}, ref) => {
    const showAlert = useAlert();
    const contentRef = useRef();
    const token = useSelector((state) => state.auth.token);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false)

    const pdfOptions = {
        filename: `${fileName}.pdf`,
        margin: [10, 10, 10, 10],
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 3,
            useCORS: true,
            letterRendering: true,
            allowTaint: false
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compressPDF: true
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: '.no-page-break'
        }
    };

    const handleDownloadPDF = () => {
        if (contentRef.current) {
            window.html2pdf().set(pdfOptions).from(contentRef.current).save();
        }
    };

    const handlePrintPDF = () => {
        if (contentRef.current && window.html2pdf) {
            try {
                window.html2pdf()
                    .set(pdfOptions)
                    .from(contentRef.current)
                    .toPdf()
                    .get("pdf")
                    .then((pdf) => {
                        const blob = pdf.output("blob");
                        const blobUrl = URL.createObjectURL(blob);
                        const printWindow = window.open(blobUrl, "_blank");
                        if (printWindow) {
                            printWindow.onload = function () {
                                printWindow.focus();
                                printWindow.print();
                            };
                            showAlert("Opening print dialog...", "info");
                        } else {
                            showAlert("Popup blocked. Please allow popups and try again.", "warning");
                        }
                    });
            } catch (error) {
                console.error("Print failed:", error);
                showAlert("Failed to print PDF", "error");
            }
        } else {
            showAlert("PDF library not loaded", "error");
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
        <>{loading && <Loading />}
            <PdfContainer>
                <FlexBetween flexDirection={"column"}
                    ref={contentRef}
                    className="pdf-text"
                    gap={2}
                >
                    {/* Header Section */}
                    <Box className="pdf-page">
                        <FlexBetween sx={{ mb: 3 }}>
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
                            <Box sx={{ textAlign: 'right', flexGrow: 1 }}>
                                {header}
                            </Box>
                        </FlexBetween>
                        <Divider sx={{ my: 2 }} />
                    </Box>

                    {/* Content Section */}
                    <Box className="pdf-page" sx={{ flexGrow: 1 }}>
                        {content}
                    </Box>

                    {/* Footer Section */}
                    <Box>
                        <FlexEvenly>
                            <Box>
                                <Typography
                                    textAlign="center"
                                    sx={{
                                        marginTop: '5mm',
                                        fontSize: '10px',
                                        color: '#555'
                                    }}
                                >
                                    {footer}
                                    <Typography component="p" sx={{ fontSize: '9px', mt: 1 }}>
                                        Powered by Book & Manger
                                    </Typography>
                                </Typography>
                            </Box>
                        </FlexEvenly>
                    </Box>
                </FlexBetween>
            </PdfContainer>
        </>
    );
}
);

HtmlToPdfViewer.displayName = "HtmlToPdfViewer";
HtmlToPdfViewer.propTypes = {
    content: PropTypes.node.isRequired,
    header: PropTypes.node,
    fileName: PropTypes.string,
    remainingPayload: PropTypes.object,
    footer: PropTypes.node,
};

export default HtmlToPdfViewer;
