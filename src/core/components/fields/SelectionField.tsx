/** Autocomplete selection field with async option fetching (search + pagination), supporting string or object save types. */
import { Fragment, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectOption } from "@/core/types";

export interface SelectionFieldProps<T> {
    label?: string | undefined;
    value?: SelectOption<T> | null | undefined;
    readOnly?: boolean | undefined;
    setValue: (val: string | number | SelectOption<T>) => void;
    getOptions: (search: string, offset: number, limit: number) => Promise<SelectOption<T>[]>;
    variant?: "standard" | "outlined" | "filled" | undefined;
    validation?: { required?: boolean | undefined; [key: string]: unknown } | undefined;
    saveType?: "string" | "object" | undefined;
}

export default function SelectionField<T>({
    label,
    value,
    readOnly,
    setValue,
    getOptions,
    variant = "standard",
    validation = {},
    saveType = "string",
}: SelectionFieldProps<T>) {
    const [open, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<SelectOption<T>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(
        value?.value != null ? String(value.value) : "",
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchOptions = useCallback(
        async (search = "", limit = 5) => {
            try {
                setLoading(true);
                const result = await getOptions(search, 1, limit);
                setOptions(result);
            } catch (err) {
                console.error("Error fetching options", err);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [getOptions],
    );

    useEffect(() => {
        if (searchTerm) fetchOptions(searchTerm);
    }, [fetchOptions, searchTerm]);

    useEffect(() => {
        setInputValue(value?.value != null ? String(value.value) : "");
    }, [value]);

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
            disabled={Boolean(readOnly)}
            onOpen={handleOpen}
            onClose={handleClose}
            value={value && value.key != null ? value : null}
            isOptionEqualToValue={(option, val) => option.key === val.key}
            getOptionLabel={(option) => String(option.value)}
            options={options}
            loading={loading}
            onChange={(_e, option) => {
                if (option) setValue(saveType === "string" ? option.key : option);
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInput) => {
                setInputValue(newInput);
                setSearchTerm(newInput);
            }}
            renderInput={({ size: _size, InputLabelProps: _labelProps, ...params }) => (
                <TextField
                    {...params}
                    {...(label ? { label } : {})}
                    variant={variant}
                    {...(validation.required ? { required: true } : {})}
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
