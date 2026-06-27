import PropTypes from "prop-types";
import StyledSwitch from "./StyledSwitch";
import DateTime from "./DateTime";
import StyledTextField from "./StyledTextField";
import SelectionField from "./SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";
import TemplateEditor from "../../../Pages/Management/TemplatesPage/TemplateEditor";
import ImageComponent from "./ImageComponent";
import ImageDialog from "../../crud/ImageDialog";
import StyledCheckbox from "./StyledCheckbox";

const Field = ({
    value,
    setValue,
    isEdit = true,
    placeholder = "",
    label = "",
    type = "text",
    validation = {},
    extraProp = {},
}) => {
    const { min, max, rows, getOptions, readOnly, CustomComponent } = extraProp;
    const commonProps = {
        value,
        minVal: min,
        maxVal: max,
        setValue,
        label,
        validation,
        ...extraProp,
    };

    const renderInputField = () => {
        const placeholderText = placeholder || label;

        switch (type) {
            case "SELECT":
                return <SelectionField {...commonProps} getOptions={getOptions} />;
            case "BOOL":
                return <StyledSwitch {...commonProps} />;
            case "DATE":
                return <DateTime {...commonProps} format="DATE" placeholder={placeholderText} />;
            case "DATETIME":
                return (
                    <DateTime {...commonProps} format="DATETIME" placeholder={placeholderText} />
                );
            case "EDITOR":
                return (
                    <TemplateEditor {...commonProps} rows={rows} placeholder={placeholderText} />
                );
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={value}
                        setImage={setValue}
                        isEdit={true}
                        defaultImage={extraProp?.defaultImage}
                    />
                );
            case "CUSTOM":
                return <CustomComponent {...commonProps} isEdit={true} />;
            case "IMAGE":
                return <ImageComponent allowEdit={isEdit} {...commonProps} />;
            default:
                return (
                    <StyledTextField
                        {...commonProps}
                        rows={rows}
                        placeholder={placeholderText}
                        type={type}
                    />
                );
        }
    };

    const getValue = () => {
        switch (type) {
            case "BOOL":
                return <StyledSwitch {...commonProps} readOnly={true} />;
            case "CHECK":
                return <StyledCheckbox {...commonProps} readOnly={true} />;
            case "SELECT":
                return value?.value;
            case "DATE":
            case "DATETIME":
                return getLocalDateTime(value, type);
            case "CUSTOM":
                return <CustomComponent {...commonProps} />;
            case "IMAGE":
                return renderInputField();
            case "IMAGE_DIALOG":
                return <ImageDialog image={value} setImage={setValue} isEdit={false} />;
            default:
                return value || "N/A";
        }
    };

    if (isEdit && (readOnly === false || readOnly == null)) {
        return renderInputField();
    }

    return getValue();
};

Field.propTypes = {
    value: PropTypes.any,
    setValue: (props) => {
        if (props.isEdit && typeof props.setValue !== "function") {
            return new Error(
                "`setValue` is required and must be a function when `isEdit` is true.",
            );
        }
        return null;
    },
    validation: PropTypes.object,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string,
    extraProp: PropTypes.shape({
        min: PropTypes.any,
        max: PropTypes.any,
        rows: PropTypes.number,
        getOptions: PropTypes.func,
    }),
    isEdit: PropTypes.bool,
};

export default Field;
