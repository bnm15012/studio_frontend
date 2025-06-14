import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import FlexBetween from './FlexBetween';

const AutoCompleteSelectField = ({ currentValue, onChange, getOptions }) => {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      if (searchTerm.length >= 3) {
        const result = await getOptions(searchTerm);
        setOptions(
          result.map((option) => ({
            label: option.groupName,
            value: option.id,
          }))
        );
      } else {
        setOptions([]);
      }
    };
    fetchOptions();
  }, [searchTerm, getOptions]);

  return (
    <FlexBetween sx={{ width: '100%' }}>
      <Autocomplete
        fullWidth
        options={options}
        getOptionLabel={(option) => option.label}
        value={
          options.find((opt) => opt.value === currentValue) || null
        }
        onChange={(event, newValue) => {
            onChange(newValue.value)
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setSearchTerm(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="standard" />
        )}
      />
    </FlexBetween>
  );
};

AutoCompleteSelectField.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
};

export default AutoCompleteSelectField;
