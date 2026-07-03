import React from "react";
import { Card, CardContent, CardActions, Box, SxProps, Theme } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    paddingBottom: theme.spacing(10),
    gap: theme.spacing(1.25),
    gridTemplateColumns: "repeat(auto-fill, minmax(min(17rem, 100%), 1fr))",
    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(1),
        gridTemplateColumns: "1fr",
    },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    position: "relative",
    display: "flex",
    gap: theme.spacing(0.25),
    padding: theme.spacing(1.5, 1.75),
    height: "100%",
    flexDirection: "column",
    background: theme.palette.background.paper,
    "&:last-child": {
        paddingBottom: theme.spacing(1.5),
    },
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    position: "relative",
    justifyContent: "space-evenly",
    flexDirection: "column",
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 0.5),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
    minHeight: 40,
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
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    "&:active": {
        transform: "scale(0.985)",
    },
}));

interface StyledMotionCardProps {
    children: React.ReactNode;
    elevation?: number;
    sx?: SxProps<Theme>;
    [key: string]: unknown;
}

export const StyledMotionCard: React.FC<StyledMotionCardProps> = ({ children, elevation = 3, ...props }) => {
    const theme = useTheme();
    return (
        <StyledCardBase
            elevation={0}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{
                y: -1,
                boxShadow: `0 4px 16px ${alpha(theme.palette.text.primary, 0.07)}`,
            }}
            whileTap={{ scale: 0.985 }}
            {...props}
            sx={{
                boxShadow: `0 1px 2px ${alpha(theme.palette.text.primary, 0.05)}`,
                ...props.sx,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {children}
        </StyledCardBase>
    );
};
