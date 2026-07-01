import React, { useState } from "react";
import { Button } from "@mui/material";
import { FlexBetween } from "../components/layout/FlexBox";
import StyledDialog from "../components/dialogs/StyledDialog";

interface ShowMoreDialogProps {
    children?: React.ReactNode;
    title: string;
    buttonText?: string;
}

const ShowMoreDialog: React.FC<ShowMoreDialogProps> = ({ children, title, buttonText = "SHOW MORE" }) => {
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

export default ShowMoreDialog;
