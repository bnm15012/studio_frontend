import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Typography, Stack, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import QRCode from "react-qr-code";
import { QrCodeIcon } from "lucide-react";

const QrForm = ({ link, qrSize = 256, title = "QR Code", buttonVariant = "contained" }) => {
    const [open, setOpen] = useState(false);
    const qrRef = useRef(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDownloadPDF = () => {
        if (!qrRef.current) return;
        window.html2pdf()
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
        window.html2pdf()
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <div ref={qrRef} style={{ textAlign: "center", padding: "20px", marginTop: "50px" }}>
                        <Box padding={2} backgroundColor="white">
                            <QRCode value={`${window.location.origin}/form/${link}`} size={qrSize} />
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: "1.2rem", mt: 2 }}>
                            {`${window.location.origin}/form/${link}`}
                        </Typography>
                    </div>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button variant="contained" onClick={handleDownloadPDF}>
                            Download
                        </Button>
                        <Button variant="outlined" onClick={handlePrintPDF}>
                            Print
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
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
