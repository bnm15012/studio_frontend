import { useState } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Menu,
    FormControlLabel,
    Box,
    Divider,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DateTime from "./Fields/StyledFields/DateTime";
import { getCurrentDateLocal } from "../utils/DateUtil";


const Filter = ({ filterOptions = [], onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const defaultSelected = Object.fromEntries(
        filterOptions
            .filter((f) => f.key === "date")
            .map((f) => [f.key, getCurrentDateLocal()]),
    );

    const [selected, setSelected] = useState(defaultSelected);
    const [tempSelected, setTempSelected] = useState(defaultSelected);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setTempSelected(selected);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRadioChange = (key) => (event) => {
        setTempSelected((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleDateChange = (value) => {
        setTempSelected((prev) => ({
            ...prev,
            ["date"]: value,
        }));
    };

    const handleApply = () => {
        setSelected(tempSelected);

        const activeFilters = Object.fromEntries(
            Object.entries(tempSelected).filter(([, value]) => value),
        );

        onChange?.(activeFilters);
        handleClose();
    };

    const handleClear = () => {
        const cleared = Object.fromEntries(
            filterOptions
                .filter((f) => f.key === "date")
                .map((f) => [f.key, getCurrentDateLocal()]),
        );

        setSelected(cleared);
        setTempSelected(cleared);

        onChange?.(cleared);
        handleClose();
    };

    return (
        <>
            <Button variant="contained" onClick={handleClick}>
                <FilterAltIcon />
            </Button>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Box px={2} py={1} minWidth={250} maxHeight={500}>
                    {filterOptions.map(({ name, key, values }) => (
                        <Box key={key} mb={2}>
                            <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                gutterBottom
                            >
                                {name}
                            </Typography>
                            {key === "date" ? (
                                <DateTime
                                    label="Filter Date"
                                    value={tempSelected[key] || getCurrentDateLocal()}
                                    setValue={handleDateChange}
                                    format={"DATE"}
                                    showTitle={false}
                                    variant="outlined"
                                    includeCurrentTime={false}
                                />
                            ) : (
                                <RadioGroup
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },
                                    }}
                                    value={tempSelected[key] || ""}
                                    onChange={handleRadioChange(key)}
                                >
                                    {values.map((value) => (
                                        <FormControlLabel
                                            key={value}
                                            value={value}
                                            control={<Radio />}
                                            label={value}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        </Box>
                    ))}

                    <Divider />

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        p={2}
                        gap={1}
                    >
                        <Button
                            variant="outlined"
                            sx={{ color: "red" }}
                            fullWidth
                            onClick={handleClear}
                        >
                            Clear
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

Filter.propTypes = {
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string),
        }),
    ),
    onChange: PropTypes.func,
};

export default Filter;
