import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem, Checkbox, FormControlLabel, Box, Divider } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Filter = ({ checkboxes = [], onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selected, setSelected] = useState({});
    const [tempSelected, setTempSelected] = useState({});

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setTempSelected(selected); // sync temp state with current state
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCheckboxChange = (key) => (event) => {
        setTempSelected((prev) => ({
            ...prev,
            [key]: event.target.checked,
        }));
    };

    const handleApply = () => {
        setSelected(tempSelected);
        onChange(Object.fromEntries(Object.entries(tempSelected).filter(([, value]) => value)));
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
                {checkboxes.map((item) => (
                    <MenuItem key={item.key} disableRipple>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!tempSelected[item.key]}
                                    onChange={handleCheckboxChange(item.key)}
                                />
                            }
                            label={item.label}
                        />
                    </MenuItem>
                ))}
                <Divider />
                <Box display="flex" justifyContent="flex-end" px={2} py={1}>
                    <Button variant="contained" fullWidth onClick={handleApply}>
                        Apply
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

Filter.propTypes = {
    checkboxes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ),
    onChange: PropTypes.func,
};

export default Filter;
