import { useTheme } from "@emotion/react";
import FlexBetween from "../FlexBetween";
import { IconButton, Typography, Box, CircularProgress, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Field from "../Fields/Field";
import FlexBetweenColumn from "../FlexBetweenColumn";
import Loading from "../Loading/Loading";
import { getNestedValue } from "../../utils/objectHelpers";
import { FieldLabel, FieldValue } from "../New/StyledField";
import { useUI } from "../../context/UIContext";
import Views from "./Views";

const FormView = (props) => {
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

    const normalFields = fields.filter((f) => !["IMAGE", "VIEW"].includes(f.type));

    const imageField = fields.find((f) => f.type === "IMAGE");
    const viewFields = fields.filter((f) => f.type === "VIEW");

    const groupedFields = normalFields.reduce((acc, field) => {
        const section = field.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(field);
        return acc;
    }, {});

    return (
        <>
            {/* 🔹 Header */}
            <FlexBetween
                backgroundColor={theme.palette.background.paper}
                sx={{ width: "100%", p: 1, borderRadius: 2, boxShadow: theme.shadows[2] }}
            >
                <FlexBetween alignItems="center" gap={2}>
                    <IconButton onClick={() => navigate(`/management/${tableName}`)}>
                        <ArrowBackIcon sx={{ color: "black" }} />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        {tableName}
                    </Typography>
                </FlexBetween>

                <Box>
                    {!editingId ? (
                        <FlexBetween gap={2}>
                            {actions
                                ?.filter((a) => !a.hide)
                                .map(({ name, enabled, onClick, icon, sx }) => (
                                    <IconButton
                                        key={name}
                                        disabled={
                                            typeof enabled === "function"
                                                ? !enabled(data)
                                                : !enabled
                                        }
                                        sx={sx}
                                        onClick={() => onClick(data)}
                                    >
                                        {icon || name}
                                    </IconButton>
                                ))}
                            <IconButton>
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <CloudDoneIcon sx={{ color: "green" }} />
                                )}
                            </IconButton>
                        </FlexBetween>
                    ) : (
                        <FlexBetween gap={2}>
                            <IconButton
                                disabled={loading}
                                onClick={() => {
                                    handleCancel();
                                }}
                            >
                                <CancelIcon sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton disabled={loading} onClick={() => handleSave(formKey)}>
                                <CloudUpload sx={{ color: "green" }} />
                            </IconButton>
                        </FlexBetween>
                    )}
                </Box>
            </FlexBetween>
            {!data ? (
                <Loading />
            ) : (
                <FlexBetween
                    flexDirection={isMobile ? "column" : "row"}
                    my={1}
                    p={1}
                    backgroundColor={theme.palette.background.paper}
                    sx={{
                        boxShadow: theme.shadows[7],
                        borderRadius: 2,
                        alignItems: "flex-start",
                    }}
                >
                    {imageField && (
                        <Box
                            p={2}
                            width={isMobile ? "100%" : "220px"}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Field
                                label={imageField.label}
                                isEdit={!!editingId}
                                value={getNestedValue(data, imageField.name)}
                                setValue={(v) => handleChange(v, formKey, imageField.name)}
                                type={imageField.type}
                                extraProp={{
                                    ...imageField.extraProp,
                                    size: "160px",
                                    isCircular: true,
                                }}
                            />
                        </Box>
                    )}

                    <FlexBetweenColumn flexGrow={1} width="100%" gap={1} ml={isMobile ? 0 : 3}>
                        {Object.entries(groupedFields).map(
                            ([sectionName, fieldsInSection], idx) => (
                                <Box
                                    key={sectionName}
                                    p={2}
                                    borderRadius={2}
                                    backgroundColor={theme.palette.background.default}
                                    boxShadow={theme.shadows[1]}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        color={theme.palette.text.primary}
                                    >
                                        {sectionName}
                                    </Typography>
                                    <Divider sx={{ mb: 0 }} />

                                    <FlexBetweenColumn
                                        sx={{
                                            columnGap: 3,
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill, minmax(22em, 1fr))",
                                        }}
                                    >
                                        {fieldsInSection.map((field) => (
                                            <FlexBetween
                                                key={field.name}
                                                gap={isMobile ? 0 : 2}
                                                flexDirection={isMobile ? "column" : "row"}
                                            >
                                                <FieldLabel>{field.label}</FieldLabel>
                                                <FieldValue>
                                                    <Field
                                                        isEdit={!!editingId}
                                                        value={
                                                            field?.getValue
                                                                ? field.getValue(
                                                                      getNestedValue(
                                                                          data,
                                                                          field.name,
                                                                      ),
                                                                      data,
                                                                  )
                                                                : getNestedValue(data, field.name)
                                                        }
                                                        setValue={(v) => {
                                                            handleChange(v, formKey, field.name);
                                                        }}
                                                        type={field.type}
                                                        extraProp={field.extraProp}
                                                    />
                                                </FieldValue>
                                            </FlexBetween>
                                        ))}
                                    </FlexBetweenColumn>
                                </Box>
                            ),
                        )}
                    </FlexBetweenColumn>
                </FlexBetween>
            )}
            {editingId !== "NEW" &&
                viewFields?.length > 0 &&
                viewFields.map((view) => (
                    <Box key={view.label}>
                        <>{view.label}</>
                        <Views
                            key={view.label}
                            {...view.viewProps}
                            rootId={formKey}
                            currentView={currentView}
                            showAddButton={true}
                        />
                    </Box>
                ))}
        </>
    );
};

FormView.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.object,
    fields: PropTypes.array,
    editingId: PropTypes.any,
    tableName: PropTypes.string,
    currentView: PropTypes.string,
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    loading: PropTypes.bool,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            hide: PropTypes.bool,
        }),
    ),
};

export default FormView;
