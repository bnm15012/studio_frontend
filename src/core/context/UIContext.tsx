/** Factory function createUIContext() that builds a React context providing isMobile (via MUI useMediaQuery) plus any custom values. */
import React, { createContext, useContext } from "react";
import { useMediaQuery } from "@mui/material";

export interface UIContextType {
    isMobile: boolean;
}

export function createUIContext<T extends object>() {
    type ContextType = UIContextType & T;

    const Context = createContext<ContextType | undefined>(undefined);

    interface UIProviderProps {
        children: React.ReactNode;
        value: T;
    }

    const UIProvider: React.FC<UIProviderProps> = ({ children, value }) => {
        const isMobile = useMediaQuery("(max-width: 1000px)");

        const contextValue: ContextType = {
            isMobile,
            ...value,
        };

        return <Context.Provider value={contextValue}>{children}</Context.Provider>;
    };

    const useUI = () => {
        const context = useContext(Context);

        if (!context) {
            throw new Error("useUI must be used within UIProvider");
        }

        return context;
    };

    return {
        UIProvider,
        useUI,
        UIContext: Context,
    };
}
