import PropTypes from "prop-types";
import StyledSwitch from "./StyledFields/StyledSwitch";
import DateTime from "./StyledFields/DateTime";
import StyledTextField from "./StyledFields/StyledTextField";
import SelectionField from "./Selection/SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";
import TemplateEditor from "../../Pages/Management/TemplatesPage/TemplateEditor";

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
    const { min, max, rows, getOptions, readOnly, variant } = extraProp;
    const commonProps = {
        value,
        minVal: min,
        maxVal: max,
        setValue,
        label,
        readOnly,
        validation,
        variant,
    };

    const renderInputField = () => {
        const placeholderText = placeholder || label;

        const fieldMap = {
            SELECT: <SelectionField {...commonProps} getOptions={getOptions} />,
            BOOL: <StyledSwitch {...commonProps} />,
            DATE: <DateTime {...commonProps} format="DATE" placeholder={placeholderText} />,
            DATETIME: <DateTime {...commonProps} format="DATETIME" placeholder={placeholderText} />,
            EDITOR: <TemplateEditor {...commonProps} rows={rows} placeholder={placeholderText} />,
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
            default:
                return value;
        }
    };

    if (!isEdit) {
        return getValue();
    }

    return renderInputField();
};

Field.propTypes = {
    value: PropTypes.any.isRequired,
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
