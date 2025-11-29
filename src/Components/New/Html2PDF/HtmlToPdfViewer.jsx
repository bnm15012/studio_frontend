import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Divider, Typography } from "@mui/material";
import { ConfirmationDialog } from "./ConfirmationDialog";
import Loading from "../../Loading/Loading";
import FlexBetween from "../../FlexBetween";
import FlexEvenly from "../../FlexEvenly";
import { usePdfActions } from "./usePdfActions";
import { useSelector } from "react-redux";
import PDFPreviewGenerator from "./PDFPreviewGenerator";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const indianMobileRegex = /^[6-9]\d{9}$/;

const HtmlToPdfViewer = forwardRef(
    ({ content, header, fileName = "document", footer, remainingPayload = {} }, ref) => {
        const contentRef = useRef();
        const studio = useSelector((s) => s.auth.studio);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [dialogType, setDialogType] = useState("");
        const [inputValue, setInputValue] = useState("");
        const [inputError, setInputError] = useState("");

        const pdfOptions = {
            filename: `${fileName}.pdf`,
            margin: [10, 10, 10, 10],
            image: { type: "jpeg", quality: 0.01 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compressPDF: true },
        };

        const { loading, downloadPDF, printPDF, sendMail, sendWhatsApp } = usePdfActions({
            contentRef,
            pdfOptions,
            fileName,
            remainingPayload,
        });

        // Dialog functions
        const openDialog = (type, value) => {
            setDialogType(type);
            setInputValue(value);
            setInputError("");
            setDialogOpen(true);
        };

        const validateInput = (type, value) => {
            if (type === "email") return emailRegex.test(value) ? "" : "Invalid email address";
            if (type === "mobile")
                return indianMobileRegex.test(value) ? "" : "Invalid Indian mobile number";
            return "";
        };

        const handleDialogConfirm = async () => {
            const error = validateInput(dialogType, inputValue);
            setInputError(error);
            if (error) return;

            setDialogOpen(false);
            if (dialogType === "email") await sendMail();
            else if (dialogType === "mobile") await sendWhatsApp();
        };

        useImperativeHandle(ref, () => ({
            downloadPDF,
            printPDF,
            sendMail: (email) => openDialog("email", email),
            sendWhatsApp: (mobile) => openDialog("mobile", mobile),
        }));

        useEffect(() => {
            setInputError(validateInput(dialogType, inputValue));
        }, [inputValue, dialogType, dialogOpen]);

        return (
            <>
                {loading && <Loading />}
                <PDFPreviewGenerator>
                    <FlexBetween
                        flexDirection={"column"}
                        ref={contentRef}
                        className="pdf-text"
                        gap={2}
                    >
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
                                <Box sx={{ textAlign: "right", flexGrow: 1 }}>{header}</Box>
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
                                            marginTop: "5mm",
                                            fontSize: "10px",
                                            color: "#555",
                                        }}
                                    >
                                        {footer}
                                        <Typography component="p" sx={{ fontSize: "12px", mt: 1 }}>
                                            Powered by Book & Manage
                                        </Typography>
                                    </Typography>
                                </Box>
                            </FlexEvenly>
                        </Box>
                    </FlexBetween>
                </PDFPreviewGenerator>

                <ConfirmationDialog
                    type={dialogType}
                    value={inputValue}
                    error={inputError}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleDialogConfirm}
                    disabled={!inputValue || !!inputError}
                />
            </>
        );
    },
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
