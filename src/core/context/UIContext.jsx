import { useMediaQuery } from "@mui/material";
import { createContext, useContext } from "react";
import PropTypes from "prop-types";

export const UIContext = createContext({
    isMobile: false,
});

export const UIProvider = ({ children, value }) => {
    const isMobile = useMediaQuery("(max-width: 1000px)");

    // Support custom value override, default to fallback
    const contextValue = value || { isMobile };

    return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

UIProvider.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.object,
};

export const useUI = () => useContext(UIContext);
