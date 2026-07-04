import { Fragment, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectOption } from "../../types";

export interface SelectionFieldProps<T extends Record<string, unknown> = Record<string, unknown>> {
    label?: string;
    value?: SelectOption<T> | null;
    readOnly?: boolean;
    setValue: (val: string | number | SelectOption<T>) => void;
    getOptions: (search: string, offset: number, limit: number) => Promise<SelectOption<T>[]>;
    addValue?: boolean;
    variant?: "standard" | "outlined" | "filled";
    validation?: { required?: boolean;[key: string]: unknown };
    saveType?: "string" | "object";
}

export default function SelectionField<T extends Record<string, unknown> = Record<string, unknown>>({
    label,
    value,
    readOnly,
    setValue,
    getOptions,
    addValue = true,
    variant = "standard",
    validation = {},
    saveType = "string",
}: SelectionFieldProps<T>) {
    const [open, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<SelectOption<T>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchOptions = useCallback(
        async (search = "", limit = 5) => {
            try {
                setLoading(true);
                const result = await getOptions(search, 0, limit);
                setOptions(result);
            } catch (err: unknown) {
                console.error("Error fetching options", err);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [getOptions],
    );

    useEffect(() => {
        if (addValue && value && !options.find((o) => o.key === value.key)) {
            setOptions((prev) => [...prev, value]);
        }
    }, [value, options, addValue]);

    useEffect(() => {
        searchTerm && fetchOptions(searchTerm);
    }, [fetchOptions, searchTerm]);

    const handleOpen = () => {
        setOpen(true);
        fetchOptions();
    };

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    return (
        <Autocomplete
            fullWidth
            open={open}
            disabled={readOnly}
            onOpen={handleOpen}
            onClose={handleClose}
            value={value && value.key ? value : null}
            isOptionEqualToValue={(option, val) => option.key === val.key}
            getOptionLabel={(option) => String(option.value)}
            options={options}
            loading={loading}
            onChange={(_e, option) => {
                if (option) setValue(saveType === "string" ? option.value : option);
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInput) => {
                setInputValue(newInput);
                setSearchTerm(newInput);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant={variant}
                    required={validation.required}
                    placeholder="type to search"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
