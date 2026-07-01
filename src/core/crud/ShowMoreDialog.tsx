import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { FlexBetween } from "../components/layout/FlexBox";
import StyledDialog from "../components/dialogs/StyledDialog";
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
