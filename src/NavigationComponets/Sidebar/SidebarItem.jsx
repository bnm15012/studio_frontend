import { Box, ListItemButton, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const SidebarItem = ({ route, isSelected, onClick, isNonMobileScreens }) => {
    const theme = useTheme();

    return (
        <ListItemButton
            selected={isSelected}
            onClick={onClick}
            sx={{
                m: "0.2rem",
                py: "1rem",
                borderRadius: "0.75rem",
                flexDirection: isNonMobileScreens ? "row" : "column",
                justifyContent: isNonMobileScreens ? "left" : "center",
                alignItems: "center",
                transition: "all 0.25s ease-in-out",
                color: "white",
                "&.Mui-selected": { bgcolor: theme.palette.primary.main },
                "&.Mui-selected:hover": { bgcolor: theme.palette.primary.dark },
                "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
        >
            <Box fontSize={"2.4rem"} display="flex" alignItems="center" justifyContent="center">
                {route.icon}
            </Box>

            <Typography
                fontSize={"1rem"}
                mx={isNonMobileScreens ? 2 : "0.25rem"}
                fontWeight={isSelected && isNonMobileScreens ? 700 : 400}
                color="inherit"
                textAlign="center"
            >
                {route.label}
            </Typography>
        </ListItemButton>
    );
};

SidebarItem.propTypes = {
    route: PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.element.isRequired,
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    isNonMobileScreens: PropTypes.bool.isRequired,
};

export default SidebarItem;
