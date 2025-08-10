import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Paper,
  TableHead,
  TableBody,
  IconButton,
  Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import FlexBetween from "../../../Components/FlexBetween";
import { StyledTable, StyledTableCell, StyledTableContainer, StyledTableRow } from "../../../Components/StyledTableComponents";
import { useSelector } from "react-redux";
import { addTemplateAPI, deleteTemplateAPI, updateTemplateAPI, getAllTemplatesAPI } from "./Template.api";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import DeleteDialog from "../../../Components/DeleteDialog";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Collapse } from '@mui/material';
import PropTypes from "prop-types";

const templateTypes = new Set(["COMMUNICATION"]);

const ExpandedRow = ({ isExpanded, description }) => (
  <StyledTableRow>
    <StyledTableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1, backgroundColor: "#f9f9f9", borderRadius: 1, padding: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Full Content:
          </Typography>
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
  useSelector((state) => state.activity.activities)?.map(x => templateTypes.add("INSTRUCTOR_CONTRACT_" + x.activityType)) || [];
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch) || {};

  const [templates, setTemplates] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
        const res = await getAllTemplatesAPI({ branchId: currentBranch.branchId, token });
        if (res.success) {
          setTemplates(res.data || []);
        } else {
          showAlert(res.message || "Failed to load templates", "error");
        }
      } catch {
        showAlert("Error loading templates", "error");
      }
    };
    fetchTemplates();
  }, [currentBranch.branchId, showAlert, token]);

  const handleOpen = (template = null) => {
    setCurrentTemplate(
      template || {
        id: null,
        templateType: templateTypes[0],
        templateName: "",
        templateSubject: "",
        templateContent: "",
        branchId: currentBranch.branchId,
      }
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
            prev.map((t) =>
              t.id === currentTemplate.id ? res.data : t
            )
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
                  <StyledTableRow                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{t.templateType}</StyledTableCell>
                    <StyledTableCell>{t.templateName}</StyledTableCell>
                    <StyledTableCell>{t.templateSubject}</StyledTableCell>
                    <StyledTableCell
                      sx={{ width: "30%", wordBreak: "break-word" }} e>
                      {t.templateContent?.length > 100 ? t.templateContent.slice(0, 100) + "..." : t.templateContent || <i>No description</i>}
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
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => toggleExpand(t.id)}
                        >
                          {expandedId === t.id ?
                            <ArrowUp />
                            :
                            <ArrowDown />
                          }
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row toggle when clicking delete
                            setCurrentTemplate(t);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </FlexBetween>
                    </StyledTableCell>
                  </StyledTableRow>
                  <ExpandedRow isExpanded={isExpanded} description={t.templateContent} />
                </React.Fragment>
              );
            })}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEditMode ? "Edit Template" : "Add Template"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, p: 2 }}>
          <TextField
            sx={{ mt: 2 }}
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
            {
              [...templateTypes].map((templateType) => (
                <MenuItem key={templateType} value={templateType}>
                  {templateType}
                </MenuItem>
              ))
            }
          </Select>
          <TextField
            label="Subject"
            rows={8}
            value={currentTemplate?.templateSubject || ""}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, templateSubject: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Content"
            multiline
            rows={8}
            value={currentTemplate?.templateContent || ""}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, templateContent: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEditMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      {loading && <Loading />}
      {deleteDialogOpen && <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        displayData={currentTemplate?.templateName || "Template"}
        id={currentTemplate?.id || null}
      />}
    </Box>
  );
};

export default TemplatesPage;
