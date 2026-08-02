/** Date and DateTime picker component using MUI DatePicker/DateTimePicker with date-fns adapter, min/max constraints. */
import React, { useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GlobalStyles, useTheme } from "@mui/system";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { parseDateTime, formatDateTime } from "@/core/utils/DateUtil";

export interface DateTimeProps {
    value?: string | null | undefined;
    label?: string | undefined;
    setValue: (val: string | null) => void;
    minVal?: string | undefined;
    maxVal?: string | undefined;
    readOnly?: boolean | undefined;
    format?: "DATE" | "DATETIME" | undefined;
    variant?: "standard" | "outlined" | "filled" | undefined;
    includeCurrentTime?: boolean | undefined;
    placeholder?: string | undefined;
    showTitle?: boolean | undefined;
    size?: "small" | "medium" | undefined;
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
    size = "small",
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

    const minDate = (minVal ? parseDateTime(minVal) : undefined) || undefined;
    const maxDate = (maxVal ? parseDateTime(maxVal) : undefined) || undefined;

    const commonProps = {
        value: localDateTime,
        label,
        disabled: readOnly,
        onChange: handleChange,
        ampm: true,
        format: format === "DATE" ? "dd/MM/yyyy" : "dd/MM/yyyy, hh:mm a",
        minutesstep: 5,
        slotProps: {
            textField: {
                variant,
                size,
                fullWidth: true,
                placeholder:
                    placeholder || (format === "DATE" ? "Select date" : "Select date and time"),
                sx: {
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&:hover fieldset": {
                            borderColor: theme.palette.primary.dark,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
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
                        boxShadow: (theme.shadows as string[])[2],
                        padding: "8px",
                    },
                    ".MuiClock-root": {
                        padding: "2rem",
                    },
                    ".MuiClockNumber-root": {
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                        },
                    },
                    ".MuiClock-pmButton, .MuiClock-amButton": {
                        borderRadius: "16px !important",
                        fontWeight: "bolder !important",
                        fontSize: "1rem !important",
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                        },
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
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
