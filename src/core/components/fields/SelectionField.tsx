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
    const [search, setSearch] = useState<string>("");

    const fetchOptions = useCallback(
        async (searchValue: string) => {
            try {
                const result = await getOptions(searchValue, 1, 5);
                setOptions(result);
            } catch (err) {
                console.error("Error fetching selection options", err);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [getOptions],
    );

    useEffect(() => {
        if (!open) {
            return;
        }
        setLoading(true);
        const timer = window.setTimeout(
            async () => {
                await fetchOptions(search);
                setLoading(false);
            },
            search ? 400 : 0,
        );
        return () => {
            window.clearTimeout(timer);
        };
    }, [open, search, fetchOptions]);

    const handleOpen = () => {
        // Opening should always show the default options,
        // not search using the currently selected value.
        setSearch("");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSearch("");
        setOptions([]);
    };

    const handleChange = (_event: unknown, option: SelectOption<T> | null) => {
        if (!option) {
            return;
        }

        setValue(saveType === "string" ? option.key : option);
    };

    const handleInputChange = (_event: unknown, newInput: string, reason: string) => {
        // Only update the API search when the user actually types.
        // MUI also fires this event with "reset" when displaying
        // the selected option, which we intentionally ignore.
        if (reason === "input") {
            setSearch(newInput);
        }
    };

    return (
        <Autocomplete
            fullWidth
            clearIcon={null}
            open={open}
            disabled={Boolean(readOnly)}
            onOpen={handleOpen}
            onClose={handleClose}
            value={value?.key != null ? value : null}
            isOptionEqualToValue={(option, selectedValue) => option.key === selectedValue.key}
            getOptionLabel={(option) => String(option.value)}
            options={options}
            filterOptions={(x) => x}
            loading={loading}
            loadingText="Searching..."
            noOptionsText="Not listed? Type to search."
            onChange={handleChange}
            onInputChange={handleInputChange}
            renderInput={({ size: _size, InputLabelProps: _labelProps, ...params }) => (
                <TextField
                    {...params}
                    {...(label ? { label } : {})}
                    variant={variant}
                    {...(validation.required ? { required: true } : {})}
                    placeholder="Type to search"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading && <CircularProgress color="inherit" size={20} />}
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
