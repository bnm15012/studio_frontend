import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField } from "@mui/material";
import FlexBetween from "./FlexBetween";

const AutoCompleteSelectField = ({ currentKey, onChange, getOptions }) => {
    const [options, setOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                let result = [];
                if (searchTerm.length >= 3) {
                    result = await getOptions(searchTerm, 0, 10);
                } else if (searchTerm.length === 0) {
                    result = await getOptions("", 0, 5);
                }
                setOptions(result);
            } catch (err) {
                console.error("Error fetching options", err);
                setOptions([]);
            }
        };

        fetchOptions();
    }, [searchTerm, getOptions]);

    return (
        <FlexBetween sx={{ width: "100%" }}>
            <Autocomplete
                fullWidth
                options={options}
                getOptionLabel={(option) => option.value || ""}
                value={options.find((opt) => opt.key === currentKey) || null}
                onChange={(event, newValue) => {
                    onChange(newValue ? newValue.key : null);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInput) => {
                    setInputValue(newInput);
                    setSearchTerm(newInput);
                }}
                renderInput={(params) => <TextField {...params} variant="standard" />}
            />
        </FlexBetween>
    );
};

AutoCompleteSelectField.propTypes = {
    currentKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    keyField: PropTypes.string.isRequired,
    valueField: PropTypes.string.isRequired,
};

export default AutoCompleteSelectField;
