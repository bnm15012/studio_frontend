import React, { useEffect, useMemo } from "react";
import { HashRouter as Router } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "@/core/utils/theme";
import { AllRoutes } from "@/NavigationComponets/AllRoutes";
import { AlertProvider } from "@/core/components/feedback/Alert";
import { clearCacheIfNewDay } from "./utils/cacheManager";
import { loadInitialDataAPI } from "./utils/loadInitialData";
import { UIProvider } from "./context/UIContext";
import ServerErrorDialog from '@/core/components/dialogs/ServerErrorDialog';
import { useAppDispatch, useAppSelector } from "@/state";

const App: React.FC = () => {
    const mode = useAppSelector((state) => state.auth.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode) as any), [mode]);
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        clearCacheIfNewDay();
        if (token) {
            dispatch(loadInitialDataAPI() as any);
        }
    }, [dispatch, token]);

    return (
        <AlertProvider>
            <Router>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <UIProvider>
                        <AllRoutes />
                        <ServerErrorDialog />
                    </UIProvider>
                </ThemeProvider>
            </Router>
        </AlertProvider>
    );
};

export default App;
