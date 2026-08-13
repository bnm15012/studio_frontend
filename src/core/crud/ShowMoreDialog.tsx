/** Sleek dialog wrapper for showing extra details in a modal with modern trigger styles. */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Box, SxProps, Theme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StyledDialog from "@/core/components/dialogs/StyledDialog";

interface ShowMoreDialogProps {
    children?: React.ReactNode;
    title: string;
    buttonText?: string;
    variant?: "pill" | "icon" | "text";
    sx?: SxProps<Theme>;
}

const ShowMoreDialog: React.FC<ShowMoreDialogProps> = ({
    children,
    title,
    buttonText = "Details",
    variant = "pill",
    sx,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {variant === "icon" ? (
                <Tooltip title={title}>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(true)}
                        sx={{
                            color: "text.secondary",
                            p: 0.5,
                            "&:hover": {
                                color: "primary.main",
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                            },
                            ...sx,
                        }}
                    >
                        <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    size="small"
                    onClick={() => setOpen(true)}
                    endIcon={<ChevronRightIcon sx={{ fontSize: "0.95rem !important", ml: -0.5 }} />}
                    sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                        fontWeight: 550,
                        letterSpacing: 0.2,
                        borderRadius: "16px",
                        px: 1.25,
                        py: 0.35,
                        minHeight: 26,
                        color: "primary.main",
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.16),
                            transform: "translateX(1px)",
                        },
                        ...sx,
                    }}
                >
                    {buttonText}
                </Button>
            )}

            <StyledDialog title={title} onClose={() => setOpen(false)} open={open} closeIcon={true}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</Box>
            </StyledDialog>
        </>
    );
};

export default ShowMoreDialog;
