import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import FlexBetween from "../../../Components/FlexBetween";
import { useUI } from "../../../context/UIContext";

const createEmptyField = () => ({
    key: "",
    value: "",
});

const createEmptySection = () => ({
    section: "",
    fields: [createEmptyField()],
});

const parseData = (value) => {
    try {
        if (!value) return {};

        if (typeof value === "string") {
            return JSON.parse(value);
        }

        return value;
    } catch {
        return {};
    }
};

const objectToSections = (obj) => {
    if (!obj || typeof obj !== "object") {
        return [createEmptySection()];
    }

    const sections = Object.entries(obj).map(([sectionName, values]) => ({
        section: sectionName,
        fields:
            typeof values === "object" && values !== null
                ? Object.entries(values).map(([key, value]) => ({
                    key,
                    value: value ?? "",
                }))
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

const OtherInfo = (props) => {
    const { value, setValue, isEdit } = props;
    debugger;
    const { isEnabled, FEATURE_KEYS } = useUI();
    console.log("props", props);

    const [open, setOpen] = useState(false);

    const parsedData = useMemo(() => {
        return parseData(value);
    }, [value]);

    const [sections, setSections] = useState(
        objectToSections(parsedData)
    );

    useEffect(() => {
        setSections(objectToSections(parsedData));
    }, [parsedData]);

    useEffect(() => {
        const json = JSON.stringify(
            sectionsToObject(sections)
        );

        setValue(json);
    }, [sections]);

    const addSection = () => {
        setSections((prev) => [
            ...prev,
            createEmptySection(),
        ]);
    };

    const removeSection = (sectionIndex) => {
        setSections((prev) =>
            prev.filter((_, i) => i !== sectionIndex)
        );
    };

    const updateSectionName = (sectionIndex, value) => {
        setSections((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        section: value,
                    }
                    : section
            )
        );
    };

    const addField = (sectionIndex) => {
        setSections((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        fields: [
                            ...section.fields,
                            createEmptyField(),
                        ],
                    }
                    : section
            )
        );
    };

    const removeField = (sectionIndex, fieldIndex) => {
        setSections((prev) =>
            prev.map((section, i) =>
                i === sectionIndex
                    ? {
                        ...section,
                        fields: section.fields.filter(
                            (_, idx) => idx !== fieldIndex
                        ),
                    }
                    : section
            )
        );
    };

    const updateField = (
        sectionIndex,
        fieldIndex,
        key,
        value
    ) => {
        setSections((prev) =>
            prev.map((section, i) => {
                if (i !== sectionIndex) return section;

                return {
                    ...section,
                    fields: section.fields.map((field, idx) =>
                        idx === fieldIndex
                            ? {
                                ...field,
                                [key]: value,
                            }
                            : field
                    ),
                };
            })
        );
    };

    const hasData = Object.keys(parsedData || {}).length > 0;

    if (!isEnabled(FEATURE_KEYS.ENROLMENT)) {
        return null;
    }

    return (
        <>
            <FlexBetween>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<InfoOutlinedIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    {isEdit
                        ? "Manage Additional Info"
                        : "Additional Info"}
                </Button>
            </FlexBetween>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 700,
                    }}
                >
                    Additional Information

                    <IconButton
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {!isEdit && !hasData && (
                        <Typography>
                            No information available
                        </Typography>
                    )}

                    {sections.map((section, sectionIndex) => (
                        <Paper
                            key={sectionIndex}
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <FlexBetween>
                                {isEdit ? (
                                    <TextField
                                        fullWidth
                                        label="Section Name"
                                        value={section.section}
                                        onChange={(e) =>
                                            updateSectionName(
                                                sectionIndex,
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {section.section}
                                    </Typography>
                                )}

                                {isEdit && (
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            removeSection(
                                                sectionIndex
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </FlexBetween>

                            <Grid
                                container
                                spacing={2}
                                sx={{ mt: 1 }}
                            >
                                {section.fields.map(
                                    (item, fieldIndex) => (
                                        <Grid
                                            item
                                            xs={12}
                                            key={fieldIndex}
                                        >
                                            {isEdit ? (
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    alignItems="center"
                                                >
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={4}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Key"
                                                            value={
                                                                item.key
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateField(
                                                                    sectionIndex,
                                                                    fieldIndex,
                                                                    "key",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={7}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Value"
                                                            value={
                                                                item.value
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateField(
                                                                    sectionIndex,
                                                                    fieldIndex,
                                                                    "value",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={1}
                                                    >
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                removeField(
                                                                    sectionIndex,
                                                                    fieldIndex
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            textTransform:
                                                                "uppercase",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {item.key}
                                                    </Typography>

                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            mt: 1,
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    )
                                )}
                            </Grid>

                            {isEdit && (
                                <Button
                                    startIcon={<AddIcon />}
                                    sx={{ mt: 2 }}
                                    onClick={() =>
                                        addField(sectionIndex)
                                    }
                                >
                                    Add Field
                                </Button>
                            )}
                        </Paper>
                    ))}

                    {isEdit && (
                        <>
                            <Divider sx={{ mb: 2 }} />

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={addSection}
                            >
                                Add Section
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default OtherInfo;
