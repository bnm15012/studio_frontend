/** QR code generation and printing component using react-qr-code, with dialog display and PDF print support. */
import React, { useState, useRef } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import QRCode from "react-qr-code";
import { PrinterIcon, QrCodeIcon } from "lucide-react";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { useAppUI } from "@/context/UIContext";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";

interface Html2PdfInstance {
    set: (opts: Record<string, unknown>) => Html2PdfInstance;
    from: (el: HTMLElement) => Html2PdfInstance;
    save: () => void;
    toPdf: () => { get: (key: string) => { then: (cb: (pdf: PdfInstance) => void) => void } };
}

interface PdfInstance {
    output: (type: string) => Blob;
    autoPrint: () => void;
}

export interface QrFormProps {
    link?: string;
    qrSize?: number;
    title?: string;
    qrValue?: string | boolean;
}

const QrForm: React.FC<QrFormProps> = ({
    link,
    qrSize = 256,
    title = "QR Code",
    qrValue = false,
}) => {
    const { isMobile, currentBranch } = useAppUI();
    const [open, setOpen] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    const qrLink =
        typeof qrValue === "string"
            ? qrValue
            : `${window.location.origin}/#/form/${link}/${currentBranch.branchId}`;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDownloadPDF = () => {
        if (!qrRef.current) return;
        const html2pdf = (window as unknown as { html2pdf: () => Html2PdfInstance }).html2pdf();
        html2pdf
            .set({
                filename: `QRCode-${link || qrValue}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(qrRef.current)
            .save();
    };

    const handlePrintPDF = () => {
        if (!qrRef.current) return;
        const html2pdf = (window as unknown as { html2pdf: () => Html2PdfInstance }).html2pdf();
        html2pdf
            .set({
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(qrRef.current)
            .toPdf()
            .get("pdf")
            .then((pdf: PdfInstance) => {
                const blob = pdf.output("blob");
                const blobUrl = URL.createObjectURL(blob);
                const printWindow = window.open(blobUrl, "_blank");
                if (printWindow) {
                    printWindow.onload = function () {
                        printWindow.focus();
                        printWindow.print();
                    };
                }
            });
    };

    return (
        <>
            <IconButton onClick={handleOpen} sx={iconBtnFilledSx}>
                <QrCodeIcon size={20} />
            </IconButton>

            <StyledDialog
                closeIcon={true}
                open={open}
                cancelText="Close"
                onClose={handleClose}
                title={title || "QR code"}
                onConfirm={handleDownloadPDF}
                confirmText="Download"
                actions={[
                    {
                        key: "print",
                        tip: "Print PDF",
                        onClick: handlePrintPDF,
                        component: <PrinterIcon />,
                    },
                ]}
            >
                <div
                    ref={qrRef}
                    style={{ textAlign: "center", padding: "10px", marginTop: "20px" }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            backgroundColor: "white",
                            display: "inline-block",
                            maxWidth: "100%",
                            boxSizing: "border-box",
                            "& svg": {
                                maxWidth: "100%",
                                height: "auto",
                            },
                        }}
                    >
                        <QRCode value={qrLink} size={isMobile ? Math.min(qrSize, 200) : qrSize} />
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: isMobile ? "0.95rem" : "1.2rem",
                            mt: 2,
                            wordBreak: "break-all",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {qrLink}
                    </Typography>
                </div>
            </StyledDialog>
        </>
    );
};

export default QrForm;
