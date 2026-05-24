import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    Divider,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FlexBetween from "../../../Components/FlexBetween";
import { useUI } from "../../../context/UIContext";

const FIELD_CONFIG = [
    {
        section: "Parent Details",
        fields: [
            { key: "parentName", label: "Parent Name" },
            { key: "parentPhone", label: "Parent Phone" },
            { key: "parentAddress", label: "Parent Address" },
            { key: "parentRelation", label: "Parent Relation" },
        ],
    },
    {
        section: "Other Details",
        fields: [
            { key: "anyPastExperience", label: "Past Experience" },
            { key: "whereYouHereAboutUs", label: "How You Heard About Us" },
            { key: "hobbiesInterests", label: "Hobbies & Interests" },
            { key: "medicalInfo", label: "Medical Information" },
        ],
    },
];

const OtherInfo = ({ data }) => {
    const [open, setOpen] = useState(false);
    const { isEnabled, FEATURE_KEYS } = useUI();

    const parsedData = useMemo(() => {
        if (!data) return {};

        try {
            return typeof data === "string"
                ? JSON.parse(data)
                : data;
        } catch {
            return {};
        }
    }, [data]);

    const hasData = Object.values(parsedData).some(
        (v) => v !== null && v !== undefined && v !== ""
    );

    if (!hasData) return null;

    return (<>
        {isEnabled(FEATURE_KEYS.ENROLMENT) && (
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
                    Additional Info
                </Button>

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

                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        {FIELD_CONFIG.map((section) => {
                            const visibleFields = section.fields.filter(
                                ({ key }) =>
                                    parsedData[key] !== null &&
                                    parsedData[key] !== undefined &&
                                    parsedData[key] !== ""
                            );

                            if (visibleFields.length === 0) {
                                return <Box key={section.section} sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {section.section}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 1,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        No information available
                                    </Typography>

                                </Box>;
                            }

                            return (
                                <Box key={section.section} sx={{ mb: 4 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {section.section}
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {visibleFields.map(({ key, label }) => (
                                            <Grid item xs={12} sm={6} key={key}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            textTransform: "uppercase",
                                                            fontWeight: 700,
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        {label}
                                                    </Typography>

                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            mt: 1,
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        {parsedData[key]}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Divider sx={{ mt: 3 }} />
                                </Box>
                            );
                        })}
                    </DialogContent>
                </Dialog>
            </FlexBetween>
        )}
    </>
    );
};

export default OtherInfo;
