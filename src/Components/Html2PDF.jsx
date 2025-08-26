import { forwardRef, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Divider, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useSelector } from "react-redux";
import FlexEvenly from "./FlexEvenly";

const HtmlToPdfViewer = forwardRef(({ content, header, fileName, footer }, ref) => {
    const contentRef = useRef();
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    const pdfOptions = {
        filename: fileName || "document.pdf",
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

    useImperativeHandle(ref, () => ({
        downloadPDF: handleDownloadPDF,
        printPDF: handlePrintPDF,
    }));

    return (
        <Box>
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
                        <FlexBetween gap={1}>
                            {studio?.logo && (
                                <img
                                    src={studio.logo}
                                    alt="Studio Logo"
                                    style={{ width: 120, height: 120, margin: "auto" }}
                                    crossOrigin="anonymous"
                                />
                            )}
                            <Box>
                                <Typography variant="h5" sx={{ textWrap: "wrap" }}>
                                    {studio?.studioName}
                                </Typography>
                                <p style={{ margin: 0 }}>{currentBranch?.address}, {currentBranch?.city}, {currentBranch?.state} {currentBranch?.pincode}</p>
                                <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                                <p style={{ margin: 0 }}>{studio?.email}</p>
                            </Box>
                        </FlexBetween>
                        <Box flexGrow={1} textAlign="right">
                            {header}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                    </FlexBetween>
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
    footer: PropTypes.node,
};

export default HtmlToPdfViewer;
