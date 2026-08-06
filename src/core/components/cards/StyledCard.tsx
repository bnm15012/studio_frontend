/** Styled MUI Card components (StyledCardContainer, StyledCardContent, StyledCardActions, StyledMotionCard) with responsive grid layout and framer-motion animations. */
import React from "react";
import { Card, CardContent, CardActions, Box, SxProps, Theme } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    paddingBottom: theme.spacing(10),
    gap: theme.spacing(1),
    gridTemplateColumns: "repeat(auto-fill, minmax(min(17rem, 100%), 1fr))",
    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(0.75),
        gridTemplateColumns: "1fr",
    },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    position: "relative",
    display: "flex",
    gap: theme.spacing(0.5),
    padding: theme.spacing(1.5, 2),
    height: "100%",
    flexDirection: "column",
    background: theme.palette.background.paper,
    "&:last-child": {
        paddingBottom: theme.spacing(1.5),
    },
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing(0.75),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0.75, 1.5),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    minHeight: 44,
}));

export const CardBadge = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 16,
    right: 16,
    background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 20,
    backdropFilter: "blur(10px)",
}));

const MotionCard = motion.create(Card);

const StyledCardBase = styled(MotionCard)(({ theme }) => ({
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: "none",
    position: "relative",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transition: "box-shadow 0.2s ease",
}));

interface StyledMotionCardProps {
    children: React.ReactNode;
    elevation?: number;
    sx?: SxProps<Theme>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
    onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
    onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
    role?: string;
    tabIndex?: number;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

export const StyledMotionCard: React.FC<StyledMotionCardProps> = ({ children, ...props }) => {
    const theme = useTheme();
    const shadowColor = theme.palette.mode === "dark" ? "255, 255, 255" : "0, 0, 0";
    return (
        <StyledCardBase
            elevation={0}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileTap={{ scale: 0.995 }}
            {...props}
            sx={{
                boxShadow: [
                    `0 1px 3px rgba(${shadowColor}, 0.08)`,
                    `0 1px 2px rgba(${shadowColor}, 0.06)`,
                ].join(", "),
                ...props.sx,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        >
            {children}
        </StyledCardBase>
    );
};
