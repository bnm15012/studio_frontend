import React, { createContext, useContext } from "react";
import { useMediaQuery } from "@mui/material";

export interface UIContextType {
    isMobile: boolean;
}

export function createUIContext<T extends UIContextType>() {
    const Context = createContext<T | undefined>(undefined);

    interface UIProviderProps {
        children: React.ReactNode;
        value?: Omit<T, "isMobile">;
    }

    const UIProvider: React.FC<UIProviderProps> = ({ children, value }) => {
        const isMobile = useMediaQuery("(max-width: 1000px)");

        const contextValue = {
            isMobile,
            ...(value ?? {}),
        } as T;

        return (
            <Context.Provider value={contextValue}>
                {children}
            </Context.Provider>
        );
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
