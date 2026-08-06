/** Toolbar shown above lists/cards when rows are selected, displaying count and bulk action buttons. */
import React from "react";
import { Toolbar, Checkbox, Box, Typography, Chip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ActionItem, CrudRecord } from "@/core/types";
import Actions from "@/core/crud/helper/Actions";
import { FlexEvenly } from "@/core/components/layout/FlexBox";

// ─────────────────────────────────────────────────────────────────────────────
// SelectionToolbar
// Shown above the list/card grid when 1+ rows are selected.
// ─────────────────────────────────────────────────────────────────────────────
interface SelectionToolbarProps<T extends CrudRecord> {
    selectedCount: number;
    selectedRowsData: T[];
    multiActions: ActionItem<T>[];
    /** "chip" (ListView style) | "text" (CardView style). Default: "chip" */
    labelVariant?: "chip" | "text";
}

export function SelectionToolbar<T extends CrudRecord>({
    selectedCount,
    selectedRowsData,
    multiActions,
    labelVariant = "chip",
}: SelectionToolbarProps<T>) {
    const theme = useTheme();

    return (
        <Toolbar
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "3rem",
                minHeight: "3rem !important",
                px: 2,
                my: 1,
                borderRadius: "12px",
                backgroundColor: alpha(theme.palette.primary.main, 0.07),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                animation: "selFadeIn 0.15s ease-in-out",
                "@keyframes selFadeIn": {
                    from: { opacity: 0, transform: "translateY(-8px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {labelVariant === "chip" ? (
                <Chip color="primary" label={`${selectedCount} selected`} size="small" />
            ) : (
                <Typography variant="body2" fontWeight={500} color="primary.main">
                    {selectedCount} selected
                </Typography>
            )}
            <FlexEvenly>
                <Actions actions={multiActions} row={selectedRowsData} />
            </FlexEvenly>
        </Toolbar>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectAllBar
// A "Select all (N)" checkbox row above card grids (CardView only needs this).
// ─────────────────────────────────────────────────────────────────────────────
interface SelectAllBarProps {
    totalCount: number;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SelectAllBar({
    totalCount,
    isAllSelected,
    isIndeterminate,
    onChange,
}: SelectAllBarProps) {
    return (
        <Box display="flex" alignItems="center" gap={0.75} mb={1} px={0.5}>
            <Checkbox
                color="primary"
                indeterminate={isIndeterminate}
                checked={isAllSelected}
                onChange={onChange}
                size="small"
                sx={{ p: 0.5 }}
            />
            <Typography
                variant="body2"
                fontWeight={450}
                color="text.secondary"
                sx={{ fontSize: "0.8125rem" }}
            >
                Select all ({totalCount})
            </Typography>
        </Box>
    );
}
