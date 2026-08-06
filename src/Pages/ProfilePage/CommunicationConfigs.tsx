import { useAppDispatch } from "@/state";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import {
    Divider,
    IconButton,
    Typography,
    Tooltip,
    Box,
    useTheme,
    alpha,
    Chip,
} from "@mui/material";
import Field from "@/core/components/fields/Field";
import { updateStudio } from "@/Pages/Auth/auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import { useAppUI } from "@/context/UIContext";
import { Studio } from "@/api/types";
import InputModeConfig from "./InputModeConfig";

interface CommunicationConfigsProps {
    studio: Studio;
}

const CommunicationConfigs: React.FC<CommunicationConfigsProps> = ({ studio }) => {
    const showAlert = useAlert();
    const theme = useTheme();
    const { isAdmin, token } = useAppUI();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [editProf, setEditProf] = useState(false);

    const [editedValues, setEditedValues] = useState({
        studioId: studio.studioId,
        passcode: "",
    });

    const saveProfile = async () => {
        setLoading(true);
        const response = await updateStudio({ values: editedValues, dispatch, token });
        setLoading(false);
        showAlert(response.message, response.success ? "success" : "error");
    };

    useEffect(() => {
        setEditedValues({
            studioId: studio.studioId,
            passcode: studio.passcode || "",
        });
    }, [studio]);

    return (
        <Box>
            <TopProgressBar loading={loading} />

            {isAdmin && (
                <Box>
                    {/* Section header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1.5,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon sx={{ color: "primary.main", fontSize: 20 }} />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Email Configuration
                            </Typography>
                        </Box>
                        <Tooltip title={editProf ? "Save changes" : "Edit"}>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => {
                                    if (editProf) saveProfile();
                                    setEditProf(!editProf);
                                }}
                                sx={{
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                }}
                            >
                                {editProf ? (
                                    <SaveIcon fontSize="small" />
                                ) : (
                                    <EditIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Email (read-only) */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            p: 1.75,
                            mb: 1.5,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.action.hover,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <EmailIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Sender Email
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {studio.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Chip label="Read-only" size="small" sx={{ fontSize: "0.65rem" }} />
                    </Box>

                    {/* Passcode */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.75,
                            p: 1.75,
                            borderRadius: 2,
                            border: `1px solid ${editProf ? theme.palette.primary.light : theme.palette.divider}`,
                            transition: "border-color 0.18s",
                        }}
                    >
                        <KeyIcon
                            sx={{
                                color: editProf ? "primary.main" : "text.secondary",
                                fontSize: 20,
                                flexShrink: 0,
                            }}
                        />
                        <Box flex={1}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mb={0.5}
                            >
                                App Passcode
                            </Typography>
                            <Field
                                placeholder="Enter 16-char passcode (no spaces)"
                                value={editedValues["passcode"]}
                                setValue={(value) =>
                                    setEditedValues((prev) => ({
                                        ...prev,
                                        passcode: String(value ?? ""),
                                    }))
                                }
                                isEdit={editProf}
                                validation={{
                                    required: true,
                                    regex: /^[^\s]{16}$/,
                                    message: "Must be exactly 16 characters with no spaces",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}

            <InputModeConfig />
        </Box>
    );
};

export default CommunicationConfigs;
