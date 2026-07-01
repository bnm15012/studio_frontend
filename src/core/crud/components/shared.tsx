/**
 * Shared micro-components for the Views subsystem.
 *
 * Extracted to keep ListView, CardView and FormView DRY:
 *   - FadeIn         — animated entrance wrapper (replaces scattered motion.div boilerplate)
 *   - RowActions     — "editing controls OR action buttons" switch used in every row
 *   - RowNumber      — serial number calculation shared by desktop table and mobile card
 *   - EmptyState     — animated empty-data message
 */

import { Box, IconButton, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Actions from "../helper/Actions";

// ── FadeIn ─────────────────────────────────────────────────────────────────
/**
 * Lightweight animated entrance wrapper.
 *
 * @prop {React.ReactNode} children
 * @prop {any}    animKey  — change this value to re-trigger the animation (e.g. formKey, page)
 * @prop {number} y        — vertical slide distance in px (default 6)
 * @prop {number} duration — animation duration in seconds (default 0.22)
 */
export const FadeIn = ({ children, animKey, y = 6, duration = 0.22 }) => (
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

FadeIn.propTypes = {
    children: PropTypes.node.isRequired,
    animKey: PropTypes.any,
    y: PropTypes.number,
    duration: PropTypes.number,
};

// ── RowActions ──────────────────────────────────────────────────────────────
/**
 * Renders Save/Cancel controls while a row is being edited,
 * or the regular action buttons otherwise.
 *
 * Used in both DesktopTable cells and MobileRowCard headers.
 */
export const RowActions = ({ isEditing, rowId, handleSave, handleCancel, actions, row }) => {
    if (isEditing) {
        return (
            <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small" color="primary" onClick={() => handleSave(rowId)}>
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

RowActions.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    rowId: PropTypes.any,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    actions: PropTypes.array,
    row: PropTypes.any,
};

// ── RowNumber ───────────────────────────────────────────────────────────────
/**
 * Computes the global serial number for a row (accounts for pagination).
 * Returns a plain number — render however you need.
 *
 * @param {object} tableState  — { currentPage, pageSize }
 * @param {number} rowIndex    — 0-based index within the current page
 */
export const getRowNumber = (tableState, rowIndex) =>
    (parseInt(tableState.currentPage) - 1) * tableState.pageSize + rowIndex + 1;

// ── EmptyState ──────────────────────────────────────────────────────────────
/**
 * Animated "no data" message.
 *
 * @prop {string} message  — override the default message if needed
 * @prop {object} sx       — extra MUI sx styles on the Typography
 */
export const EmptyState = ({ message = "No data available", sx }) => (
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

EmptyState.propTypes = {
    message: PropTypes.string,
    sx: PropTypes.object,
};
