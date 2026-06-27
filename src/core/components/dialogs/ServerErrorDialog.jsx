import axios from "axios";
import { useState, useEffect } from "react";
import { DialogContent } from "@mui/material";
import StyledDialog from "./StyledDialog";

const ServerErrorDialog = () => {
    const [serverDown, setServerDown] = useState(false);
    const pingServer = async () => {
        let attempts = 0;
        let isServerUp = true;

        while (attempts < 5) {
            isServerUp = await checkServerStatus();
            if (isServerUp) {
                break;
            }
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!isServerUp) {
            setServerDown(true);
        }
    };

    useEffect(() => {
        pingServer();
    }, []);

    return (
        <StyledDialog
            title="Connection Error"
            titleBgColor={"error"}
            open={serverDown}
            cancelText="Close"
            onClose={() => setServerDown(false)}
        >
            <DialogContent>
                Internet not connected or the server is down. Please check your connection. or check
                after some time!
            </DialogContent>
        </StyledDialog>
    );
};

export default ServerErrorDialog;

const checkServerStatus = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_REST_API}/swagger-ui/index.html#/`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 5000, // milliseconds
            },
        );
        return response.status === 200;
    } catch (error) {
        console.error("Server is down or unreachable:", error);
        return false;
    }
};
