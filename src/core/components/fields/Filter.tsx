/** Filter dropdown menu component with radio-button groups and date range filters, emitting filter changes. */
import React, { useState } from "react";
import {
    Menu,
    FormControlLabel,
    Box,
    Divider,
    Radio,
    RadioGroup,
    Typography,
    IconButton,
    Badge,
    Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DateTime from "@/core/components/fields/DateTime";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";
import { FilterKeys } from "@/core/types";
import { useTheme, alpha } from "@mui/material/styles";

export interface FilterOptionValue {
    key: string | number | boolean;
    value: string;
}

export type FilterValueItem = string | FilterOptionValue;

export interface FilterOption {
    name: string;
    key: string;
    values: FilterValueItem[];
}

interface FilterProps {
    filterOptions?: FilterOption[];
    onChange?: (filters: FilterKeys) => void;
}

const DATE_KEYS = ["date", "startDate", "endDate"];

const Filter: React.FC<FilterProps> = ({ filterOptions = [], onChange }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const emptySelected = Object.fromEntries(filterOptions.map((f) => [f.key, null]));

    const [selected, setSelected] = useState<Record<string, string | null>>(emptySelected);
    const [tempSelected, setTempSelected] = useState<Record<string, string | null>>(emptySelected);

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
                {/* Scrollable filter options */}
                <Box px={2} py={1} minWidth={260} maxHeight={420} overflow="auto">
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
                                    {values.map((item) => {
                                        const isObj = typeof item === "object" && item !== null;
                                        const itemKey = isObj ? String(item.key) : String(item);
                                        const itemLabel = isObj ? item.value : String(item);
                                        return (
                                            <FormControlLabel
                                                key={itemKey}
                                                value={itemKey}
                                                control={<Radio size="small" />}
                                                label={itemLabel}
                                            />
                                        );
                                    })}
                                </RadioGroup>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Sticky footer — always visible, never scrolls away */}
                <Box
                    px={2}
                    py={1}
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        bgcolor: "background.paper",
                        zIndex: 1,
                    }}
                >
                    <Divider sx={{ mb: 1 }} />
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Tooltip title="Clear filters">
                            <IconButton
                                onClick={handleClear}
                                sx={{
                                    ...iconBtnFilledSx,
                                    bgcolor: "error.main",
                                    "&:hover": {
                                        bgcolor: "error.dark",
                                    },
                                }}
                            >
                                <ClearAllIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Apply filters">
                            <IconButton onClick={handleApply} sx={iconBtnFilledSx}>
                                <CheckIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default Filter;
