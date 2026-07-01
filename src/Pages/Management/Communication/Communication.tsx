import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    TextField,
    Grid,
    Divider,
    useTheme,
} from "@mui/material";
import MultiSelectDialog from "../../../core/components/dialogs/MultiSelectDialog";
import { getStudentNamesAPI } from "../Student/Student.api";
import { FlexBetween } from "../../../core/components/layout/FlexBox";
import Loading from "../../../core/components/loading/Loading";
import { useAlert } from "../../../core/components/feedback/Alert";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { getInstructorNamesAPI } from "../Instructor/Instructor.api";
import SentSMSHistory from "./SentSMSHistory";
import { sendMessageApi } from "./communication.api";
import { getAllTemplatesAPI } from "../TemplatesPage/Template.api";
import { useUI } from "../../../context/UIContext";

const MAIL_TYPE = ["EMAIL"];

const audienceTypes = [
    { value: "all", label: "Everyone" },
    {},
    { value: "allStudents", label: "All Students" },
    { value: "selectedStudents", label: "Selected Students" },
    { value: "allInstructors", label: "All Instructors" },
    { value: "selectedInstructors", label: "Selected Instructors" },
];

const initialTemplate = {
    id: 0,
    notificationType: MAIL_TYPE[0],
    title: "",
    content: "",
    templateName: "CUSTOM",
};

const Communication = () => {
    const theme = useTheme();
    const { isMobile } = useUI();
    const token = useSelector((state: any) => state.auth.token);
    const studio = useSelector((state: any) => state.auth.studio);
    const currentBranch = useSelector((state: any) => state.branch.currentBranch);
    const showAlert = useAlert();

    const [open, setOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(0);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [audienceType, setAudienceType] = useState("all");
    const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
    const [newHistory, setNewHistory] = useState();

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await getAllTemplatesAPI({
                studioId: studio.studioId,
                token,
                templateType: "COMMUNICATION",
            });
            if (res.success) {
                setTemplates((prevTemplates) => {
                    const prevMaxId = Math.max(
                        ...prevTemplates.map((t) => t.id || 0),
                        initialTemplate.id || 0,
                    );
                    let nextId = prevMaxId + 1;
                    const processedData = (res?.data || []).map((template) => {
                        if (!template.id) {
                            return { ...template, id: nextId++ };
                        }
                        return template;
                    });
                    return [initialTemplate, ...processedData];
                });
            } else {
                showAlert(res.message || "Failed to load templates", "error");
            }
        } catch {
            showAlert("Error loading templates", "error");
        }
    }, [studio.studioId, token, showAlert]);

    useEffect(() => {
        fetchTemplates();
    }, [studio.studioId, fetchTemplates, showAlert, token]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            setSelectedTemplateId(templates[0].id);
        }
    }, [templates, selectedTemplateId]);

    const getAllStudentNames = async (page, size) => {
        try {
            const { data, totalCount } = await getStudentNamesAPI({
                token,
                branchId: currentBranch.branchId,
                page,
                size,
            });
            return { data: data || [], totalCount: totalCount || 0 };
        } catch (error: any) {
            console.error("Failed to fetch student names:", error);
            showAlert("Failed to fetch student names", "error");
            return { data: [], totalCount: 0 };
        }
    };
    const getAllInstructorNames = async (page, size) => {
        try {
            const { data, totalCount } = await getInstructorNamesAPI({
                token,
                branchId: currentBranch.branchId,
                page,
                size,
            });
            return { data: data || [], totalCount: totalCount || 0 };
        } catch (error: any) {
            console.error("Failed to fetch student names:", error);
            showAlert("Failed to fetch student names", "error");
            return { data: [], totalCount: 0 };
        }
    };

    const sendMail = async () => {
        if (
            !selectedTemplate.title ||
            !selectedTemplate.content ||
            !selectedTemplate.notificationType
        ) {
            showAlert("Please fill the title, mail type and content.", "error");
            return;
        }

        if (
            (audienceType === "selectedStudents" && selectedStudents.length === 0) ||
            (audienceType === "selectedInstructors" && selectedInstructors.length === 0)
        ) {
            showAlert("Please select recipients.", "error");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                branchId: currentBranch.branchId,
                notificationType: selectedTemplate.notificationType,
                title: selectedTemplate.title,
                content: selectedTemplate.content,
                memberType:
                    audienceType === "all"
                        ? "ALL"
                        : audienceType === "allStudents"
                            ? "STUDENT"
                            : audienceType === "allInstructors"
                                ? "INSTRUCTOR"
                                : null,
                memberIds:
                    audienceType === "selectedStudents"
                        ? selectedStudents.map((s) => s.studentId)
                        : audienceType === "selectedInstructors"
                            ? selectedInstructors.map((i) => i.studentId)
                            : [],
            };

            const response = await sendMessageApi({ token, payload, page: 1, size: 3 });

            if (response.success) {
                showAlert(response.message, "success");
                setSelectedTemplate(initialTemplate);
                setSelectedTemplateId("");
                setSelectedStudents([]);
                setSelectedInstructors([]);
                setAudienceType("all");
                setNewHistory(response.data);
            } else {
                showAlert(response.message, "error");
            }
        } catch (error: any) {
            console.error("Failed to send message:", error);
            showAlert("Failed to send message", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FlexBetweenColumn sx={{ width: "100%" }}>
            {loading && <Loading />}
            <FlexBetween flexDirection={isMobile ? "column" : "row"} gap={1} width={"100%"}>
                {/* Left Panel */}
                <FlexBetweenColumn
                    width={"100%"}
                    sx={{
                        p: 2,
                        gap: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
                        borderRadius: "8px",
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Title
                        </Typography>
                        <TextField
                            variant="outlined"
                            sx={{
                                "& .MuiInputBase-root": {
                                    padding: 0.5,
                                },
                                "& .MuiInputBase-input": {
                                    padding: 0,
                                },
                            }}
                            fullWidth
                            value={selectedTemplate.title}
                            onChange={(e) =>
                                setSelectedTemplate((prev) => ({ ...prev, title: e.target.value }))
                            }
                        />
                    </Box>

                    <FlexBetween gap={2} width="100%" flexWrap={isMobile ? "wrap" : "nowrap"}>
                        <FormControl fullWidth>
                            <Typography variant="h6" fontWeight="bold">
                                Mail Type
                            </Typography>
                            <Select
                                value={selectedTemplate.notificationType}
                                sx={{
                                    "& .MuiInputBase-root": {
                                        padding: 1,
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: 1,
                                    },
                                }}
                                onChange={(e) =>
                                    setSelectedTemplate((prev) => ({
                                        ...prev,
                                        notificationType: e.target.value,
                                    }))
                                }
                            >
                                {MAIL_TYPE.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <Typography variant="h6" fontWeight="bold">
                                Select Template
                            </Typography>
                            {templates.length > 0 && (
                                <Select
                                    value={selectedTemplateId}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            padding: 1,
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: 1,
                                        },
                                    }}
                                    onChange={(e) => {
                                        const template = templates.find(
                                            (t) => t.id === e.target.value,
                                        );
                                        setSelectedTemplateId(e.target.value);
                                        if (template) {
                                            setSelectedTemplate({
                                                ...selectedTemplate,
                                                title: template.templateSubject || "",
                                                content: template.templateContent || "",
                                            });
                                        }
                                    }}
                                >
                                    {templates.map((template) => (
                                        <MenuItem key={template.id} value={template.id}>
                                            {template.templateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </FormControl>
                    </FlexBetween>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Content
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            sx={{
                                "& .MuiInputBase-root": {
                                    padding: 1,
                                },
                                "& .MuiInputBase-input": {
                                    padding: 0,
                                },
                            }}
                            rows={3}
                            value={selectedTemplate.content}
                            onChange={(e) =>
                                setSelectedTemplate((prev) => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                        />
                    </Box>
                    <FlexBetween flexDirection={isMobile ? "column" : "row"} gap={2} width="100%">
                        <FormControl component="fieldset">
                            <Typography variant="h6" fontWeight="bold">
                                Recipients
                            </Typography>
                            <RadioGroup
                                value={audienceType}
                                onChange={(e) => {
                                    setAudienceType(e.target.value);
                                    if (
                                        ["selectedStudents", "selectedInstructors"].includes(
                                            e.target.value,
                                        )
                                    ) {
                                        setOpen(true);
                                    }
                                }}
                            >
                                <Grid container>
                                    {audienceTypes.map((type) => (
                                        <Grid item xs={6} key={type}>
                                            {type.value && (
                                                <FormControlLabel
                                                    key={type.value}
                                                    value={type.value}
                                                    control={<Radio />}
                                                    label={type.label}
                                                />
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                        {(audienceType === "selectedStudents" ||
                            audienceType === "selectedInstructors") && (
                                <FlexBetweenColumn
                                    flexGrow={1}
                                    border={"1px solid rgba(0,0,0,0.2)"}
                                    p={1}
                                    borderRadius={"10px"}
                                    gap={1}
                                >
                                    <Box
                                        height={"12vh"}
                                        sx={{ overflow: "auto", borderRadius: "10px" }}
                                    >
                                        {(audienceType === "selectedStudents"
                                            ? selectedStudents
                                            : selectedInstructors
                                        ).length > 0 ? (
                                            (audienceType === "selectedStudents"
                                                ? selectedStudents
                                                : selectedInstructors
                                            ).map((user) => (
                                                <Box key={user.studentId}>
                                                    <Typography>{user.name}</Typography>
                                                    <Divider />
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography>
                                                No{" "}
                                                {audienceType === "selectedStudents"
                                                    ? "students"
                                                    : "instructors"}{" "}
                                                selected.
                                            </Typography>
                                        )}
                                    </Box>

                                    <FlexBetween gap={2}>
                                        <Button variant="contained" onClick={() => setOpen(true)}>
                                            Add
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            disabled={
                                                (audienceType === "selectedStudents" &&
                                                    selectedStudents.length === 0) ||
                                                (audienceType === "selectedInstructors" &&
                                                    selectedInstructors.length === 0)
                                            }
                                            onClick={() =>
                                                audienceType === "selectedStudents"
                                                    ? setSelectedStudents([])
                                                    : setSelectedInstructors([])
                                            }
                                        >
                                            Clear
                                        </Button>
                                    </FlexBetween>
                                </FlexBetweenColumn>
                            )}
                    </FlexBetween>
                </FlexBetweenColumn>

                {/* Right Panel */}
                <FlexBetweenColumn width={isMobile ? "100%" : "50rem"} gap={1}>
                    <Box
                        sx={{
                            height: "100%",
                            p: 2,
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: theme.shadows[7],
                            borderRadius: "8px",
                        }}
                    >
                        <FlexBetween py={1}>
                            <Typography variant="h5" fontWeight="bold">
                                Preview
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={sendMail}
                                sx={{ p: 0.5 }}
                            >
                                Send
                            </Button>
                        </FlexBetween>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ overflowY: "auto", height: "45vh" }}>
                            {selectedTemplate.title || selectedTemplate.content ? (
                                <>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Title:
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedTemplate.title}
                                    </Typography>

                                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                                        Body:
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                        {selectedTemplate.content}
                                    </Typography>
                                </>
                            ) : (
                                <Typography color="textSecondary">No Template Selected</Typography>
                            )}
                        </Box>
                    </Box>
                </FlexBetweenColumn>
            </FlexBetween>
            <SentSMSHistory newHistory={newHistory} />
            {open && (
                <MultiSelectDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fetchOptions={
                        audienceType === "selectedStudents"
                            ? getAllStudentNames
                            : getAllInstructorNames
                    }
                    data={
                        audienceType === "selectedStudents" ? selectedStudents : selectedInstructors
                    }
                    setData={
                        audienceType === "selectedStudents"
                            ? setSelectedStudents
                            : setSelectedInstructors
                    }
                    valueKey="studentId"
                    labelKey="name"
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Communication;
