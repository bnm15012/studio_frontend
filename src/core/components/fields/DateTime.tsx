import React, { useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GlobalStyles, useTheme } from "@mui/system";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { parseDateTime, formatDateTime } from "../../utils/DateUtil";

interface DateTimeProps {
    value?: string | null;
    label?: string;
    setValue: (val: string | null) => void;
    minVal?: string;
    maxVal?: string;
    readOnly?: boolean;
    format?: "DATE" | "DATETIME";
    variant?: "standard" | "outlined" | "filled";
    includeCurrentTime?: boolean;
    placeholder?: string;
    showTitle?: boolean;
}

const DateTime: React.FC<DateTimeProps> = ({
    value,
    label,
    setValue,
    minVal,
    maxVal,
    readOnly = false,
    format = "DATETIME",
    variant = "standard",
    includeCurrentTime = true,
    placeholder = "Select date and time",
}) => {
    const theme = useTheme();
    const [localDateTime, setLocalDateTime] = useState<Date | null>(null);

    useEffect(() => {
        if (value) {
            setLocalDateTime(parseDateTime(value));
        } else {
            setLocalDateTime(null);
        }
    }, [value]);

    const handleChange = (date: Date | null) => {
        if (!date) {
            setLocalDateTime(null);
            setValue(null);
            return;
        }

        setLocalDateTime(date);

        if (format === "DATE") {
            const pad = (n: number) => String(n).padStart(2, "0");
            let formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            if (includeCurrentTime) {
                const now = new Date();
                formatted += ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            }
            setValue(formatted);
        } else {
            setValue(formatDateTime(date));
        }
    };

    const minDate = minVal ? parseDateTime(minVal) : undefined;
    const maxDate = maxVal ? parseDateTime(maxVal) : undefined;

    const commonProps = {
        value: localDateTime,
        label,
        disabled: readOnly,
        onChange: handleChange,
        ampm: true,
        format: format === "DATE" ? "dd/MM/yyyy" : "dd/MM/yyyy, hh:mm a",
        minutesStep: 5,
        slotProps: {
            textField: {
                variant,
                size: "small" as const,
                fullWidth: true,
                placeholder:
                    placeholder || (format === "DATE" ? "Select date" : "Select date and time"),
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
                },
            },
        },
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    ".MuiPickersPopper-root .MuiPaper-root": {
                        borderRadius: 12,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: (theme as any).shadows[2],
                        padding: "8px",
                    },
                    ".MuiClock-root": {
                        padding: "2rem",
                    },
                    ".MuiClockNumber-root": {
                        color: "#1976d2",
                        fontWeight: 500,
                        "&.Mui-selected": {
                            backgroundColor: "#1976d2",
                            color: "#fff",
                        },
                    },
                    ".MuiClock-pmButton, .MuiClock-amButton": {
                        borderRadius: "16px !important",
                        fontWeight: "bolder !important",
                        fontSize: "1rem !important",
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
                    <DatePicker {...commonProps} minDate={minDate} maxDate={maxDate} />
                ) : (
                    <DateTimePicker
                        {...commonProps}
                        minDateTime={minDate}
                        maxDateTime={maxDate}
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

export default DateTime;
