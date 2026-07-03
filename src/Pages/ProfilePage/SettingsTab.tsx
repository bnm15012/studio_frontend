import { useAppDispatch, useAppSelector } from "@/state";
import React, { useState, useEffect } from "react";
import { Switch, Box, Button, Typography } from "@mui/material";
import { updateStudio } from "../Auth/auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { setSettings } from "../../state/authSlice";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useUI } from "@/context/UIContext";

const SettingsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token, studio } = useUI()
    const showAlert = useAlert();

    const initialConfigurations = useAppSelector((state) => state.auth.settings) || ({} as Record<string, boolean>);

    const [configurations, setConfigurations] = useState<Record<string, boolean>>(initialConfigurations as unknown as Record<string, boolean>);
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
                showAlert("Setting updated!", "success");
            } else {
                showAlert(message, "error");
            }
        } catch (error: unknown) {
            console.error(error);
            showAlert("Internal server error", "error");
        }
        setIsLoading(false);
    };

    return (
        <Box p={3}>
            <Box
                display="grid"
                gap={1}
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
            >
                {Object.keys(configurations).map((key) => (
                    <FlexBetween
                        key={key}
                        sx={{ p: 1, borderRadius: 1, border: "1px solid #e0e0e0" }}
                    >
                        <Box my={"auto"}>{key}</Box>
                        <Switch
                            checked={!!configurations[key]}
                            onChange={() => handleToggle(key)}
                            color="primary"
                        />
                    </FlexBetween>
                ))}
            </Box>

            <Box mt={4}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={updateSettings}
                    disabled={!isChanged || isLoading}
                >
                    <Typography variant="button" fontWeight={"bold"} color="white">
                        {isLoading ? "Saving..." : "Save Settings"}
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default SettingsTab;
