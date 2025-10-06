import { useEffect, useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./utils/theme";
import { AllRoutes } from "./NavigationComponets/AllRoutes";
import { AlertProvider } from "./utils/Alert";
import ServerErrorDialog from "./utils/ServerErrorDialog";
import { clearCacheIfNewDay } from "./utils/cacheManager";
import { loadInitialDataAPI } from "./utils/loadInitialData";
import { UIProvider } from "./context/UIContext";

const App = () => {
    const mode = useSelector((state) => state.auth.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

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
                    <UIProvider>
                        <AllRoutes />
                    </UIProvider>
                    <ServerErrorDialog />
                </ThemeProvider>
            </Router>
        </AlertProvider>
    );
};

export default App;
