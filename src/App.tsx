import React, { useEffect, useMemo } from "react";
import { HashRouter as Router } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "@/core/utils/theme";
import { AllRoutes } from "@/NavigationComponets/AllRoutes";
import { AlertProvider } from "@/core/components/feedback/Alert";
import { clearCacheIfNewDay } from "./utils/cacheManager";
import { loadInitialDataAPI } from "./utils/loadInitialData";
import { useAppDispatch, useAppSelector } from "@/state";

const App: React.FC = () => {
    const mode = useAppSelector((state) => state.auth.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
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
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AllRoutes />
                </ThemeProvider>
            </Router>
        </AlertProvider>
    );
};

export default App;
