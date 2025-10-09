import PropTypes from "prop-types";
import StyledSwitch from "./StyledFields/StyledSwitch";
import DateTime from "./StyledFields/DateTime";
import StyledTextField from "./StyledFields/StyledTextField";
import FlexBetween from "../FlexBetween";
import { Typography } from "@mui/material";
import SelectionField from "./Selection/SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";

const Field = ({
    value,
    setValue,
    isEdit = true,
    placeholder = "",
    label = "",
    type = "text",
    disabled = false,
    variant = "standard",
    validation = {},
    extraProp = {},
}) => {
    const { min, max, rows, getOptions } = extraProp;
    const commonProps = { value, setValue, disabled, label, validation, variant };

    const renderInputField = () => {
        const placeholderText = placeholder || label;

        const fieldMap = {
            SELECT: <SelectionField {...commonProps} getOptions={getOptions} />,
            BOOL: <StyledSwitch {...commonProps} />,
            DATE: (
                <DateTime
                    {...commonProps}
                    minVal={min}
                    maxVal={max}
                    format="DATE"
                    textFieldVarient={variant}
                    placeholder={placeholderText}
                />
            ),
            DATETIME: (
                <DateTime
                    {...commonProps}
                    minVal={min}
                    maxVal={max}
                    format="DATETIME"
                    placeholder={placeholderText}
                />
            ),
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
        return (
            <FlexBetween>
                {label && (
                    <Typography variant="body1" color="textSecondary">
                        {label}:{" "}
                    </Typography>
                )}
                <Typography variant="body1">{getValue()}</Typography>
            </FlexBetween>
        );
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
