/** Shared micro-components for the Views subsystem (FadeIn, RowActions, RowNumber, EmptyState).
 * Shared micro-components for the Views subsystem.
 *
 * Extracted to keep ListView, CardView and FormView DRY:
 *   - FadeIn         — animated entrance wrapper (replaces scattered motion.div boilerplate)
 *   - RowActions     — "editing controls OR action buttons" switch used in every row
 *   - RowNumber      — serial number calculation shared by desktop table and mobile card
 *   - EmptyState     — animated empty-data message
 */

import React from "react";
import { Box, IconButton, Typography, SxProps, Theme } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import Actions from "@/core/crud/helper/Actions";
import { ActionItem, CrudRecord } from "@/core/types";

// ── FadeIn ─────────────────────────────────────────────────────────────────
interface FadeInProps {
    children: React.ReactNode;
    animKey?: unknown;
    y?: number;
    duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, animKey, y = 6, duration = 0.22 }) => (
    <motion.div
        key={String(animKey ?? "")}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

// ── RowActions ──────────────────────────────────────────────────────────────
interface RowActionsProps<T extends CrudRecord = CrudRecord> {
    isEditing: boolean;
    rowId?: number | undefined;
    handleSave?: ((rowId: number) => void | Promise<void>) | undefined;
    handleCancel?: (() => void) | undefined;
    actions: ActionItem<T>[];
    row: T;
}

export function RowActions<T extends CrudRecord = CrudRecord>({
    isEditing,
    rowId,
    handleSave,
    handleCancel,
    actions,
    row,
}: RowActionsProps<T>) {
    if (isEditing) {
        return (
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => rowId !== undefined && handleSave?.(rowId)}
                >
                    <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={handleCancel}>
                    <CancelIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }
    return <Actions actions={actions} row={row} />;
}

// ── EmptyState ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
    message?: string;
    sx?: SxProps<Theme>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "No data available", sx }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Typography component="span" color="text.secondary" sx={sx || {}}>
            {message}
        </Typography>
    </motion.div>
);
