/** Confirmation dialog for delete operations with a red "Confirm Deletion" title. */
import React from "react";
import { DialogContentText } from "@mui/material";
import StyledDialog from "./StyledDialog";

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (id: string | number) => void;
    displayData: string;
    id: string | number;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    displayData,
    id,
}) => (
    <StyledDialog
        open={open}
        titleBgColor={"error"}
        onClose={onClose}
        title="Confirm Deletion"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
            onConfirm(id);
            onClose();
        }}
    >
        <DialogContentText sx={{ textAlign: "center" }}>
            Are you sure you want to delete <strong>{displayData}</strong>?
        </DialogContentText>
    </StyledDialog>
);

export default DeleteDialog;
