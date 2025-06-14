import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = useCallback((message, severity = "info") => {
    setAlert({ open: true, message, severity });
  }, []);

  const handleClose = () => {
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert
          onClose={handleClose}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(AlertContext);
