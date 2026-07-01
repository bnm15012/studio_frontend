import { useEffect, useState } from "react";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { useDispatch, useSelector } from "react-redux";
import { genericTemplateCruds } from "../../../api/all.api";
import Loading from "@/core/components/loading/Loading";
import { sendWhatsAppMessage } from "./communication.api";
import { useAlert } from "@/core/components/feedback/Alert";
import {
    Box,
    TextField,
    Typography,
} from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { replacePlaceholders } from "../../../utils/globalFuns";

const SelectTemplateDialog = ({ open, onClose, data }) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();

    const { raw, phoneNumber, notificationType, ids } = data || {};

    const token = useAppSelector((state) => state.auth.token);
    const studio = useAppSelector((state) => state.auth.studio);
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);

    const [loading, setLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [editableMessage, setEditableMessage] = useState("");

    const allTemplates = useAppSelector((state) =>
        state.genericTemplate.items.filter(
            (template) => template.templateType === "COMMUNICATION" && template.id
        )
    );

    useEffect(() => {
        if (
            open &&
            (!allTemplates || allTemplates.length === 0)
        ) {
            dispatch(
                genericTemplateCruds.getAll(
                    showAlert,
                    setLoading,
                    token,
                    { searchTerm: "COMMUNICATION" },
                    studio.studioId,
                    false
                )
            );
        }
    }, [open]);

    useEffect(() => {
        if (open && allTemplates.length > 0 && !selectedTemplate) {
            setSelectedTemplate(allTemplates[0]);
        }
    }, [open, allTemplates]);

    useEffect(() => {
        if (!open) {
            setSelectedTemplate(null);
            setEditableMessage("");
        }
    }, [open]);

    useEffect(() => {
        if (!selectedTemplate) return;

        const message = replacePlaceholders(
            `${selectedTemplate.templateSubject ?? ""}\n\n${selectedTemplate.templateContent ?? ""}`,
            {
                student: raw,
                studio,
                branch: currentBranch,
            }
        );

        setEditableMessage(message);
    }, [selectedTemplate, raw, studio, currentBranch]);

    const onSend = () => {
        if (!editableMessage) {
            showAlert("Message is empty", "error");
            return;
        }

        if (notificationType === "WHATSAPP") {
            sendWhatsAppMessage({
                token,
                phone: phoneNumber,
                message: editableMessage,
                payload: {
                    branchId: currentBranch.branchId,
                    notificationType,
                    title: selectedTemplate?.templateName ?? "CUSTOM",
                    content: editableMessage,
                    memberIds: ids,
                },
            });
        }

        onClose({ open: false });
    };

    return (
        <StyledDialog
            open={open}
            onClose={() => onClose()}
            confirmText="Send"
            onConfirm={onSend}
            title="Select Template"
            maxWidth="lg"
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "40% 60%",
                    },
                    gap: 2,
                }}
            >
                {/* Template List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {loading ? <Loading /> : allTemplates.length === 0 ?
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column" }}>
                            <Typography textAlign="center" variant="h6">No templates found</Typography>
                            <Typography variant="body1">create template from Templates tab</Typography>
                        </Box> :
                        allTemplates.map((template) => (
                            <Box
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                sx={{
                                    p: 2,
                                    border:
                                        selectedTemplate?.id === template.id
                                            ? "2px solid #1976d2"
                                            : "1px solid #ddd",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    "&:hover": {
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <FlexBetween>
                                    <Typography variant="h6">
                                        {template.templateName}
                                    </Typography>
                                </FlexBetween>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={1}
                                >
                                    {template.templateSubject?.substring(0, 20)}...
                                </Typography>
                            </Box>
                        ))}
                </Box>

                {/* Editable Preview */}
                <Box
                    sx={{
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Message Preview
                    </Typography>

                    <TextField
                        multiline
                        minRows={18}
                        fullWidth
                        value={editableMessage}
                        onChange={(e) =>
                            setEditableMessage(e.target.value)
                        }
                        placeholder="Preview will appear here..."
                    />
                </Box>
            </Box>
        </StyledDialog>
    );
};

export default SelectTemplateDialog;
