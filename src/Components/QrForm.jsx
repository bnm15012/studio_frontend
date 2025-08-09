import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import QRCode from "react-qr-code";
import { QrCodeIcon } from "lucide-react";

const QrForm = ({ link, qrSize = 256, title = "QR Code", buttonVariant = "contained" }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", p: 4 }}>
                    <QRCode value={`${window.location.origin}/form/${link}`} size={qrSize} />
                    <Typography variant="body2" sx={{ fontSize: "1.2rem", mt: 2, textAlign: "center" }}>
                        {`${window.location.origin}/form/${link}`}
                    </Typography>
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
