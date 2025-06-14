import { Box, ListItemButton, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const SidebarItem = ({ route, isSelected, onClick, isNonMobileScreens }) => {
  const theme = useTheme();

  return (
    <ListItemButton
      selected={isSelected}
      onClick={onClick}
      alignItems={"center"}
      sx={{
        my: ".2rem",
        "&.Mui-selected": {
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        "&.Mui-selected:hover": {
          bgcolor: theme.palette.primary.light,
        },
        "&:hover": {
          bgcolor: theme.palette.primary.light,
        },
      }}
    >
      <Box>{route.icon}</Box>
      {isNonMobileScreens && (
        <Typography mx={2} fontSize={"1.2rem"}>
          {route.label}
        </Typography>
      )}
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
