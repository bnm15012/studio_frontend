import PropTypes from "prop-types";
import StyledSwitch from "./StyledFields/StyledSwitch";
import DateTime from "./StyledFields/DateTime";
import StyledTextField from "./StyledFields/StyledTextField";
import SelectionField from "./Selection/SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";
import TemplateEditor from "../../Pages/Management/TemplatesPage/TemplateEditor";
import ImageComponent from "../ImageComponent";
import ImageDialog from "../Views/ImageDialog";

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
    const { min, max, rows, getOptions, readOnly } = extraProp;
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

        const fieldMap = {
            SELECT: <SelectionField {...commonProps} getOptions={getOptions} />,
            BOOL: <StyledSwitch {...commonProps} />,
            DATE: <DateTime {...commonProps} format="DATE" placeholder={placeholderText} />,
            DATETIME: <DateTime {...commonProps} format="DATETIME" placeholder={placeholderText} />,
            EDITOR: <TemplateEditor {...commonProps} rows={rows} placeholder={placeholderText} />,
            IMAGE_DIALOG: (
                <ImageDialog
                    image={value}
                    setImage={setValue}
                    isEdit={true}
                    defaultImage={extraProp?.defaultImage}
                />
            ),
            IMAGE: <ImageComponent allowEdit={isEdit} {...commonProps} />,
            DEFAULT: (
                <StyledTextField
                    {...commonProps}
                    rows={rows}
                    placeholder={placeholderText}
                    type={type}
                />
            ),
        };

        return fieldMap[type] || fieldMap.DEFAULT;
    };

    const getValue = () => {
        switch (type) {
            case "BOOL":
                return value ? "Yes" : "No";
            case "SELECT":
                return value.value;
            case "DATE":
            case "DATETIME":
                return getLocalDateTime(value, type);
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
    setValue: PropTypes.func.isRequired,
    validation: PropTypes.shape({
        isRequired: PropTypes.bool,
        regex: PropTypes.string,
    }),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    extraProp: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        rows: PropTypes.number,
        getOptions: PropTypes.func,
    }),
    isEdit: PropTypes.bool,
};

export default Field;
