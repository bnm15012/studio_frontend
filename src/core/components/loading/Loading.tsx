/** Overlay loading spinner component using a roller animation (lds-roller), positioned absolutely over content. */
import React from "react";
import { alpha, Box, useTheme } from "@mui/material";
import "./load.css";
import "./load2.css";

const Loading: React.FC = () => {
    const theme = useTheme();
    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            display="flex"
            justifyContent="center"
            width={"100%"}
            height={"100%"}
            alignItems="center"
            bgcolor={alpha(theme.palette.background.default, 0.2)}
            zIndex={200}
        >
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Box>
    );
};

export default Loading;
