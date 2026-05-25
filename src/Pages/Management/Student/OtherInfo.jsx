import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LayersIcon from "@mui/icons-material/Layers";

import StyledDialog from "../../../Components/New/StyledDialog";
import FlexBetween from "../../../Components/FlexBetween";
import { useUI } from "../../../context/UIContext";

// ─── helpers ────────────────────────────────────────────────────────────────

const createEmptyField = () => ({ key: "", value: "" });
const createEmptySection = () => ({ section: "", fields: [createEmptyField()] });

const parseData = (value) => {
    try {
        if (!value) return {};
        return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
        return {};
    }
};

const objectToSections = (obj) => {
    if (!obj || typeof obj !== "object") return [createEmptySection()];

    const sections = Object.entries(obj).map(([sectionName, values]) => ({
        section: sectionName,
        fields:
            typeof values === "object" && values !== null
                ? Object.entries(values).map(([key, value]) => ({ key, value: value ?? "" }))
                : [createEmptyField()],
    }));

    return sections.length > 0 ? sections : [createEmptySection()];
};

const sectionsToObject = (sections) => {
    const result = {};
    sections.forEach((section) => {
        if (!section.section?.trim()) return;
        const sectionData = {};
        section.fields.forEach((field) => {
            if (!field.key?.trim()) return;
            sectionData[field.key] = field.value;
        });
        if (Object.keys(sectionData).length > 0) {
            result[section.section] = sectionData;
        }
    });
    return result;
};

// ─── section badge count ─────────────────────────────────────────────────────

const getTotalFields = (parsedData) =>
    Object.values(parsedData).reduce(
        (acc, section) =>
            acc + (typeof section === "object" ? Object.keys(section).length : 0),
        0
    );

// ─── component ───────────────────────────────────────────────────────────────

const OtherInfo = ({ value, setValue, isEdit }) => {
    const { isEnabled, FEATURE_KEYS } = useUI();

    const [open, setOpen] = useState(false);

    // Draft state — only written to parent on confirm
    const [draft, setDraft] = useState([createEmptySection()]);

    const parsedData = useMemo(() => parseData(value), [value]);
    const totalFields = getTotalFields(parsedData);

    // Sync draft from saved value whenever the dialog opens
    const handleOpen = () => {
        setDraft(objectToSections(parsedData));
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        // draft is discarded – parent value unchanged
    };

    const handleConfirm = () => {
        const json = JSON.stringify(sectionsToObject(draft));
        setValue(json);
        setOpen(false);
    };

    // ── draft mutators ────────────────────────────────────────────────────────

    const addSection = () => setDraft((prev) => [...prev, createEmptySection()]);

    const removeSection = (si) =>
        setDraft((prev) => prev.filter((_, i) => i !== si));

    const updateSectionName = (si, val) =>
        setDraft((prev) =>
            prev.map((s, i) => (i === si ? { ...s, section: val } : s))
        );

    const addField = (si) =>
        setDraft((prev) =>
            prev.map((s, i) =>
                i === si ? { ...s, fields: [...s.fields, createEmptyField()] } : s
            )
        );

    const removeField = (si, fi) =>
        setDraft((prev) =>
            prev.map((s, i) =>
                i === si
                    ? { ...s, fields: s.fields.filter((_, idx) => idx !== fi) }
                    : s
            )
        );

    const updateField = (si, fi, key, val) =>
        setDraft((prev) =>
            prev.map((s, i) => {
                if (i !== si) return s;
                return {
                    ...s,
                    fields: s.fields.map((f, idx) =>
                        idx === fi ? { ...f, [key]: val } : f
                    ),
                };
            })
        );

    // ─────────────────────────────────────────────────────────────────────────

    if (!isEnabled(FEATURE_KEYS.ENROLMENT)) return null;

    const hasData = Object.keys(parsedData).length > 0;

    return (
        <>
            {/* ── Trigger button ── */}
            <Box>
                <Button
                    size="small"
                    variant={hasData ? "contained" : "outlined"}
                    startIcon={isEdit ? <EditNoteIcon /> : <InfoOutlinedIcon />}
                    onClick={handleOpen}
                    sx={{
                        m: 0,
                        p: .5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        ...(hasData && {
                            background: (t) =>
                                `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                            color: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }),
                    }}
                >
                    {isEdit ? "Manage Additional Info" : "Additional Info"}
                    {hasData && (
                        <Chip
                            label={totalFields}
                            size="small"
                            sx={{
                                ml: 1,
                                height: 18,
                                fontSize: 10,
                                fontWeight: 700,
                                bgcolor: "rgba(255,255,255,0.25)",
                                color: "white",
                                "& .MuiChip-label": { px: "6px" },
                            }}
                        />
                    )}
                </Button>
            </Box>

            {/* ── Dialog ── */}
            <StyledDialog
                open={open}
                onClose={handleCancel}
                title="Additional Information"
                titleBgColor="info"
                maxWidth="sm"
                onConfirm={isEdit ? handleConfirm : undefined}
                confirmText="Save Changes"
                cancelText={isEdit ? "Cancel" : "Close"}
            >
                {/* ── View mode: no data ── */}
                {!isEdit && !hasData && (
                    <Box
                        sx={{
                            py: 6,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            color: "text.disabled",
                        }}
                    >
                        <LayersIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                        <Typography variant="body2" color="text.secondary">
                            No additional information recorded yet.
                        </Typography>
                    </Box>
                )}

                {/* ── Sections ── */}
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {draft.map((section, si) => (
                        <Paper
                            key={si}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                border: "1.5px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                                transition: "box-shadow 0.2s",
                                "&:hover": {
                                    boxShadow: (t) =>
                                        `0 4px 20px ${t.palette.mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)"}`,
                                },
                            }}
                        >
                            {/* Section header */}
                            <FlexBetween sx={{ mb: 2 }}>
                                {isEdit ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Section Name"
                                        value={section.section}
                                        placeholder="e.g. Experience"
                                        onChange={(e) => updateSectionName(si, e.target.value)}
                                        sx={{ mr: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                    />
                                ) : (
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ letterSpacing: 0.3 }}
                                    >
                                        {section.section || "Untitled Section"}
                                    </Typography>
                                )}

                                {isEdit && (
                                    <Tooltip title="Remove section">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeSection(si)}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "error.light",
                                                borderRadius: 2,
                                            }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </FlexBetween>

                            {/* Fields */}
                            <Stack spacing={1.5}>
                                {section.fields.map((field, fi) =>
                                    isEdit ? (
                                        <Grid container spacing={1} alignItems="center" key={fi}>
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Label"
                                                    placeholder="e.g. Experience"
                                                    value={field.key}
                                                    onChange={(e) =>
                                                        updateField(si, fi, "key", e.target.value)
                                                    }
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={7}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Value"
                                                    placeholder="e.g. 2 years"
                                                    value={field.value}
                                                    onChange={(e) =>
                                                        updateField(si, fi, "value", e.target.value)
                                                    }
                                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
                                                <Tooltip title="Remove field">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeField(si, fi)}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Box
                                            key={fi}
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                bgcolor: "action.hover",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                color="text.secondary"
                                                sx={{ textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}
                                            >
                                                {field.key}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ wordBreak: "break-word", textAlign: "right" }}
                                            >
                                                {field.value || "—"}
                                            </Typography>
                                        </Box>
                                    )
                                )}
                            </Stack>

                            {/* Add field button */}
                            {isEdit && (
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => addField(si)}
                                    sx={{
                                        mt: 1.5,
                                        textTransform: "none",
                                        borderRadius: 2,
                                        fontSize: 12,
                                    }}
                                >
                                    Add Field
                                </Button>
                            )}
                        </Paper>
                    ))}
                </Stack>

                {/* Add section button */}
                {isEdit && (
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={addSection}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 600,
                                borderStyle: "dashed",
                                width: "100%",
                            }}
                        >
                            Add Section
                        </Button>
                    </Box>
                )}
            </StyledDialog>
        </>
    );
};

export default OtherInfo;
