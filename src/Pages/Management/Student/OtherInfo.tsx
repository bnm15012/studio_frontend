import React, { useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import Field from "@/core/components/fields/Field";
import { FieldLabel } from "@/core/components/fields/StyledField";
import { useAppUI } from "@/context/UIContext";

const FORM_SECTIONS = [
    {
        title: "Parent Information",
        fields: [
            {
                name: "parentName",
                label: "Parent Name",
                type: "text",
            },
            {
                name: "parentPhone",
                label: "Parent Phone",
                type: "text",
            },
            {
                name: "parentAddress",
                label: "Parent Address",
                type: "textarea",
            },
            {
                name: "parentRelation",
                label: "Parent Relation",
                type: "text",
            },
        ],
    },
    {
        title: "Other Information",
        fields: [
            {
                name: "anyPastExperience",
                label: "Any Past Experience",
                type: "textarea",
            },
            {
                name: "whereYouHereAboutUs",
                label: "How You Heard About Us",
                type: "text",
            },
            {
                name: "hobbiesInterests",
                label: "Hobbies & Interests",
                type: "textarea",
            },
        ],
    },
    {
        title: "Medical Information",
        fields: [
            {
                name: "medicalInfo",
                label: "Medical Notes",
                type: "textarea",
            },
        ],
    },
];

const EMPTY_DATA: Record<string, string> = {
    parentName: "",
    parentPhone: "",
    parentAddress: "",
    parentRelation: "",
    anyPastExperience: "",
    whereYouHereAboutUs: "",
    hobbiesInterests: "",
    medicalInfo: "",
};

const parseValue = (value: unknown) => {
    try {
        if (!value) return EMPTY_DATA;

        const parsed = typeof value === "string" ? JSON.parse(value) : value;

        return {
            ...EMPTY_DATA,
            ...parsed,
        };
    } catch {
        return EMPTY_DATA;
    }
};

const getFilledCount = (data: Record<string, string>) =>
    Object.values(data).filter((value) => value !== null && value !== undefined && value !== "")
        .length;

interface OtherInfoProps {
    value: unknown;
    setValue: (val: string) => void;
    isEdit?: boolean;
}

const OtherInfo: React.FC<OtherInfoProps> = ({ value, setValue, isEdit }) => {
    const { permissions } = useAppUI();

    const parsedValue = useMemo(() => parseValue(value), [value]);

    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState<Record<string, string>>(parsedValue);

    const filledCount = getFilledCount(parsedValue);

    const hasData = filledCount > 0;

    const handleOpen = () => {
        setFormData(parseValue(value));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (fieldName: string, fieldValue: unknown) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: String(fieldValue ?? ""),
        }));
    };

    const handleSave = () => {
        setValue(JSON.stringify(formData));
        setOpen(false);
    };

    if (!permissions.ENROLMENT) {
        return null;
    }

    return (
        <>
            <Box>
                <Button
                    size="small"
                    onClick={handleOpen}
                    variant={hasData ? "contained" : "outlined"}
                    startIcon={isEdit ? <EditNoteIcon /> : <InfoOutlinedIcon />}
                    sx={{
                        m: 0,
                        p: 0.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        ...(hasData && {
                            color: "white",
                            background: (theme) =>
                                `linear-gradient(
                                    135deg,
                                    ${theme.palette.primary.main},
                                    ${theme.palette.primary.dark}
                                )`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }),
                    }}
                >
                    {isEdit ? "Manage Additional Info" : "Additional Info"}

                    {hasData && (
                        <Chip
                            size="small"
                            label={filledCount}
                            sx={{
                                ml: 1,
                                height: 18,
                                fontSize: 10,
                                fontWeight: 700,
                                bgcolor: "rgba(255,255,255,0.25)",
                                color: "white",
                                "& .MuiChip-label": {
                                    px: "6px",
                                },
                            }}
                        />
                    )}
                </Button>
            </Box>

            <StyledDialog
                open={open}
                onClose={handleClose}
                closeIcon
                maxWidth="md"
                title="Additional Information"
                titleBgColor="info"
                onConfirm={isEdit ? handleSave : undefined}
                confirmText="Save"
                cancelText={isEdit ? "Cancel" : "Close"}
            >
                <Stack spacing={3} mt={1}>
                    {FORM_SECTIONS.map((section) => (
                        <Paper
                            key={section.title}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={700} mb={2}>
                                {section.title}
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                {section.fields.map((field) => (
                                    <FlexBetween key={field.name} gap={2}>
                                        <FieldLabel
                                            sx={{
                                                minWidth: 250,
                                                m: "auto",
                                            }}
                                        >
                                            {field.label}
                                        </FieldLabel>

                                        <Box width="100%" m={"auto"}>
                                            <Field
                                                type={field.type}
                                                value={formData[field.name] || ""}
                                                isEdit={isEdit ?? false}
                                                setValue={(value) =>
                                                    handleChange(field.name, value)
                                                }
                                            />
                                        </Box>
                                    </FlexBetween>
                                ))}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </StyledDialog>
        </>
    );
};

export default OtherInfo;
