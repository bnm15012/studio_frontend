import React, { useEffect, useRef, useState } from "react";
import {
    DialogContent,
    Box,
    Typography,
    CircularProgress,
    Button,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Html5Qrcode } from "html5-qrcode";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "@/core/components/feedback/Alert";
import { useUI } from "../../../context/UIContext";
import { studentsAssignmentsCruds } from "../../../api/all.api";

const MarkPresentDialog: React.FC = () => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const token = useAppSelector((state) => state.auth.token);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<string | null>(null); // success | fail
    const [message, setMessage] = useState("");

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const timeOutRef = useRef<any>(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        if (!open) return;

        const initScanner = async () => {
            try {
                if (!isMounted) return;
                setScanStatus(null);
                setMessage("");
                isProcessingRef.current = false;

                // Ensure DOM is ready
                await new Promise((resolve) => setTimeout(resolve, 100));

                const element = document.getElementById("qr-reader");

                if (!element) {
                    console.error("qr-reader div not found");
                    return;
                }

                if (!scannerRef.current) {
                    scannerRef.current = new Html5Qrcode("qr-reader");
                }

                await scannerRef.current.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        if (isProcessingRef.current) return;
                        isProcessingRef.current = true;

                        setScanResult(decodedText);

                        const parts = decodedText.split("/");
                        const assignmentId = parts[1];

                        try {
                            if (scannerRef.current) {
                                await scannerRef.current.stop();
                            }
                        } catch (e) { }

                        if (!assignmentId) {
                            if (isMounted) {
                                setScanStatus("fail");
                                setMessage("Invalid QR");
                                timeOutRef.current = setTimeout(() => {
                                    if (isMounted) initScanner();
                                }, 3000);
                            }
                            return;
                        }

                        await markPresent(assignmentId);

                        timeOutRef.current = setTimeout(() => {
                            if (isMounted) {
                                initScanner();
                            }
                        }, 3000);
                    },
                    () => { }
                );
            } catch (err: any) {
                console.error("Scanner Error:", err);
                if (!isMounted) return;

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
            isMounted = false;
            isProcessingRef.current = true; // prevent any pending callback from executing

            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }

            if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                }).catch(() => { });
            }
        };
    }, [open]);

    const markPresent = async (assignmentId: string) => {
        try {
            await (dispatch as any)(studentsAssignmentsCruds.markAttendanceQR(assignmentId, token, showAlert, setLoading, true));
            setScanStatus("success");
            setMessage("Attendance Marked");
        } catch (error: any) {
            setScanStatus("fail");
            setMessage(
                error?.response?.data?.status?.statusMessage ||
                error.message ||
                "Failed to mark attendance"
            );
        }
    };

    const handleClose = async () => {
        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
        }

        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err: any) { }
            scannerRef.current = null;
        }

        setOpen(false);
        setScanResult(null);
        setScanStatus(null);
        setMessage("");
    };

    return (
        <>
            {isEnabled?.(FEATURE_KEYS.ATTENDANCE) && (
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
                        <Box sx={{ display: scanStatus ? "none" : "block", width: "100%", maxWidth: 350 }}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Scan Attendance QR
                            </Typography>

                            <Box
                                id="qr-reader"
                                sx={{
                                    width: "100%",
                                    overflow: "hidden",
                                    borderRadius: 3,
                                }}
                            />

                            {loading && (
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>

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
                                    Success
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
