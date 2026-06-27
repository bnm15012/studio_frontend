import { Button, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";

/**
 * SaveCancelButtons
 *
 * Reusable Save + Cancel button pair, used in:
 *  - FormView sticky save bar
 *  - DialogForm action buttons
 *
 * Props:
 *  - onSave    : called when Save is clicked
 *  - onCancel  : called when Cancel is clicked
 *  - loading   : disables both buttons while true
 *  - size      : MUI button size ("small" | "medium")
 *  - saveLabel : override Save button text (default "Save changes")
 *  - hideLabels: if true shows icons only (for compact/mobile use)
 */
const SaveCancelButtons = ({
    onSave,
    onCancel,
    loading = false,
    size = "medium",
    saveLabel = "Save changes",
    cancelLabel = "Cancel",
    hideLabels = false,
    fullWidth = false,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", gap: 1.5, width: fullWidth ? "100%" : "auto" }}>
            <Button
                variant="outlined"
                size={size}
                disabled={loading}
                onClick={onCancel}
                startIcon={<CancelIcon />}
                fullWidth={fullWidth}
                sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    borderColor: alpha(theme.palette.error.main, 0.4),
                    color: theme.palette.error.main,
                    "&:hover": {
                        borderColor: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.06),
                    },
                }}
            >
                {hideLabels ? "" : cancelLabel}
            </Button>

            <Button
                variant="contained"
                size={size}
                disabled={loading}
                onClick={onSave}
                startIcon={<SaveIcon />}
                fullWidth={fullWidth}
                sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                    "&:hover": {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.48)}`,
                    },
                }}
            >
                {hideLabels ? "" : saveLabel}
            </Button>
        </Box>
    );
};

SaveCancelButtons.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    saveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    hideLabels: PropTypes.bool,
    fullWidth: PropTypes.bool,
};

export default SaveCancelButtons;
