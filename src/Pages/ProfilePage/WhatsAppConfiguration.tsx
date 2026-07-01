import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Divider, Chip, Button, Stack, CircularProgress } from "@mui/material";
import { Error as ErrorIcon, QrCode, WhatsApp } from "@mui/icons-material";
import {
    checkWhatsAppConnectionAPI,
    createWhatsAppCredentialsAPI,
    logoutWhatsAppConnectionAPI,
} from "./whatsapp.api";
import Loading from "@/core/components/loading/Loading";
import { useAlert } from "@/core/components/feedback/Alert";
import { useAppDispatch } from "@/state";
import { branchCruds } from "../../api/all.api";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAppSelector } from "@/state";

const WhatsAppConfiguration: React.FC = () => {
    const showAlert = useAlert();
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [webWhastAppQrCode, setWebWhastAppQrCode] = useState<string | false | undefined>();
    const currentBranch = useAppSelector((state: any) => state.branch.currentBranch);
    const [whatsAppStatus, setWhatsAppStatus] = useState<string>(currentBranch?.whatsAppStatus ?? "");
    const [polling, setPolling] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateWhatsAppStatus = useCallback(
        (status = "ACTIVE") => {
            setWhatsAppStatus(status);
            const newCurrentBranch = JSON.parse(JSON.stringify(currentBranch));
            newCurrentBranch.whatsAppStatus = status;
            dispatch((branchCruds.actions as any).setCurrentBranch(newCurrentBranch));
            dispatch((branchCruds.actions as any).updateItem(newCurrentBranch));
            setWebWhastAppQrCode(undefined);
        },
        [currentBranch, dispatch],
    );

    const createWhatsAppCredentials = async () => {
        try {
            setLoading(true);
            const { data, message, success } = await createWhatsAppCredentialsAPI({
                branchId: currentBranch.branchId,
                token: token!,
            });
            if (success) {
                if (data?.[0]?.webWhatsAppStatus === "ACTIVE") {
                    updateWhatsAppStatus();
                } else {
                    setWebWhastAppQrCode(data?.qrCode);
                    setPolling(!!data?.qrCode);
                    showAlert(message, "success");
                }
            } else {
                showAlert(message || "Something wrong!", "warning");
            }
        } catch (error: any) {
            showAlert(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: any;
        let attempts = 0;

        const pollWhatsAppStatus = async () => {
            try {
                const { success, data } = await checkWhatsAppConnectionAPI({
                    branchId: currentBranch.branchId,
                    token: token!,
                });
                if (success) {
                    if (data.webWhatsAppStatus === "ACTIVE") {
                        updateWhatsAppStatus();
                        showAlert("WhatsApp connected!", "success");
                        setPolling(false);
                        clearInterval(interval);
                    } else {
                        attempts += 1;
                        if (attempts >= 7) {
                            setPolling(false);
                            setWebWhastAppQrCode(false);
                            showAlert("WhatsApp connection attempt timed out.", "warning");
                            clearInterval(interval);
                        }
                    }
                }
            } catch (error: any) {
                setPolling(false);
                clearInterval(interval);
                console.error(error);
                showAlert("Error checking WhatsApp status", "error");
            }
        };

        if (polling) {
            interval = setInterval(pollWhatsAppStatus, 15000);
        }

        return () => clearInterval(interval);
    }, [polling, token, showAlert, currentBranch.branchId, updateWhatsAppStatus]);

    const logoutWhatsApp = async () => {
        try {
            setLoading(true);
            const { success, message, data } = await logoutWhatsAppConnectionAPI({
                branchId: currentBranch.branchId,
                token: token!,
            });
            if (success) {
                if (data.webWhatsAppStatus === "LOGOUT") updateWhatsAppStatus("LOGOUT");
                else throw new Error();
                showAlert("WhatsApp disconnected successfully!", "success");
            } else {
                showAlert(message || "Failed to disconnect WhatsApp", "error");
            }
        } catch (error: any) {
            showAlert("Error disconnecting WhatsApp", "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {loading && <Loading />}
            <FlexBetween>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        mb: 2,
                    }}
                >
                    WhatsApp Configuration (Different for Each Branch)
                </Typography>
                {polling && <CircularProgress sx={{ color: "blue" }} />}
            </FlexBetween>
            <Divider />

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                py={3}
            >
                {whatsAppStatus === "ACTIVE" ? (
                    <Stack spacing={2} alignItems="center">
                        <Chip
                            icon={<WhatsApp sx={{ filter: "drop-shadow(0 0 4px #00ff99)" }} />}
                            label="WhatsApp Connected!"
                            sx={{
                                background: "rgba(0, 255, 153, 0.2)",
                                fontSize: "1rem",
                                fontWeight: 500,
                                px: 3,
                                py: 1.5,
                                cursor: "pointer",
                                borderRadius: "20px",
                                border: "1px solid rgba(0, 255, 153, 0.5)",
                                boxShadow: "0 0 10px rgba(0, 255, 153, 0.4)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(0, 255, 153, 0.3)",
                                    boxShadow: "0 0 15px rgba(0, 255, 153, 0.6)",
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={logoutWhatsApp}
                            sx={{
                                background: "linear-gradient(45deg, #ff4d4d, #ff1a1a)",
                                color: "#fff",
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: "20px",
                                boxShadow: "0 0 10px rgba(255, 77, 77, 0.5)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "linear-gradient(45deg, #ff6666, #ff3333)",
                                    boxShadow: "0 0 15px rgba(255, 77, 77, 0.7)",
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            Disconnect
                        </Button>
                    </Stack>
                ) : webWhastAppQrCode ? (
                    <Stack spacing={2} alignItems="center">
                        <Box
                            sx={{
                                position: "relative",
                                width: 220,
                                height: 220,
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "2px solid rgb(20, 103, 12)",
                                boxShadow: "0 0 20px rgba(0, 230, 230, 0.5)",
                                animation: "pulse 2s infinite ease-in-out",
                                "@keyframes pulse": {
                                    "0%": { boxShadow: "0 0 20px rgba(0, 230, 65, 0.5)" },
                                    "50%": { boxShadow: "0 0 30px rgba(0, 230, 27, 0.8)" },
                                    "100%": { boxShadow: "0 0 20px rgba(0, 230, 77, 0.5)" },
                                },
                            }}
                        >
                            <img
                                src={webWhastAppQrCode}
                                alt="WhatsApp QR"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    backgroundColor: "#fff",
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
                                maxWidth: "300px",
                            }}
                        >
                            Scan this QR code with your WhatsApp. Connection may take up to 30
                            seconds after scanning code successfully.
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={2} alignItems="center">
                        <Chip
                            icon={
                                <ErrorIcon
                                    sx={{
                                        color: "#ff4d4d !important",
                                        filter: "drop-shadow(0 0 4px #ff4d4d)",
                                    }}
                                />
                            }
                            label={`WhatsApp ${whatsAppStatus === "LOGOUT" ? "logged out" : "not connected"}`}
                            sx={{
                                background: "rgba(255, 77, 77, 0.2)",
                                color: "#ff4d4d",
                                fontSize: "1rem",
                                fontWeight: 500,
                                px: 3,
                                py: 1.5,
                                borderRadius: "20px",
                                border: "1px solid rgba(255, 77, 77, 0.5)",
                                boxShadow: "0 0 10px rgba(255, 77, 77, 0.4)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "rgba(255, 77, 77, 0.3)",
                                    boxShadow: "0 0 15px rgba(255, 77, 77, 0.6)",
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<QrCode sx={{ filter: "drop-shadow(0 0 4px #00e6e6)" }} />}
                            onClick={createWhatsAppCredentials}
                            sx={{
                                background: "linear-gradient(45deg, #00e6e6, #00b3b3)",
                                color: "#fff",
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: "20px",
                                boxShadow: "0 0 10px rgba(0, 230, 230, 0.5)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    background: "linear-gradient(45deg, #33f6f6, #33c4c4)",
                                    boxShadow: "0 0 15px rgba(0, 230, 230, 0.7)",
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            Generate QR to Connect
                        </Button>
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default WhatsAppConfiguration;
