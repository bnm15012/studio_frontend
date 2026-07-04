import { useTheme } from "@mui/material/styles";
import { FlexBetween, FlexBetweenColumn, FlexEvenly } from "../components/layout/FlexBox";
import {
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Divider,
    Skeleton,
    Tooltip,
    alpha,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { CloudUpload } from "@mui/icons-material";
import SegmentIcon from "@mui/icons-material/Segment";
import { useNavigate } from "react-router-dom";
import Field from "../components/fields/Field";
import { getNestedValue } from "../../utils/objectHelpers";
import { FieldLabel } from "../components/fields/StyledField";
import { resolveFieldValue, bindGetOptions, isFieldEditable } from "../utils/fieldHelpers";
import { useUI } from "@/context/UIContext";
import { StyledFieldContainer, StyledFieldItem } from "./FormComponents";
import React, { memo } from "react";
import ViewTabs from "./ViewTabs";
import Actions from "./helper/Actions";
import { ActionItem, FieldDef } from "../types";
import { FadeIn } from "./components/shared";

/* ───────── Skeleton (slightly denser) ───────── */
interface FormSkeletonProps {
    isMobile?: boolean;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({ isMobile }) => (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", mt: 2, gap: 2 }}>
        <Box sx={{ width: isMobile ? "100%" : 180 }}>
            <Skeleton variant="rectangular" height={170} />
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[1, 2].map((s) => (
                <Box key={s} sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
                    <Skeleton width={100} height={18} sx={{ mb: 1 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: 1.5,
                        }}
                    >
                        {[1, 2, 3, 4].map((f) => (
                            <Box key={f}>
                                <Skeleton width={60} height={10} sx={{ mb: 0.5 }} />
                                <Skeleton height={28} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
);

export interface FormViewProps<T extends Record<string, unknown> = Record<string, unknown>> {
    fields: FieldDef[];
    formKey: string | number | null | undefined;
    data: T | null | undefined;
    loading?: boolean;
    tableName: string;
    editingId?: string | number | null;
    handleChange: (value: unknown, formKey: string | number | null | undefined, fieldName: string) => void;
    handleSave: (formKey: string | number | null | undefined) => void;
    handleCancel: () => void;
    currentView?: string;
    actions?: ActionItem<T>[];
}

function FormView<T extends Record<string, unknown> = Record<string, unknown>>(props: FormViewProps<T>) {
    const {
        fields,
        formKey,
        data,
        loading,
        tableName,
        editingId,
        handleChange,
        handleSave,
        handleCancel,
        currentView,
        actions,
    } = props;

    const navigate = useNavigate();
    const { isMobile } = useUI();
    const theme = useTheme();

    const normalFields = fields.filter((f) => !["IMAGE", "VIEW", "COMPONENT"].includes(f.type || ""));
    const imageField = fields.find((f) => f.type === "IMAGE");
    const viewFields = fields.filter((f) => f.type === "VIEW");
    const component = fields.find((f) => f.type === "COMPONENT");

    const groupedFields = normalFields.reduce((acc: Record<string, FieldDef[]>, field) => {
        const section = field.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(field);
        return acc;
    }, {});

    return (
        <>
            <FlexBetween
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    px: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[1],
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                    <Tooltip title="Back">
                        <IconButton
                            size="small"
                            onClick={() => {
                                if (editingId) handleCancel();
                                navigate(`/management/${tableName}`);
                             }}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontSize: 11 }}
                        >
                            Management / {tableName}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Typography
                                noWrap
                                sx={{ fontWeight: 700, fontSize: 14, maxWidth: 180 }}
                            >
                                {String(tableName).toUpperCase()}
                            </Typography>

                            <Chip
                                size="small"
                                label={editingId ? "Editing" : "Saved"}
                                sx={{
                                    height: 18,
                                    fontSize: 10,
                                    px: 0.5,
                                    backgroundColor: editingId
                                        ? alpha(theme.palette.warning.main, 0.15)
                                        : alpha(theme.palette.success.main, 0.12),
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 0.5 }}>
                    {!editingId ? (
                        <>
                            <Actions actions={actions || []} row={data ?? {} as T} />
                            <IconButton>
                                {loading ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    <CloudDoneIcon sx={{ color: "green" }} />
                                )}
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={handleCancel}>
                                <CancelIcon sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton onClick={() => handleSave(formKey)}>
                                <CloudUpload sx={{ color: "green" }} />
                            </IconButton>
                        </>
                    )}
                </Box>
            </FlexBetween>

            {/* ───────── BODY ───────── */}
            <FadeIn animKey={formKey ?? "form"} y={6} duration={0.25}>
                {!data ? (
                    <FormSkeleton isMobile={isMobile} />
                ) : (
                    <FlexBetween
                        flexDirection={isMobile ? "column" : "row"}
                        my={2}
                        sx={{ alignItems: "flex-start", gap: 1.5 }}
                    >
                        {/* IMAGE */}
                        {imageField && (
                            <FlexEvenly width={isMobile ? "100%" : 200}>
                                <Box sx={{ p: 1, borderRadius: 2 }}>
                                    <Field
                                        label={imageField.label}
                                        isEdit={!!editingId}
                                        value={getNestedValue(data, imageField.name)}
                                        setValue={(v: unknown) => handleChange(v, formKey, imageField.name)}
                                        type={imageField.type}
                                        extraProp={{
                                            ...imageField.extraProp,
                                            size: "140px",
                                        }}
                                    />
                                </Box>
                            </FlexEvenly>
                        )}

                        {/* SECTIONS */}
                        <FlexBetweenColumn flexGrow={1} width="100%" gap={1} ml={isMobile ? 0 : 3}>
                            {Object.entries(groupedFields).map(([sectionName, fieldsInSection]) => (
                                <Box
                                    key={sectionName}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
                                        <SegmentIcon sx={{ fontSize: 12 }} /> {sectionName}
                                    </Typography>

                                    <Divider sx={{ mb: 1 }} />

                                    <StyledFieldContainer>
                                        {fieldsInSection.map((field) => (
                                            <StyledFieldItem key={field.name}>
                                                <FieldLabel>{field.label}</FieldLabel>
                                                <Field
                                                    isEdit={isFieldEditable(
                                                        field,
                                                        data,
                                                        !!editingId,
                                                    )}
                                                    value={resolveFieldValue(
                                                        field,
                                                        data,
                                                        !!editingId,
                                                    )}
                                                    setValue={(v: unknown) =>
                                                        handleChange(v, formKey, field.name)
                                                    }
                                                    type={field.type}
                                                    extraProp={bindGetOptions(
                                                        field.extraProp ?? {},
                                                        data,
                                                    )}
                                                    validation={field.validation as Record<string, unknown>}
                                                />
                                            </StyledFieldItem>
                                        ))}
                                    </StyledFieldContainer>
                                </Box>
                            ))}

                            {component && component.CustomComponent && (
                                <component.CustomComponent data={data} field={component} />
                            )}
                        </FlexBetweenColumn>
                    </FlexBetween>
                )}
            </FadeIn>

            {/* TABS */}
            <ViewTabs
                currentView={currentView}
                editingId={editingId}
                formKey={formKey}
                viewFields={viewFields}
            />
        </>
    );
}

export default memo(FormView) as typeof FormView;
