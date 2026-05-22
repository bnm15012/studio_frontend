import { useEffect, useRef, useState } from "react";
import {
    DialogContent,
    IconButton,
    Box,
    Typography,
    CircularProgress,
    Button,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Html5Qrcode } from "html5-qrcode";

import StyledDialog from "../../../Components/New/StyledDialog";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../../utils/Alert";
import { useUI } from "../../../context/UIContext";

const MarkPresentDialog = () => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const token = useSelector((state) => state.auth.token);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanStatus, setScanStatus] = useState(null); // success | fail
    const [message, setMessage] = useState("");

    const scannerRef = useRef(null);
    const timeOutRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        let html5QrCode;

        const initScanner = async () => {
            let isProcessing = false;
            try {
                setScanStatus(null);
                setMessage("");

                await new Promise((resolve) => setTimeout(resolve, 500));

                const element = document.getElementById("qr-reader");

                if (!element) {
                    console.error("qr-reader div not found");
                    return;
                }

                html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    {
                        facingMode: "environment",
                    },
                    {
                        fps: 10,
                        qrbox: 250,
                    },
                    async (decodedText) => {
                        if (isProcessing) return;
                        isProcessing = true;

                        setScanResult(decodedText);

                        const parts = decodedText.split("/");
                        const assignmentId = parts[1];

                        await html5QrCode.stop();

                        if (!assignmentId) {
                            setScanStatus("fail");
                            setMessage("Invalid QR");
                            return;
                        }

                        await markPresent(assignmentId);
                        timeOutRef.current = setTimeout(() => {
                            setScanStatus(null);
                            setMessage("");
                            initScanner();
                        }, 3000);
                    }
                );
            } catch (err) {
                console.error("Scanner Error:", err);

                setScanStatus("fail");

                if (err?.name === "NotAllowedError") {
                    setMessage("Camera permission denied");
                } else {
                    setMessage(err?.message || "Unable to open camera");
                }
            }
        };

        initScanner();

        return () => {
            try {
                if (html5QrCode) {
                    html5QrCode
                        .stop()
                        .catch(() => { });
                }

                if (timeOutRef.current) {
                    clearTimeout(timeOutRef.current);
                }
            } catch (error) {

            }
        };
    }, [open]);

    const markPresent = async (assignmentId) => {
        try {
            dispatch(studentsAssignmentsCruds.markAttendanceQR(assignmentId, token, showAlert, setLoading, true));
        } catch (error) {
            setScanStatus("fail");
            setMessage(
                error?.response?.data?.status?.statusMessage ||
                error.message ||
                "Failed to mark attendance"
            );
        }
    };

    const handleClose = async () => {
        setOpen(false);
        setScanResult(null);
        setScanStatus(null);
        setMessage("");
    };

    return (
        <>
            {isEnabled(FEATURE_KEYS.ATTENDANCE) && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                >
                    <QrCodeScannerIcon />
                </Button>)}

            <StyledDialog
                open={open}
                closeIcon={true}
                onClose={handleClose}
                title={`Mark Attendance`}
            >
                <DialogContent>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        minHeight={400}
                    >
                        {!scanStatus && (
                            <>
                                <Typography variant="h6">
                                    Scan Attendance QR
                                </Typography>

                                <Box
                                    id="qr-reader"
                                    sx={{
                                        width: "100%",
                                        maxWidth: 350,
                                        overflow: "hidden",
                                        borderRadius: 3,
                                    }}
                                />

                                {loading && <CircularProgress />}
                            </>
                        )}

                        {scanStatus === "success" && (
                            <>
                                <CheckCircleIcon
                                    color="success"
                                    sx={{
                                        fontSize: 120,
                                    }}
                                />

                                <Typography
                                    variant="h5"
                                    color="success.main"
                                    fontWeight="bold"
                                >
                                    Attendance Marked
                                </Typography>

                                <Typography variant="body1">
                                    {message}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {scanResult}
                                </Typography>
                            </>
                        )}

                        {scanStatus === "fail" && (
                            <>
                                <CancelIcon
                                    color="error"
                                    sx={{
                                        fontSize: 120,
                                    }}
                                />

                                <Typography
                                    variant="h5"
                                    color="error.main"
                                    fontWeight="bold"
                                >
                                    Failed
                                </Typography>

                                <Typography variant="body1">
                                    {message}
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
            </StyledDialog>
        </>
    );
};

export default MarkPresentDialog;
