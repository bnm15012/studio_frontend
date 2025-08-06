import { Box, ListItemButton, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";


const SidebarItem = ({
  route,
  isSelected,
  onClick,
  isNonMobileScreens,
}) => {
  const theme = useTheme();

  return (
    <ListItemButton
      selected={isSelected}
      onClick={onClick}
      sx={{
        m: "0.2rem",
        py: "1rem",
        borderRadius: "0.75rem",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        transition: "all 0.25s ease-in-out",
        color: "white",
        "&.Mui-selected": {
          bgcolor: theme.palette.primary.main,
        },
        "&.Mui-selected:hover": {
          bgcolor: theme.palette.primary.dark,
        },
        "&:hover": {
          bgcolor: theme.palette.primary.dark,
        },
      }}
    >
      <Box
        fontSize={isNonMobileScreens ? "2.4rem" : "2rem"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {route.icon}
      </Box>

      <Typography
        fontSize={isNonMobileScreens ? "1rem" : "0.85rem"}
        mx={2}
        fontWeight={isSelected ? 700 : 200}
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
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isNonMobileScreens: PropTypes.bool.isRequired,
};
export default SidebarItem;
