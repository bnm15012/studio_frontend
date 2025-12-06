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
import { StyledFieldContainer, StyledFieldItem } from "./FormComponents";
import { memo } from "react";
import ViewTabs from "./ViewTabs";
import FlexEvenly from "../FlexEvenly";
import Actions from "./helper/Actions";

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

    const normalFields = fields.filter((f) => !["IMAGE", "VIEW", "COMPONENT"].includes(f.type));

    const imageField = fields.find((f) => f.type === "IMAGE");
    const viewFields = fields.filter((f) => f.type === "VIEW");
    const component = fields.find((f) => f.type === "COMPONENT");

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
                    <IconButton
                        onClick={() => {
                            if (editingId) {
                                handleCancel();
                            }
                            navigate(`/management/${tableName}`);
                        }}
                    >
                        <ArrowBackIcon sx={{ color: "black" }} />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        {tableName}
                    </Typography>
                </FlexBetween>

                <Box>
                    {!editingId ? (
                        <FlexBetween gap={2}>
                            <Actions actions={actions} row={data} />
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
                    sx={{
                        borderRadius: 2,
                        alignItems: "flex-start",
                    }}
                >
                    {imageField && (
                        <FlexEvenly p={1} width={isMobile ? "100%" : "220px"}>
                            <Box
                                borderRadius={2}
                                p={1}
                                backgroundColor={theme.palette.background.paper}
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
                                        isCircular: "10%",
                                    }}
                                />
                            </Box>
                        </FlexEvenly>
                    )}

                    <FlexBetweenColumn flexGrow={1} width="100%" gap={1} ml={isMobile ? 0 : 3}>
                        {Object.entries(groupedFields).map(
                            ([sectionName, fieldsInSection], idx) => (
                                <Box
                                    key={sectionName}
                                    p={2}
                                    borderRadius={2}
                                    backgroundColor={theme.palette.background.paper}
                                    boxShadow={theme.shadows[2]}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        color={theme.palette.text.primary}
                                    >
                                        {sectionName}
                                    </Typography>
                                    <Divider sx={{ mb: 0 }} />
                                    <StyledFieldContainer>
                                        {fieldsInSection.map((field) => (
                                            <StyledFieldItem key={field.name} gap={1}>
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
                                                        validation={field.validation}
                                                    />
                                                </FieldValue>
                                            </StyledFieldItem>
                                        ))}
                                    </StyledFieldContainer>
                                </Box>
                            ),
                        )}
                        <component.CustomComponent data={data} field={component} />
                    </FlexBetweenColumn>
                </FlexBetween>
            )}
            <ViewTabs
                currentView={currentView}
                editingId={editingId}
                formKey={formKey}
                viewFields={viewFields}
            />
        </>
    );
};

FormView.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.object,
    addNewRow: PropTypes.func,
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

export default memo(FormView);
