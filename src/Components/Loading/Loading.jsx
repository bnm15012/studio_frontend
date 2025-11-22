import { alpha, Box, useTheme } from "@mui/material";
import "./load.css";
import "./load2.css";

const Loading = () => {
    const theme = useTheme();
    return (
        <Box
            position="absolute" // Positioned relative to the parent container
            top="0"
            left="0"
            transform="translate(-50%, -50%)" // Centers the loader
            display="flex"
            justifyContent="center"
            width={"100%"}
            height={"100%"}
            alignItems="center"
            bgcolor={alpha(theme.palette.background.default, 0.2)} // Semi-transparent background
            zIndex={200} // Ensures it overlays other content
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
