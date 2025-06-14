import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { convertUTCToLocal } from "../utils/DateUtil";

const DateTimeField = ({
    value,
    onChange,
    format = "DATETIME",
    minDateTime,
    textFieldVarient = "standard",
    customStyle = {},
}) => {
    const [localDateTime, setLocalDateTime] = useState(null);

    useEffect(() => {
        if (value) {
            const localStr = convertUTCToLocal(value);
            const date = new Date(localStr.replace(" ", "T"));
            setLocalDateTime(date);
        }
    }, [value]);

    const handleChange = (date) => {
        if (!date) return;
        setLocalDateTime(date);
        const formatted = date.toISOString().slice(0, 19).replace("T", " ");
        onChange(formatted);
    };

    const minDate = minDateTime
        ? new Date(convertUTCToLocal(minDateTime).replace(" ", "T"))
        : undefined;

    const commonProps = {
        value: localDateTime,
        onChange: handleChange,
        ampm: undefined,
        format: format === "DATE" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm",
        minutesStep: 5,
        slotProps: {
            textField: {
                variant: textFieldVarient,
                fullWidth: true,
                sx: customStyle,
            },
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {format === "DATE" ? (
                <DatePicker {...commonProps} minDate={minDate} />
            ) : (
                <DateTimePicker {...commonProps} minDateTime={minDate} />
            )}
        </LocalizationProvider>
    );
};

DateTimeField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    textFieldVarient: PropTypes.string,
    format: PropTypes.oneOf(["DATE", "DATETIME"]),
    minDateTime: PropTypes.string,
    customStyle: PropTypes.object,
};

export default DateTimeField;
