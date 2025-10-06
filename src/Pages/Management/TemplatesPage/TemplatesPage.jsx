import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Paper,
    TableHead,
    TableBody,
    Collapse,
    IconButton,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlexBetween from "../../../Components/FlexBetween";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../Components/StyledTableComponents";
import { useSelector } from "react-redux";
import {
    addTemplateAPI,
    deleteTemplateAPI,
    updateTemplateAPI,
    getAllTemplatesAPI,
} from "./Template.api";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import DeleteDialog from "../../../Components/DeleteDialog";
import { ArrowDown, ArrowUp } from "lucide-react";
import PropTypes from "prop-types";
import TemplateEditor from "./TemplateEditor";
import StyledDialog from "../../../Components/New/StyledDialog";

const templateTypes = new Set(["COMMUNICATION", "BOOKING"]);

const ExpandedRow = ({ isExpanded, description }) => (
    <StyledTableRow>
        <StyledTableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, backgroundColor: "#f9f9f9", borderRadius: 1, padding: 2 }}>
                    <Typography sx={{ whiteSpace: "pre-wrap", maxWidth: "100%" }}>
                        {description || <i>No description available.</i>}
                    </Typography>
                </Box>
            </Collapse>
        </StyledTableCell>
    </StyledTableRow>
);

ExpandedRow.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    description: PropTypes.string,
};

const TemplatesPage = () => {
    useSelector((state) => state.activity.activities)?.map((x) =>
        templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType),
    ) || [];
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);
    const studio = useSelector((state) => state.auth.studio);

    const [templates, setTemplates] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Load templates on mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await getAllTemplatesAPI({ studioId: studio.studioId, token });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || "Failed to load templates", "error");
                }
            } catch {
                showAlert("Error loading templates", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [showAlert, studio.studioId, token]);

    const handleOpen = (template = null) => {
        setCurrentTemplate(
            template || {
                id: null,
                templateType: templateTypes[0],
                templateName: "",
                templateSubject: "",
                templateContent: "",
                studioId: studio.studioId,
            },
        );
        setIsEditMode(!!template);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setCurrentTemplate(null);
        setIsEditMode(false);
    };

    const handleSave = async () => {
        if (!currentTemplate.templateName?.trim()) {
            showAlert("Template Name is required", "warning");
            return;
        }
        if (!currentTemplate.templateSubject) {
            showAlert("Template SUbject is required", "warning");
            return;
        }
        if (!currentTemplate.templateType) {
            showAlert("Template Type is required", "warning");
            return;
        }
        setLoading(true);
        try {
            if (isEditMode) {
                const res = await updateTemplateAPI({ templateNewData: currentTemplate, token });
                if (res.success) {
                    setTemplates((prev) =>
                        prev.map((t) => (t.id === currentTemplate.id ? res.data : t)),
                    );
                    showAlert("Template updated successfully", "success");
                    handleClose();
                } else {
                    showAlert(res.message || "Failed to update template", "error");
                }
            } else {
                const res = await addTemplateAPI({ templateData: currentTemplate, token });
                if (res.success) {
                    setTemplates((prev) => [...prev, res.data]);
                    showAlert("Template added successfully", "success");
                    handleClose();
                } else {
                    showAlert(res.message || "Failed to add template", "error");
                }
            }
        } catch {
            showAlert("Error saving template", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await deleteTemplateAPI({ templateId: id, token });
            if (res.success) {
                setTemplates((prev) => prev.filter((t) => t.id !== id));
                showAlert("Template deleted successfully", "success");
            } else {
                showAlert(res.message || "Failed to delete template", "error");
            }
        } catch {
            showAlert("Error deleting template", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <FlexBetween paddingBottom={2} flexDirection={"row-reverse"}>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    Add Template
                </Button>
            </FlexBetween>
            <StyledTableContainer component={Paper}>
                <StyledTable>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>S. No</StyledTableCell>
                            <StyledTableCell>Type</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell width={"40%"}>Content</StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {templates.map((t, index) => {
                            const isExpanded = expandedId === t.id;
                            return (
                                <React.Fragment key={t.id}>
                                    {/* Summary Row */}
                                    <StyledTableRow>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell>{t.templateType}</StyledTableCell>
                                        <StyledTableCell>{t.templateName}</StyledTableCell>
                                        <StyledTableCell>{t.templateSubject}</StyledTableCell>
                                        <StyledTableCell
                                            sx={{ width: "30%", wordBreak: "break-word" }}
                                            e
                                        >
                                            {t.templateContent?.length > 100
                                                ? t.templateContent.slice(0, 100) + "..."
                                                : t.templateContent || <i>No description</i>}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <FlexBetween>
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent row toggle when clicking edit
                                                        handleOpen(t);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => toggleExpand(t.id)}
                                                >
                                                    {expandedId === t.id ? (
                                                        <ArrowUp />
                                                    ) : (
                                                        <ArrowDown />
                                                    )}
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent row toggle when clicking delete
                                                        setCurrentTemplate(t);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </FlexBetween>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <ExpandedRow
                                        isExpanded={isExpanded}
                                        description={t.templateContent}
                                    />
                                </React.Fragment>
                            );
                        })}
                        {templates.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        No templates available
                                    </Typography>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : null}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>

            {/* Add/Edit Dialog */}
            <StyledDialog
                open={openDialog}
                onClose={handleClose}
                title={isEditMode ? "Edit Template" : "Add Template"}
                confirmText={isEditMode ? "Update" : "Save"}
                cancelText="Cancel"
                onConfirm={handleSave}
                maxWidth="md"
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, p: 2 }}>
                    <TextField
                        label="Template Name"
                        value={currentTemplate?.templateName || ""}
                        onChange={(e) =>
                            setCurrentTemplate({ ...currentTemplate, templateName: e.target.value })
                        }
                        fullWidth
                    />
                    <Select
                        value={currentTemplate?.templateType || ""}
                        onChange={(e) =>
                            setCurrentTemplate({ ...currentTemplate, templateType: e.target.value })
                        }
                        fullWidth
                        displayEmpty
                    >
                        {[...templateTypes].map((templateType) => (
                            <MenuItem key={templateType} value={templateType}>
                                {templateType}
                            </MenuItem>
                        ))}
                    </Select>
                    <TemplateEditor
                        disableVars={currentTemplate?.templateType === "COMMUNICATION"}
                        label="Subject"
                        value={currentTemplate?.templateSubject || ""}
                        onChange={(val) =>
                            setCurrentTemplate({ ...currentTemplate, templateSubject: val })
                        }
                    />
                    <TemplateEditor
                        rows={8}
                        disableVars={currentTemplate?.templateType === "COMMUNICATION"}
                        label="Content"
                        value={currentTemplate?.templateContent || ""}
                        onChange={(val) =>
                            setCurrentTemplate({ ...currentTemplate, templateContent: val })
                        }
                    />
                </Box>
            </StyledDialog>
            {loading && <Loading />}
            {deleteDialogOpen && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    displayData={currentTemplate?.templateName || "Template"}
                    id={currentTemplate?.id || null}
                />
            )}
        </Box>
    );
};

export default TemplatesPage;
