import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { convertUTCToLocal } from "../../utils/DateUtil";
import { GlobalStyles, useTheme } from "@mui/system";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

const DateTime = ({
    disabled = false,
    value,
    onChange,
    format = "DATETIME",
    minDateTime,
    textFieldVarient = "standard",
    placeholder = "Select date and time",
    customStyle = {},
}) => {
    const theme = useTheme();
    const [localDateTime, setLocalDateTime] = useState(null);

    useEffect(() => {
        if (value) {
            const localStr = convertUTCToLocal(value);
            const date = new Date(localStr.replace(" ", "T"));
            setLocalDateTime(date);
        }
    }, [value]);

    const handleChange = (date) => {
        if (date) {
            setLocalDateTime(date);
            const formatted = date.toISOString().slice(0, 19).replace("T", " ");
            onChange(formatted);
        } else {
            onChange(null);
        }
    };

    const minDate = minDateTime
        ? new Date(convertUTCToLocal(minDateTime).replace(" ", "T"))
        : undefined;

    const commonProps = {
        value: localDateTime,
        disabled: disabled,
        onChange: handleChange,
        ampm: true,
        format: format === "DATE" ? "dd/MM/yyyy" : "dd/MM/yyyy, hh:mm a",
        minutesStep: 5,
        slotProps: {
            textField: {
                variant: textFieldVarient,
                size: "small",
                fullWidth: true,
                placeholder: placeholder
                    ? placeholder
                    : format === "DATE"
                      ? "Select date"
                      : "Select date and time",
                sx: {
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#1976d2",
                        },
                        "&:hover fieldset": {
                            borderColor: "#115293",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                        },
                    },
                    ...customStyle,
                },
            },
        },
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    // Style the picker popper/panel background
                    ".MuiPickersPopper-root .MuiPaper-root": {
                        borderRadius: 12,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        padding: "8px",
                    },

                    // Style the clock face
                    ".MuiClock-root": {
                        // borderRadius: "50%",
                        padding: "2rem",
                    },

                    // Style clock numbers
                    ".MuiClockNumber-root": {
                        color: "#1976d2",
                        fontWeight: 500,
                        "&.Mui-selected": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                        },
                    },

                    // Style the AM/PM buttons
                    ".MuiClock-pmButton, .MuiClock-amButton": {
                        borderRadius: "16px !important",
                        fontWeight: "bolder !important",
                        fontSize: "1rem !important",
                        // margin: "4px",
                        "&.Mui-selected": {
                            backgroundColor: "primary",
                            color: "#fff",
                        },
                        "&:hover": {
                            backgroundColor: "#90caf9",
                        },
                    },
                }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {format === "DATE" ? (
                    <DatePicker {...commonProps} minDate={minDate} />
                ) : (
                    <DateTimePicker
                        {...commonProps}
                        minDateTime={minDate}
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                        }}
                    />
                )}
            </LocalizationProvider>
        </>
    );
};

DateTime.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    textFieldVarient: PropTypes.string,
    format: PropTypes.oneOf(["DATE", "DATETIME"]),
    minDateTime: PropTypes.string,
    placeholder: PropTypes.string,
    customStyle: PropTypes.object,
    disabled: PropTypes.bool,
};

export default DateTime;
