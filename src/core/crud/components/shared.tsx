/**
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
import Actions from "../helper/Actions";
import { ActionItem } from "../../types";

// ── FadeIn ─────────────────────────────────────────────────────────────────
interface FadeInProps {
    children: React.ReactNode;
    animKey?: unknown;
    y?: number;
    duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, animKey, y = 6, duration = 0.22 }) => (
    <motion.div
        key={animKey}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

// ── RowActions ──────────────────────────────────────────────────────────────
interface RowActionsProps {
    isEditing: boolean;
    rowId?: string | number;
    handleSave?: (rowId: string | number) => void | Promise<void>;
    handleCancel?: () => void;
    actions: ActionItem[];
    row: Record<string, unknown>;
}

export const RowActions: React.FC<RowActionsProps> = ({
    isEditing,
    rowId,
    handleSave,
    handleCancel,
    actions,
    row,
}) => {
    if (isEditing) {
        return (
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small" color="primary" onClick={() => handleSave?.(rowId)}>
                    <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={handleCancel}>
                    <CancelIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }
    return <Actions actions={actions} row={row} />;
};

// ── RowNumber ───────────────────────────────────────────────────────────────
interface TableState {
    currentPage: string | number;
    pageSize: number;
}

export const getRowNumber = (tableState: TableState, rowIndex: number): number =>
    (parseInt(String(tableState.currentPage)) - 1) * tableState.pageSize + rowIndex + 1;

// ── EmptyState ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
    message?: string;
    sx?: SxProps<Theme>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "No data available", sx }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Typography color="text.secondary" sx={sx}>
            {message}
        </Typography>
    </motion.div>
);
