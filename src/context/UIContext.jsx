import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useFeatureFlags } from "../hooks/useFeatureFlags";
import { FEATURE_KEYS } from "./feature_keys";
import { UIContext, useUI } from "../core/context/UIContext";

export { useUI };

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
