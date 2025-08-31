import { useState } from "react";
import FlexBetween from "./FlexBetween";
import { Avatar, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import DateTimeField from "./DateTimeField";
import { getLocalDateTime } from "../utils/DateUtil";
import AutoCompleteSelectField from "./AutoCompleteSelectField";
import InfiniteSelectField from "./InfiniteSelectField";

const EditableData = ({
  isEdit,
  data,
  fieldName,
  label,
  valueField,
  placeholder = "",
  showFieldName = true,
  icon,
  setData,
  inputType = "text",
  options,
  diffStyle = {},
  validation = {},
  minDateTime,
  getOptions
}) => {
  const theme = useTheme();
  const [error, setError] = useState("");

  const handleChange = (value) => {
    let newValue = typeof value === "string" ? value.trim() : value;
    if (validation?.required && !newValue) {
      setError(`This field ${fieldName} is required.`);
      return;
    }

    if (newValue && validation?.pattern && !new RegExp(validation.pattern).test(newValue)) {
      setError(validation.errorMessage || "Invalid value.");
      return;
    }

    setError("");
    setData((prevData) => ({ ...prevData, [fieldName]: newValue }));
  };

  return (
    <FlexBetween width={"30rem"} minHeight={"2rem"} gap={1} mx={1}>
      {showFieldName &&
        <Typography variant="h6" color="primary" height={"100%"} fontWeight={700}>
          {label || String(fieldName)
            .replace(/_/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase())}
        </Typography>
      }
      {icon && <Avatar
        sx={{
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        }}
      >
        {icon}
      </Avatar>}
      {isEdit && inputType !== "NONE" ? (
        inputType === "SELECT" ? (
          <Select
            variant="standard"
            name={fieldName}
            value={data && fieldName in data ? data[fieldName] : ""}
            onChange={(e) => handleChange(e.target.value)}
            sx={{ width: "100%", height: "100%", }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        ) : inputType === "AUTOCOMPLETE" ?
          <AutoCompleteSelectField
            currentValue={data && fieldName in data ? data[fieldName] : ""}
            onChange={handleChange}
            getOptions={getOptions}
          /> : inputType === "INFINITE_SELECT" ?
            <InfiniteSelectField
              keyField={fieldName}
              valueField={valueField}
              currentValue={data && fieldName in data ? data[fieldName] : ""}
              onChange={handleChange}
              getOptions={getOptions}
            />
            : inputType === "DATE" || inputType === "DATETIME" ?
              <DateTimeField
                value={data && fieldName in data ? data[fieldName] : ""}
                onChange={handleChange}
                format={inputType === "DATE" ? "DATE" : "DATETIME"}
                minDateTime={minDateTime}
                customStyle={{
                  ...diffStyle,
                }}
              />
              : (
                <TextField
                  variant="standard"
                  name={fieldName}
                  placeholder={placeholder}
                  defaultValue={data && fieldName in data ? data[fieldName] : ""}
                  onChange={(e) => { handleChange(e.target.value); }}
                  type={inputType}
                  slotProps={{
                    htmlInput: {
                      style: {
                        padding: 0,

                        lineHeight: 1.5,
                      },
                    },
                  }}
                  sx={{ width: "100%", height: "100%" }}
                  error={Boolean(error)}
                  helperText={error}
                />
              )
      ) : (
        <Typography
          variant="body1"
          sx={{ width: "100%", height: "100%", lineHeight: 1.7, ...diffStyle }}
        >

          {valueField && getValueFromPath(data, valueField)}
          {data && fieldName in data ? (inputType === "DATE" || inputType === "DATETIME") ? getLocalDateTime(data[fieldName], inputType) : data[fieldName] : ""}
        </Typography>
      )}
    </FlexBetween>
  );
};

EditableData.propTypes = {
  isEdit: PropTypes.bool,
  icon: PropTypes.elementType,
  showFieldName: PropTypes.bool,
  data: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  setData: PropTypes.func,
  inputType: PropTypes.string,
  options: PropTypes.array,
  diffStyle: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  valueField: PropTypes.string,
  minDateTime: PropTypes.string,
  getOptions: PropTypes.func,
  validation: PropTypes.shape({
    required: PropTypes.bool,
    pattern: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
};


export default EditableData;


const getValueFromPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};
