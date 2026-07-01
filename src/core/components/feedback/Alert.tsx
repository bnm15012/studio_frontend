import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";

type ShowAlertFn = (message: string, severity?: AlertColor) => void;

const AlertContext = createContext<ShowAlertFn>(() => {});

interface AlertState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: "",
        severity: "info",
    });

    const showAlert = useCallback<ShowAlertFn>((message, severity = "info") => {
        setAlert({ open: true, message, severity });
    }, []);

    const handleClose = () => {
        setAlert((prevAlert) => ({ ...prevAlert, open: false }));
    };

    return (
        <AlertContext.Provider value={showAlert}>
            {children}
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity={alert.severity} variant="filled">
                    {alert.message}
                </MuiAlert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export const useAlert = (): ShowAlertFn => useContext(AlertContext);
