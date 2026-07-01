import { useMediaQuery } from "@mui/material";
import React, { createContext, useContext } from "react";

export interface UIContextType {
    isMobile: boolean;
    isBatchEnabled?: boolean;
    isEnabled?: (feature: any) => boolean;
    isAdmin?: boolean;
    FEATURE_KEYS?: any;
    DEBUG?: boolean;
}

export const UIContext = createContext<UIContextType>({
    isMobile: false,
});

export interface UIProviderProps {
    children: React.ReactNode;
    value?: UIContextType;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children, value }) => {
    const isMobile = useMediaQuery("(max-width: 1000px)");

    // Support custom value override, default to fallback
    const contextValue = value || { isMobile };

    return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
