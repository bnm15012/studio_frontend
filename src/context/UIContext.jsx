import { useMediaQuery } from "@mui/material";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";

const UIContext = createContext({
    isMobile: false,
    isBatchEnabled: false,
    isEnabled: () => false,
    isAdmin: false,
    FEATURE_KEYS: FEATURE_KEYS,
    DEBUG: false,
});

export const UIProvider = ({ children }) => {
    const settings = useSelector((state) => state.auth.settings);
    const user = useSelector((state) => state.auth.user);
    const isMobile = useMediaQuery("(max-width: 1000px)");
    const isAdmin = user?.role === "ADMIN";
    const DEBUG = import.meta.env.VITE_DEBUG === "true";

    const { isEnabled } = useFeatureFlags(settings, user?.userAccessEntry);
    const isBatchEnabled = isEnabled(FEATURE_KEYS.BATCH);

    return (
        <UIContext.Provider
            value={{ isMobile, isBatchEnabled, isEnabled, isAdmin, FEATURE_KEYS, DEBUG }}
        >
            {children}
        </UIContext.Provider>
    );
};

UIProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useUI = () => useContext(UIContext);
