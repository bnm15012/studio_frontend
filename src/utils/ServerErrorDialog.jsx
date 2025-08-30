
import axios from 'axios';

const checkServerStatus = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_REST_API}/swagger-ui/index.html#/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 seconds timeout
    });
    return response.status === 200;
  } catch (error) {
    console.error("Server is down or unreachable:", error);
    return false;
  }
};



import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme } from "@mui/material";

const ServerErrorDialog = () => {
  const [serverDown, setServerDown] = useState(false);
  const { palette } = useTheme();
  const pingServer = async () => {
    let attempts = 0;
    let isServerUp = true;

    while (attempts < 5) {
      isServerUp = await checkServerStatus();
      if (isServerUp) {
        break;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }

    if (!isServerUp) {
      setServerDown(true);
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <Dialog open={serverDown} onClose={() => setServerDown(false)}>
      <DialogTitle sx={{ backgroundColor: palette.primary }}>Connection Error</DialogTitle>
      <DialogContent>
        Internet not connected or the server is down. Please check your connection. or check after some time!
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setServerDown(false)} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerErrorDialog;
