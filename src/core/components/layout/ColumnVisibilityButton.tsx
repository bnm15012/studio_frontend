/**
 * ColumnVisibilityButton — a popover with checkboxes that lets the user
 * show/hide individual table columns. Visibility state is persisted to
 * localStorage under KEYS.COLUMN_VISIBILITY keyed by `tableKey`.
 *
 * Usage:
 *   <ColumnVisibilityButton
 *     tableKey="students"
 *     fields={fields}
 *     onVisibilityChange={setHiddenColumns}
 *   />
 */

import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    Popover,
    Tooltip,
    Typography,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { iconBtnFilledSx } from "./ActionButtonStyle";
import {
    ColumnVisibilityButtonProps,
    ColumnVisibilityMap,
    getStoredVisibility,
    storeVisibility,
} from "./columnVisibilityHelper";
import { Entity } from "@/core/types";

// ── Component ─────────────────────────────────────────────────────────────────

function ColumnVisibilityButton<T extends Entity = Entity>({
    tableKey,
    fields,
    onVisibilityChange,
}: ColumnVisibilityButtonProps<T>) {
    const triggerId = useId();
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    // Only include fields that have show=true or view=true (the ones that can appear in the list)
    const listableFields = useMemo(() => fields.filter((f) => f.show || f.view), [fields]);

    // Local state mirrors what's in localStorage so checkboxes re-render instantly
    const [visibilityMap, setVisibilityMap] = useState<ColumnVisibilityMap>(() =>
        getStoredVisibility(tableKey),
    );

    const handleToggle = useCallback(
        (fieldName: string, checked: boolean) => {
            setVisibilityMap((prev) => {
                const updated = { ...prev, [fieldName]: checked };
                storeVisibility(tableKey, updated);
                onVisibilityChange(updated);
                return updated;
            });
        },
        [tableKey, onVisibilityChange],
    );

    const handleSelectAll = useCallback(() => {
        const all: ColumnVisibilityMap = {};
        listableFields.forEach((f) => (all[f.name] = true));
        setVisibilityMap(all);
        storeVisibility(tableKey, all);
        onVisibilityChange(all);
    }, [listableFields, tableKey, onVisibilityChange]);

    const handleHideAll = useCallback(() => {
        const none: ColumnVisibilityMap = {};
        listableFields.forEach((f) => (none[f.name] = false));
        setVisibilityMap(none);
        storeVisibility(tableKey, none);
        onVisibilityChange(none);
    }, [listableFields, tableKey, onVisibilityChange]);

    const visibleCount = listableFields.filter((f) => visibilityMap[f.name] !== false).length;

    return (
        <>
            <Tooltip title="Show / Hide Columns">
                <IconButton
                    id={triggerId}
                    ref={anchorRef}
                    sx={iconBtnFilledSx}
                    onClick={() => setOpen(true)}
                    aria-label="column visibility"
                >
                    <ViewColumnIcon sx={{ fontSize: "1.25rem" }} />
                </IconButton>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchorRef.current}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 220,
                            maxHeight: 420,
                            borderRadius: 3,
                            boxShadow: 6,
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        Columns&nbsp;
                        <Typography component="span" variant="caption" color="text.secondary">
                            ({visibleCount}/{listableFields.length} shown)
                        </Typography>
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Typography
                            variant="caption"
                            color="primary.main"
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                            onClick={handleSelectAll}
                        >
                            All
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            /
                        </Typography>
                        <Typography
                            variant="caption"
                            color="error.main"
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                            onClick={handleHideAll}
                        >
                            None
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Column list */}
                <Box sx={{ overflowY: "auto", px: 1, py: 0.5 }}>
                    {listableFields.map((field) => {
                        const isVisible = visibilityMap[field.name] !== false;
                        return (
                            <FormControlLabel
                                key={field.name}
                                label={
                                    <Typography variant="body2">
                                        {field.label ?? field.name}
                                    </Typography>
                                }
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={isVisible}
                                        onChange={(_, checked) => handleToggle(field.name, checked)}
                                        color="primary"
                                    />
                                }
                                sx={{
                                    display: "flex",
                                    mx: 0,
                                    px: 0.5,
                                    borderRadius: 1,
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                            />
                        );
                    })}
                </Box>
            </Popover>
        </>
    );
}

export default ColumnVisibilityButton;
