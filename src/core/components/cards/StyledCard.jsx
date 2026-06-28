import { Card, CardContent, CardActions, Box } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    paddingBottom: theme.spacing(10),
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fill, minmax(min(17rem, 100%), 1fr))",
    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(1.5),
        gridTemplateColumns: "1fr",
    },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    position: "relative",
    display: "flex",
    gap: theme.spacing(0.5),
    padding: theme.spacing(2, 2.5),
    height: "100%",
    flexDirection: "column",
    background: theme.palette.background.paper,
    "&:last-child": {
        paddingBottom: theme.spacing(2),
    },
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    position: "relative",
    justifyContent: "space-evenly",
    background: theme.palette.background.paper,
    padding: theme.spacing(0.5, 1),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    minHeight: 48,
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
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    "&:active": {
        transform: "scale(0.98)",
    },
}));

export const StyledMotionCard = ({ children, elevation = 3, ...props }) => {
    const theme = useTheme();
    return (
        <StyledCardBase
            elevation={0}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            whileHover={{
                y: -2,
                boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.08)}`,
            }}
            whileTap={{ scale: 0.985 }}
            {...props}
            sx={{
                boxShadow: `0 1px 3px ${alpha(theme.palette.text.primary, 0.06)}, 0 1px 2px ${alpha(theme.palette.text.primary, 0.04)}`,
                ...props.sx,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {children}
        </StyledCardBase>
    );
};

StyledMotionCard.propTypes = {
    children: PropTypes.node.isRequired,
    elevation: PropTypes.number,
};
