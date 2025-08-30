import { useMediaQuery } from "@mui/material";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const UIContext = createContext({
  isMobile: false,
  isBatchEnabled: false,
  isMembershipTableEnabled: false,
});
export const UIProvider = ({ children }) => {
  const settings = useSelector((state) => state.auth.settings);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const user = useSelector((state) => state.auth.user)
  const isAdmin = user?.role === "ADMIN";
  const isBatchEnabled =
    settings?.find((setting) => setting.navBarName === "BATCH")?.enabled ?? false;
  const isMembershipTableEnabled =
    (settings?.find((setting) => setting.navBarName === "MEMBERSHIP_PLAN_TABLE")?.enabled && isAdmin) ?? false;

  return (
    <UIContext.Provider value={{ isMobile, isBatchEnabled, isMembershipTableEnabled, settings, isAdmin }}>
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUI = () => useContext(UIContext);
