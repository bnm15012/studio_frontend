import React, { useEffect, useState } from "react";
import { Typography, Paper, IconButton, Tooltip, Divider, Box, useTheme } from "@mui/material";
import {
    Class as ClassIcon,
    Email as EmailIcon,
    LocationCity as LocationCityIcon,
    Phone as PhoneIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import { Percent } from "lucide-react";
import { updateProfile, updateStudio } from "../../Auth/auth.api";
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
        <Paper
            sx={{
                backgroundColor: theme.palette.background.paper,
                maxWidth: "100%",
                borderRadius: 3,
                border: "1px solid blue",
            }}
        >
            {/* Header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                mb={3}
                px={3}
                py={2}
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    borderTopLeftRadius: "35px",
                    borderTopRightRadius: "35px",
                }}
            >
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={3}>
                    <ImageComponent
                        dirName="user"
                        size="100px"
                        setValue={setImageUrl}
                        value={admin.imageUrl}
                        isCircular
                        allowEdit={editMode}
                    />
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {admin.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {admin.role}
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title={editMode ? "Save Profile" : "Edit Profile"}>
                    <IconButton
                        onClick={() => {
                            if (editMode) saveProfile();
                            setEditMode(!editMode);
                        }}
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            color: "black",
                            "&:hover": { backgroundColor: theme.palette.primary.main },
                        }}
                    >
                        {editMode ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                </Tooltip>
            </Box>
            {/* Main Grid Layout */}
            <Box
                display="grid"
                gridTemplateColumns={isMobile ? "1fr" : "1.2fr 0.8fr"}
                gap={4}
                p={3}
                pt={0}
                alignItems="flex-start"
            >
                {/* Left Column — Fields */}
                <Box display="grid" gridTemplateColumns={"1fr"} columnGap={3} rowGap={2}>
                    {/* Contact Info */}
                    <Box gridColumn="1 / -1">
                        <Typography variant="h6" mb={1}>
                            Contact Information
                        </Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                        <EmailIcon />
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

                    <Box display="flex" alignItems="center" gap={2}>
                        <PhoneIcon />
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

                    {/* Studio Info */}
                    <Box gridColumn="1 / -1" mt={3}>
                        <Typography variant="h6" mb={1}>
                            Studio Information
                        </Typography>
                        <Divider />
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                        <ClassIcon />
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

                    <Box display="flex" alignItems="center" gap={2}>
                        <LocationCityIcon />
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

                    <Box display="flex" alignItems="center" gap={2}>
                        <Percent />
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

                {/* Right Column — Studio Image */}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    gap={2}
                >
                    <ImageComponent
                        dirName="studio"
                        size={isMobile ? "150px" : "200px"}
                        setValue={setStudioLogo}
                        value={studio.logo || "/assets/default_logo.png"}
                        isCircular
                        allowEdit={editMode}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default UserWidgets;
