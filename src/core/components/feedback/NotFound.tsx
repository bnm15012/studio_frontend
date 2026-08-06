import React from "react";
import { Box, Typography, Button, Paper, SxProps, Theme } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export interface NotFoundProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionText?: string;
    onAction?: () => void;
    action?: React.ReactNode;
    minHeight?: string | number;
    sx?: SxProps<Theme>;
}

export const NotFound: React.FC<NotFoundProps> = ({
    title = "Not Found",
    message = "The resource you are looking for does not exist or has been removed.",
    icon,
    actionText,
    onAction,
    action,
    minHeight = "60vh",
    sx,
}) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: minHeight,
            width: "100%",
            p: 3,
            textAlign: "center",
            ...sx,
        }}
    >
        <Paper
            elevation={0}
            sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 480,
                width: "100%",
                background: (theme) =>
                    theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                border: (theme) => `1px dashed ${theme.palette.divider}`,
                backdropFilter: "blur(8px)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                },
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(239, 68, 68, 0.08)",
                    color: "error.main",
                    mb: 2.5,
                }}
            >
                {icon || <SearchOffIcon sx={{ fontSize: 36 }} />}
            </Box>

            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: "text.primary" }}>
                {title}
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: actionText || action ? 3 : 0, maxWidth: 360 }}
            >
                {message}
            </Typography>

            {action ? (
                action
            ) : actionText && onAction ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onAction}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    {actionText}
                </Button>
            ) : null}
        </Paper>
    </Box>
);

export default NotFound;
