import { useState } from "react";
import PropTypes from "prop-types";
import StyledDialog from "../New/StyledDialog";
import { Button } from "@mui/material";
import FlexBetween from "../FlexBetween";
const ShowMoreDialog = ({ children, title, buttonText = "SHOW MORE" }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>{buttonText}</Button>
            <StyledDialog title={title} onClose={() => setOpen(false)} open={open} closeIcon={true}>
                <FlexBetween flexDirection={"column"} gap={2}>
                    {children}
                </FlexBetween>
            </StyledDialog>
        </>
    );
};

ShowMoreDialog.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    buttonText: PropTypes.string,
};

export default ShowMoreDialog;
