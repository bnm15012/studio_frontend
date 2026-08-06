import React, { useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import { AllRoutes } from "@/NavigationComponets/AllRoutes";
import { AlertProvider } from "@/core/components/feedback/Alert";
import { clearCacheIfNewDay } from "@/core/utils/cacheManager";
import { loadInitialDataAPI } from "@/utils/loadInitialData";
import { useAppDispatch, useAppSelector } from "@/state";
import { ThemeContextProvider } from "@/core/utils/theme/ThemeProvider";

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        clearCacheIfNewDay();
        if (token) {
            dispatch(loadInitialDataAPI());
        }
    }, [dispatch, token]);

    return (
        <AlertProvider>
            <Router>
                <ThemeContextProvider>
                    <AllRoutes />
                </ThemeContextProvider>
            </Router>
        </AlertProvider>
    );
};

export default App;
