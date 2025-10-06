import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Typography, Box } from "@mui/material";
import QRCode from "react-qr-code";
import { PrinterIcon, QrCodeIcon } from "lucide-react";
import { useSelector } from "react-redux";
import StyledDialog from "./New/StyledDialog";

const QrForm = ({ link, qrSize = 256, title = "QR Code", buttonVariant = "contained" }) => {
    const [open, setOpen] = useState(false);
    const qrRef = useRef(null);
    const currentBranch = useSelector((state) => state.branch.currentBranch) || {};
    const qrLink = `${window.location.origin}/form/${link}/${currentBranch.branchId}`;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDownloadPDF = () => {
        if (!qrRef.current) return;
        window
            .html2pdf()
            .set({
                filename: `QRCode-${link}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(qrRef.current)
            .save();
    };

    const handlePrintPDF = () => {
        if (!qrRef.current) return;
        window
            .html2pdf()
            .set({
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(qrRef.current)
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
    };

    return (
        <>
            <Button variant={buttonVariant} onClick={handleOpen}>
                <QrCodeIcon />
            </Button>

            <StyledDialog
                closeIcon={true}
                open={open}
                cancelText="Close"
                onClose={handleClose}
                title={title}
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
                    style={{ textAlign: "center", padding: "20px", marginTop: "50px" }}
                >
                    <Box padding={2} backgroundColor="white">
                        <QRCode value={qrLink} size={qrSize} />
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: "1.2rem", mt: 2 }}>
                        {qrLink}
                    </Typography>
                </div>
            </StyledDialog>
        </>
    );
};

QrForm.propTypes = {
    link: PropTypes.string.isRequired,
    title: PropTypes.string,
    qrSize: PropTypes.number,
    buttonVariant: PropTypes.string,
};

export default QrForm;
