import { useState } from "react";
import FlexBetween from "../FlexBetween";
import { Avatar, MenuItem, Select, Switch, TextField, Typography, useTheme } from "@mui/material";
import PropTypes from 'prop-types';
import DateTimeField from "../DateTimeField";
import { getLocalDateTime } from "../../utils/DateUtil";
import AutoCompleteSelectField from "./AutoCompleteSelectField";
import InfiniteSelectField from "../InfiniteSelectField";
import DateTime from "./DateTime";

const Fields = ({
    type,
    key,
    value,
    setValue,
    isEdit = false,
    sx = {},
}) => {

    if (type === 'char' || type === 'number')
        return <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth sx={sx}
        />


    if (type === 'bool')
        return <Switch sx={sx} checked={value} onChange={(e) => { setValue(e.target.checked) }} />

    if (type === 'datetime' || type === 'date')
        return <DateTime
            value={value}
            onChange={setValue}
            format={type === "date" ? "DATE" : "DATETIME"}
            minDateTime={minDateTime}
            customStyle={sx}
        />

    if (type === 'select')
        return <AutoCompleteSelectField
            currentKey={key}
            onChange={(newKey) => setValue(newKey)}
            getOptions={getOptions}
            key={key}
            value={value}
        />

    if (type === 'image')
        return <Avatar
            src={value}
            alt="avatar"
            sx={{
                width: 50,
                height: 50,
                ...sx
            }}
        />

    return <Typography>

    </Typography>
};

Fields.propTypes = {
    type: PropTypes.oneOf(['char', 'number', 'select', 'bool', 'datetime', 'date', 'image']).isRequired,
    isEdit: PropTypes.bool,
    value: PropTypes.object.isRequired,
    setValue: PropTypes.func,
    icon: PropTypes.elementType,
    showFieldName: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
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


export default Fields;
