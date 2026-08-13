import React, { useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import Field from "@/core/components/fields/Field";
import { FieldLabel } from "@/core/components/fields/StyledField";
import { useAppUI } from "@/context/UIContext";

import { FieldValue } from "@/core/types";

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

const parseValue = (value: FieldValue) => {
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
    value?: FieldValue;
    setValue?: (val: FieldValue) => void;
    isEdit?: boolean;
}

const OtherInfo: React.FC<OtherInfoProps> = ({ value, setValue, isEdit }) => {
    const { permissions, isMobile } = useAppUI();

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

    const handleChange = (fieldName: string, fieldValue: FieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: String(fieldValue ?? ""),
        }));
    };

    const handleSave = () => {
        setValue?.(JSON.stringify(formData));
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

            {(() => {
                const dialogProps: React.ComponentProps<typeof StyledDialog> = {
                    open,
                    onClose: handleClose,
                    closeIcon: true,
                    maxWidth: "md",
                    fullScreen: isMobile,
                    title: "Additional Information",
                    titleBgColor: "info",
                    confirmText: isEdit ? "Save" : "Close",
                    cancelText: "Cancel",
                };
                if (isEdit) {
                    dialogProps.onConfirm = handleSave;
                }
                return (
                    <StyledDialog {...dialogProps}>
                        <Stack spacing={isMobile ? 1.5 : 2.5} mt={1}>
                            {FORM_SECTIONS.map((section) => (
                                <Paper
                                    key={section.title}
                                    elevation={0}
                                    sx={{
                                        p: isMobile ? 1.5 : 2.5,
                                        borderRadius: 2.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        mb={1.5}
                                        sx={{ fontSize: isMobile ? 14 : 16 }}
                                    >
                                        {section.title}
                                    </Typography>

                                    <Divider sx={{ mb: 1.5 }} />

                                    <Stack spacing={isMobile ? 1.5 : 2}>
                                        {section.fields.map((field) => (
                                            <Box
                                                key={field.name}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isMobile ? "column" : "row",
                                                    gap: isMobile ? 0.5 : 2,
                                                    alignItems: isMobile ? "flex-start" : "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <FieldLabel
                                                    sx={{
                                                        flexShrink: 0,
                                                        minWidth: isMobile ? "auto" : 200,
                                                        width: isMobile ? "100%" : "auto",
                                                        fontSize: isMobile ? 13 : 14,
                                                    }}
                                                >
                                                    {field.label}
                                                </FieldLabel>

                                                <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                                                    <Field
                                                        type={field.type}
                                                        value={formData[field.name] || ""}
                                                        isEdit={isEdit ?? false}
                                                        setValue={(value) =>
                                                            handleChange(field.name, value)
                                                        }
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </StyledDialog>
                );
            })()}
        </>
    );
};

export default OtherInfo;
