/** Reusable styled dialog component with title, actions (confirm/cancel), close icon, slide transition, and optional title background color. */
import React, { forwardRef } from "react";
import { styled } from "@mui/system";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slide,
    SlideProps,
    IconButton,
    Tooltip,
    useTheme,
    DialogProps,
    SxProps,
    Theme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUI } from "@/context/UIContext";

const Transition = forwardRef(function Transition(
    props: SlideProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type TitleBgKey = "success" | "warning" | "error" | "info";

const TITLE_BGs = (theme: Theme): Record<TitleBgKey, string> => ({
    success: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    warning: `linear-gradient(to bottom, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
    error: `linear-gradient(to bottom, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
    info: `linear-gradient(to bottom, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
});

const StyledDialogBase = styled(Dialog)(() => ({
    "& .MuiBackdrop-root": {
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
}));

export interface DialogAction {
    key: string;
    tip?: string;
    sx?: SxProps<Theme>;
    onClick?: () => void;
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success" | "inherit";
    disabled?: boolean;
    component: React.ReactNode;
}

export interface StyledDialogProps extends Omit<DialogProps, "open" | "onClose"> {
    open: boolean;
    onClose: () => void;
    closeIcon?: boolean;
    title?: string;
    children?: React.ReactNode;
    confirmText?: string | React.ReactNode;
    cancelText?: string;
    onConfirm?: () => void;
    confirmDisabled?: boolean;
    actions?: DialogAction[];
    titleBgColor?: TitleBgKey;
    fullScreen?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | false | string;
}

const StyledDialog: React.FC<StyledDialogProps> = ({
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
    fullScreen = false,
    size = "md",
    ...props
}) => {
    const { isMobile } = useUI();
    const theme = useTheme();
    const backgrounds = TITLE_BGs(theme);
    const isFullScreen = fullScreen || false;
    return (
        <StyledDialogBase
            open={open}
            onClose={onClose}
            slots={{ transition: isMobile || isFullScreen ? Transition : undefined }}
            fullWidth
            fullScreen={isFullScreen}
            maxWidth={(size as "xs" | "sm" | "md" | "lg" | "xl" | false) || props.maxWidth}
            {...props}
        >
            <DialogTitle
                sx={{
                    background: backgrounds[titleBgColor],
                    color: "white",
                    textAlign: "center",
                    mb: 2,
                }}
            >
                {title && <>{title}</>}
                {closeIcon && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent>{children}</DialogContent>

            <DialogActions
                sx={{
                    justifyContent: isMobile ? "center" : "right",
                    px: 2,
                    overflowY: "auto",
                }}
            >
                {/* Default Cancel button */}
                {!closeIcon && (
                    <Button onClick={onClose} variant="text">
                        {cancelText}
                    </Button>
                )}

                {/* Any extra custom buttons */}
                {actions.map((action) => (
                    <Tooltip key={action.key} title={action.tip} sx={{ ml: 1 }}>
                        <Button
                            sx={{ cursor: "pointer", ...action.sx }}
                            onClick={action.onClick}
                            variant={action.variant || "text"}
                            color={action.color || "primary"}
                            disabled={action.disabled || false}
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
                        variant="contained"
                        sx={{ ml: 1, color: "white" }}
                    >
                        {confirmText}
                    </Button>
                )}
            </DialogActions>
        </StyledDialogBase>
    );
};

export default StyledDialog;
