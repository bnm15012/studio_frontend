import React, { useEffect, useState } from "react";
import { Typography, IconButton, Tooltip, Divider, Box, useTheme, Chip } from "@mui/material";
import {
    Class as ClassIcon,
    Email as EmailIcon,
    LocationCity as LocationCityIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Store as StoreIcon,
} from "@mui/icons-material";
import { Percent } from "lucide-react";
import { updateProfile, updateStudio } from "@/Pages/Auth/auth.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { useAppUI } from "@/context/UIContext";
import ImageComponent from "@/core/components/fields/ImageComponent";
import Field from "@/core/components/fields/Field";
import { useAppDispatch } from "@/state";
import type { User, Studio } from "@/api/types";

interface EditedValues {
    userName?: string;
    phone: string;
    studioName: string;
    location: string;
    gstNumber: string;
    email?: string;
}

interface UserWidgetsProps {
    admin: User;
    studio: Studio;
}

const UserWidgets: React.FC<UserWidgetsProps> = ({ admin, studio }) => {
    const theme = useTheme();
    const { isMobile, token } = useAppUI();
    const showAlert = useAlert();
    const dispatch = useAppDispatch();

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [studioLogo, setStudioLogo] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedValues, setEditedValues] = useState<EditedValues>({
        phone: "",
        studioName: "",
        location: "",
        gstNumber: "",
    });

    const verifyChanges = (values: EditedValues) => {
        const userData = {
            phone: values.phone,
            imageUrl: imageUrl,
            userId: admin.userId,
        };
        const studioData = {
            studioId: studio.studioId,
            studioName: values.studioName,
            location: values.location,
            logo: studioLogo,
            gstNumber: values.gstNumber,
        };

        const isUserChanged = values.phone !== admin.phone || imageUrl !== admin.imageUrl;
        const isStudioChanged =
            values.gstNumber !== studio.gstNumber ||
            values.studioName !== studio.studioName ||
            values.location !== studio.location ||
            studioLogo !== studio.logo;

        return {
            studioData: isStudioChanged ? studioData : null,
            userData: isUserChanged ? userData : null,
        };
    };

    const saveProfile = async () => {
        const { userData, studioData } = verifyChanges(editedValues);
        let alertShown = false;

        if (userData) {
            const res = await updateProfile({ values: userData, dispatch, token });
            alertShown = true;
            showAlert(res.message, res.success ? "success" : "error");
        }

        if (studioData) {
            const res = await updateStudio({ values: studioData, dispatch, token });
            alertShown = true;
            showAlert(res.message, res.success ? "success" : "error");
        }

        if (!alertShown) showAlert("No changes to save", "info");
    };

    useEffect(() => {
        setEditedValues({
            userName: admin.userName || "",
            phone: admin.phone || "",
            studioName: studio.studioName || "",
            location: studio.location || "",
            gstNumber: studio.gstNumber || "",
        });
        setStudioLogo(studio.logo || null);
    }, [admin, studio]);

    if (!admin) return null;

    return (
        <Box
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
            }}
        >
            {/* ── Header ── */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    px: 3,
                    py: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Box
                        sx={{
                            borderRadius: "50%",
                            p: "3px",
                            bgcolor: "rgba(255,255,255,0.25)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                        }}
                    >
                        <ImageComponent
                            dirName="user"
                            size="80px"
                            setValue={setImageUrl}
                            value={admin.imageUrl}
                            isCircular
                            allowEdit={editMode}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="white">
                            {admin.userName}
                        </Typography>
                        <Chip
                            label={admin.role}
                            size="small"
                            sx={{
                                mt: 0.5,
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                            }}
                        />
                    </Box>
                </Box>

                <Tooltip title={editMode ? "Save Profile" : "Edit Profile"}>
                    <IconButton
                        onClick={() => {
                            if (editMode) saveProfile();
                            setEditMode(!editMode);
                        }}
                        sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                            transition: "all 0.18s",
                        }}
                    >
                        {editMode ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── Body ── */}
            <Box display="grid" gridTemplateColumns={isMobile ? "1fr" : "1fr auto"} gap={0}>
                {/* Left — Fields */}
                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="overline"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ letterSpacing: 1.2 }}
                    >
                        Contact Information
                    </Typography>
                    <Divider sx={{ mt: 0.5, mb: 2 }} />

                    <Box
                        display="grid"
                        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                        gap={2}
                        mb={3}
                    >
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <EmailIcon
                                sx={{ color: "text.secondary", flexShrink: 0, fontSize: 20 }}
                            />
                            <Field
                                value={admin.email}
                                setValue={(value) =>
                                    setEditedValues((prev: EditedValues) => ({
                                        ...prev,
                                        email: value as string,
                                    }))
                                }
                                extraProp={{ readOnly: true }}
                            />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1.5}>
                            <PhoneIcon
                                sx={{ color: "text.secondary", flexShrink: 0, fontSize: 20 }}
                            />
                            <Field
                                label="Phone"
                                value={editedValues.phone}
                                setValue={(value) =>
                                    setEditedValues((prev: EditedValues) => ({
                                        ...prev,
                                        phone: value as string,
                                    }))
                                }
                                isEdit={editMode}
                                validation={{
                                    required: true,
                                    regex: /^\+?[1-9]\d{9}$/,
                                    message: "Please enter a valid phone number",
                                }}
                            />
                        </Box>
                    </Box>

                    <Typography
                        variant="overline"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ letterSpacing: 1.2 }}
                    >
                        Studio Information
                    </Typography>
                    <Divider sx={{ mt: 0.5, mb: 2 }} />

                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <ClassIcon
                                sx={{ color: "text.secondary", flexShrink: 0, fontSize: 20 }}
                            />
                            <Field
                                label="Studio Name"
                                value={editedValues.studioName}
                                setValue={(value) =>
                                    setEditedValues((prev: EditedValues) => ({
                                        ...prev,
                                        studioName: value as string,
                                    }))
                                }
                                isEdit={editMode}
                                validation={{ required: true }}
                            />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1.5}>
                            <LocationCityIcon
                                sx={{ color: "text.secondary", flexShrink: 0, fontSize: 20 }}
                            />
                            <Field
                                label="Location"
                                value={editedValues.location}
                                setValue={(value) =>
                                    setEditedValues((prev: EditedValues) => ({
                                        ...prev,
                                        location: value as string,
                                    }))
                                }
                                isEdit={editMode}
                                validation={{ required: true }}
                            />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Percent
                                size={20}
                                style={{ color: theme.palette.text.secondary, flexShrink: 0 }}
                            />
                            <Field
                                label="GST Number"
                                placeholder="Enter GST Number"
                                value={editedValues.gstNumber}
                                setValue={(value) =>
                                    setEditedValues((prev: EditedValues) => ({
                                        ...prev,
                                        gstNumber: value as string,
                                    }))
                                }
                                isEdit={editMode}
                                validation={{
                                    regex: /^[0-9A-Z]{15}$/,
                                    message:
                                        "Enter valid GST number (15-digit only - digits & capital letters)",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Right — Studio Logo */}
                {!isMobile && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            px: 4,
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.action.hover,
                            minWidth: 180,
                        }}
                    >
                        <StoreIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Studio Logo
                        </Typography>
                        <ImageComponent
                            dirName="studio"
                            size="130px"
                            setValue={setStudioLogo}
                            value={studio.logo || "/assets/default_logo.png"}
                            isCircular
                            allowEdit={editMode}
                        />
                    </Box>
                )}

                {/* Mobile: show logo below fields */}
                {isMobile && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            pb: 3,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Studio Logo
                        </Typography>
                        <ImageComponent
                            dirName="studio"
                            size="120px"
                            setValue={setStudioLogo}
                            value={studio.logo || "/assets/default_logo.png"}
                            isCircular
                            allowEdit={editMode}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UserWidgets;
