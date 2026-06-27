import PropTypes from "prop-types";
import { DialogContentText } from "@mui/material";
import StyledDialog from "../core/components/StyledDialog";

const DeleteDialog = ({ open, onClose, onConfirm, displayData, id }) => (
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

DeleteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    displayData: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DeleteDialog;
