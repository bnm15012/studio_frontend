/** Filter dropdown menu component with radio-button groups and date range filters, emitting filter changes. */
import React, { useState } from "react";
import {
    Button,
    Menu,
    FormControlLabel,
    Box,
    Divider,
    Radio,
    RadioGroup,
    Typography,
    IconButton,
    Badge,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DateTime from "./DateTime";
import { iconBtnFilledSx } from "../layout/ActionButtonStyle";
import { FilterKeys } from "@/core/types";
import { useTheme, alpha } from "@mui/material/styles";

export interface FilterOption {
    name: string;
    key: string;
    values: string[];
}

interface FilterProps {
    filterOptions?: FilterOption[];
    onChange?: (filters: FilterKeys) => void;
}

const DATE_KEYS = ["date", "startDate", "endDate"];

const Filter: React.FC<FilterProps> = ({ filterOptions = [], onChange }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // All values start as null — no defaults pre-filled
    const emptySelected = Object.fromEntries(filterOptions.map((f) => [f.key, null]));

    const [selected, setSelected] = useState<Record<string, string | null>>(emptySelected);
    const [tempSelected, setTempSelected] = useState<Record<string, string | null>>(emptySelected);

    // True when at least one filter has a non-null, non-empty value
    const isActive = Object.values(selected).some((v) => v != null && v !== "");
    const activeCount = Object.values(selected).filter((v) => v != null && v !== "").length;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setTempSelected(selected);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRadioChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempSelected((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleDateChange = (key: string) => (value: string | null) => {
        setTempSelected((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApply = () => {
        setSelected(tempSelected);

        const activeFilters = Object.fromEntries(
            Object.entries(tempSelected).filter(([, value]) => value != null && value !== ""),
        ) as FilterKeys;

        onChange?.(activeFilters);
        handleClose();
    };

    const handleClear = () => {
        // Reset everything to null — no values, no dates
        const cleared = Object.fromEntries(filterOptions.map((f) => [f.key, null]));
        setSelected(cleared);
        setTempSelected(cleared);
        onChange?.({} as FilterKeys);
        handleClose();
    };

    return (
        <>
            <Badge
                badgeContent={activeCount}
                color="error"
                overlap="circular"
                sx={{
                    "& .MuiBadge-badge": {
                        fontSize: 10,
                        height: 16,
                        minWidth: 16,
                        padding: "0 3px",
                    },
                }}
            >
                <IconButton
                    sx={{
                        ...iconBtnFilledSx,
                        ...(isActive && {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.85),
                            },
                        }),
                    }}
                    onClick={handleClick}
                >
                    <FilterAltIcon />
                </IconButton>
            </Badge>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Box px={2} py={1} minWidth={260} maxHeight={520} overflow="auto">
                    {filterOptions.map(({ name, key, values }) => (
                        <Box key={key} mb={2}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                {name}
                            </Typography>
                            {DATE_KEYS.includes(key) ? (
                                <DateTime
                                    label={name}
                                    value={tempSelected[key] ?? ""}
                                    setValue={handleDateChange(key)}
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
                                    value={tempSelected[key] ?? ""}
                                    onChange={handleRadioChange(key)}
                                >
                                    {values.map((value) => (
                                        <FormControlLabel
                                            key={value}
                                            value={value}
                                            control={<Radio size="small" />}
                                            label={value}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        </Box>
                    ))}

                    <Divider />

                    <Box display="flex" justifyContent="space-between" pt={1.5} gap={1}>
                        <Button variant="outlined" color="error" fullWidth onClick={handleClear}>
                            Clear
                        </Button>

                        <Button variant="contained" color="primary" fullWidth onClick={handleApply}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default Filter;
