import { Card, CardContent, CardActions, Box } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    paddingBottom: theme.spacing(10),
    gap: theme.spacing(3),
    gridTemplateColumns: "repeat(auto-fill, minmax(min(17rem, 100%), 1fr))",
    [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(2),
    },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    position: "relative",
    display: "flex",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5),
    height: "100%",
    flexDirection: "column",
    background: theme.palette.background.paper,
    "&:last-child": {
        paddingBottom: theme.spacing(2.5),
    },
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    position: "relative",
    justifyContent: "flex-end",
    background: theme.palette.background.paper,
    padding: theme.spacing(1.5, 2.5),
    borderTop: `1px solid ${theme.palette.divider}`,
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
    border: `1px solid ${theme.palette.divider}`,
    borderLeft: `5px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
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
                y: -4,
                boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}`,
                borderLeftColor: theme.palette.primary.main,
            }}
            {...props}
            sx={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                ...props.sx,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {children}
        </StyledCardBase>
    );
};

StyledMotionCard.propTypes = {
    children: PropTypes.node.isRequired,
    elevation: PropTypes.number,
};
