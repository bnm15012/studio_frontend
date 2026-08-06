import { useAppDispatch, useAppSelector } from "@/state";
import React, { useState, useEffect } from "react";
import { Switch, Box, Button, Typography, alpha, useTheme, Tooltip } from "@mui/material";
import { updateStudio } from "@/Pages/Auth/auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { setSettings, Setting } from "@/state/authSlice";
import { useAppUI } from "@/context/UIContext";
import SaveIcon from "@mui/icons-material/Save";
import TuneIcon from "@mui/icons-material/Tune";

const FLAG_LABELS: Record<string, { label: string; description: string }> = {
    whatsappEnabled: {
        label: "WhatsApp Notifications",
        description: "Send booking confirmations via WhatsApp",
    },
    emailEnabled: {
        label: "Email Notifications",
        description: "Send updates and receipts by email",
    },
    smsEnabled: {
        label: "SMS Notifications",
        description: "Send reminders via SMS",
    },
    autoRenewal: {
        label: "Auto Renewal",
        description: "Automatically renew subscriptions on expiry",
    },
    maintenanceMode: {
        label: "Maintenance Mode",
        description: "Put the app in maintenance mode for users",
    },
};

function getLabel(key: string): { label: string; description: string } {
    return (
        FLAG_LABELS[key] ?? {
            label: key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())
                .trim(),
            description: "",
        }
    );
}

const SettingsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token, studio } = useAppUI();
    const theme = useTheme();
    const showAlert = useAlert();

    const initialConfigurations = useAppSelector((state) => state.auth.settings);

    const [configurations, setConfigurations] = useState<Setting>(initialConfigurations || {});
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = (key: string) => {
        setConfigurations((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    useEffect(() => {
        const hasChanges = JSON.stringify(configurations) !== JSON.stringify(initialConfigurations);
        setIsChanged(hasChanges);
    }, [configurations, initialConfigurations]);

    const updateSettings = async () => {
        setIsLoading(true);
        try {
            const { success, data, message } = await updateStudio({
                values: {
                    studioId: studio.studioId,
                    configuration: { configrationEntryList: configurations },
                },
                dispatch,
                token,
            });

            if (success) {
                dispatch(setSettings({ settings: data.configuration.configrationEntryList }));
                showAlert("Settings saved!", "success");
            } else {
                showAlert(message, "error");
            }
        } catch (error) {
            console.error(error);
            showAlert("Internal server error", "error");
        }
        setIsLoading(false);
    };

    const keys = Object.keys(configurations);

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                }}
            >
                <TuneIcon sx={{ color: "primary.main" }} />
                <Box>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                        Feature Flags
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        These settings affect all users in your studio.
                    </Typography>
                </Box>
            </Box>

            {keys.length === 0 ? (
                <Typography variant="body2" color="text.disabled" textAlign="center" py={4}>
                    No settings available.
                </Typography>
            ) : (
                <Box display="grid" gap={1.5}>
                    {keys.map((key) => {
                        const { label, description } = getLabel(key);
                        const isOn = !!configurations[key];

                        return (
                            <Box
                                key={key}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    p: 1.75,
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    bgcolor: isOn
                                        ? alpha(theme.palette.primary.main, 0.04)
                                        : "transparent",
                                    transition: "background-color 0.18s",
                                    cursor: "pointer",
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    },
                                }}
                                onClick={() => handleToggle(key)}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {label}
                                    </Typography>
                                    {description && (
                                        <Typography variant="caption" color="text.secondary">
                                            {description}
                                        </Typography>
                                    )}
                                </Box>

                                <Tooltip title={isOn ? "Disable" : "Enable"}>
                                    <Switch
                                        checked={isOn}
                                        onChange={() => handleToggle(key)}
                                        color="primary"
                                        onClick={(e) => e.stopPropagation()}
                                        size="small"
                                        sx={{ flexShrink: 0 }}
                                    />
                                </Tooltip>
                            </Box>
                        );
                    })}
                </Box>
            )}

            <Button
                fullWidth
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={updateSettings}
                disabled={!isChanged || isLoading}
                sx={{
                    mt: 3,
                    py: 1.25,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    borderRadius: 2,
                }}
            >
                {isLoading ? "Saving…" : "Save Settings"}
            </Button>
        </Box>
    );
};

export default SettingsTab;
