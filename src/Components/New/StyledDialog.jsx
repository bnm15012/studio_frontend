import { forwardRef } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/system";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slide,
    IconButton,
    Tooltip,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUI } from "../../context/UIContext";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const TITLE_BGs = (theme) => ({
    success: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    warning: `linear-gradient(to bottom, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
    error: `linear-gradient(to bottom, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
    info: `linear-gradient(to bottom, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
});

const StyledDialogBase = styled(Dialog)(({ theme }) => ({
    "& .MuiBackdrop-root": {
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
}));

const StyledDialog = ({
    open,
    onClose,
    closeIcon,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmDisabled = false,
    actions = [],
    titleBgColor = "success",
    ...props
}) => {
    const { isMobile } = useUI();
    const theme = useTheme();
    const backgrounds = TITLE_BGs(theme);
    return (
        <StyledDialogBase
            open={open}
            onClose={onClose}
            slots={{ transition: isMobile ? Transition : undefined }}
            sx={{
                "& .MuiDialog-paper": isMobile
                    ? {
                          position: "fixed",
                          bottom: 0,
                          margin: 0,
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                          width: "100%",
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: theme.shadows[8],
                      }
                    : {},
            }}
            fullWidth
            maxWidth="xs"
            {...props}
        >
            <DialogTitle
                sx={{ background: backgrounds[titleBgColor], color: "white", textAlign: "center" }}
            >
                {title && <>{title}</>}
                {closeIcon && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon sx={{ color: "white" }} />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent>{children}</DialogContent>

            <DialogActions
                sx={{ justifyContent: isMobile ? "center" : "right", px: 2, overflowY: "auto" }}
            >
                {/* Default Cancel button */}
                {!closeIcon && (
                    <Button onClick={onClose} variant="text">
                        {cancelText}
                    </Button>
                )}

                {/* Any extra custom buttons */}
                {actions.map((action) => (
                    <Tooltip key={action.key} title={action?.tip} sx={{ ml: 1 }}>
                        <Button
                            sx={action?.sx}
                            onClick={action?.onClick}
                            variant={action?.variant || "text"}
                            color={action?.color || "primary"}
                            disabled={action?.disabled || false}
                        >
                            {action.component}
                        </Button>
                    </Tooltip>
                ))}

                {/* Default Confirm button */}
                {onConfirm && (
                    <Button
                        disabled={confirmDisabled}
                        onClick={onConfirm}
                        color="primary"
                        variant="contained"
                        sx={{ ml: 1 }}
                    >
                        {confirmText}
                    </Button>
                )}
            </DialogActions>
        </StyledDialogBase>
    );
};

StyledDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    closeIcon: PropTypes.bool,
    titleBgColor: PropTypes.string,
    onConfirm: PropTypes.func,
    confirmDisabled: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object),
};

export default StyledDialog;
