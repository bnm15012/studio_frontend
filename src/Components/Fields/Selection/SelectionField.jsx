import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { Fragment, useCallback, useEffect, useState } from "react";

export default function SelectionField({
    label,
    value,
    readOnly,
    setValue,
    getOptions,
    addValue = true,
    variant = "standard",
}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOptions = useCallback(
        async (search = "", limit = 5) => {
            try {
                setLoading(true);
                const result = await getOptions(search, 0, limit);
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
            isOptionEqualToValue={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option.value}
            options={options}
            loading={loading}
            onChange={(e, option) => {
                setValue(option.key);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInput) => {
                setInputValue(newInput);
                setSearchTerm(newInput);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant={variant}
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

SelectionField.propTypes = {
    value: PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.string,
    }),
    addValue: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    getOptions: PropTypes.func.isRequired,
    variant: PropTypes.string,
    label: PropTypes.string,
};
