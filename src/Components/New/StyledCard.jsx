import { Card, CardContent, CardActions, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export const StyledCardContainer = styled(Box)(({ theme, layout }) => ({
    display: "grid",
    gap: theme.spacing(3),

    ...(layout === "horizontal"
        ? {
              gridAutoFlow: "column",
              gridAutoColumns: "20rem",
              overflowX: "auto",
              overflowY: "hidden",
          }
        : {
              gridTemplateColumns: "repeat(auto-fill, minmax(19rem, 1fr))",
          }),
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    position: "relative",
    display: "flex",
    gap: theme.spacing(1.5),
    height: "100%",
    flexDirection: "column",
    background: theme.palette.background.paper,
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    position: "relative",
    justifyContent: "flex-end",
    background: theme.palette.background.paper,
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
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    position: "relative",
}));

export const StyledMotionCard = ({ children, elevation = 3, ...props }) => {
    const theme = useTheme();
    return (
        <StyledCardBase
            elevation={elevation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{
                y: -5,
                boxShadow: theme.shadows[10],
            }}
            {...props}
            sx={{ boxShadow: theme.shadows[7] }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            {children}
        </StyledCardBase>
    );
};

StyledMotionCard.propTypes = {
    children: PropTypes.node.isRequired,
    elevation: PropTypes.number,
};
