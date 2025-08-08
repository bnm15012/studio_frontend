import { useState, useEffect } from "react";
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
  Table,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import FlexBetween from "../../../Components/FlexBetween";
import { StyledTableCell, StyledTableContainer, StyledTableRow } from "../../../Components/StyledTableComponents";
import { useSelector } from "react-redux";
import { addTemplateAPI, deleteTemplateAPI, updateTemplateAPI, getAllTemplatesAPI } from "./Template.api";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import DeleteDialog from "../../../Components/DeleteDialog";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch) || {};
  const showAlert = useAlert();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const allActivities = useSelector((state) => state.activity.activities)?.map(x => x.activityType) || [];

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
        entityType: "",
        description: "",
        activityType: "",
        templateName: "",
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
    if (!currentTemplate.entityType) {
      showAlert("Entity Type is required", "warning");
      return;
    }
    if (!currentTemplate.activityType) {
      showAlert("Activity Type is required", "warning");
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
      <FlexBetween flexDirection={"row-reverse"}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Template
        </Button>
      </FlexBetween>
      <StyledTableContainer>
        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Template Name</StyledTableCell>
              <StyledTableCell>Entity Type</StyledTableCell>
              <StyledTableCell>Activity Type</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <StyledTableCell>{t.templateName}</StyledTableCell>
                <StyledTableCell>{t.entityType}</StyledTableCell>
                <StyledTableCell>{t.activityType}</StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", maxHeight: "10rem", overflowY: "auto", maxWidth: "50rem" }}>
                    {t.description}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <FlexBetween>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(t)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setCurrentTemplate(t) || setDeleteDialogOpen(true)}
                    >
                      <Delete />
                    </IconButton>
                  </FlexBetween>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          <TextField
            sx={{ mt: 2 }}
            label="Entity Type"
            value={currentTemplate?.entityType || ""}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, entityType: e.target.value })
            }
            fullWidth
          />
          <Select
            value={currentTemplate?.activityType || ""}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, activityType: e.target.value })
            }
            fullWidth
            displayEmpty
          >
            {
              allActivities.map((activity) => (
                <MenuItem key={activity} value={activity}>
                  {activity}
                </MenuItem>
              ))
            }
          </Select>
          <TextField
            label="Description"
            multiline
            rows={8}
            value={currentTemplate?.description || ""}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, description: e.target.value })
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
