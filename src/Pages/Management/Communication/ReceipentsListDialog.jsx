import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAlert } from "../../../utils/Alert";
import { useSelector } from "react-redux";
import { getMessageRecipientsAPI } from "./communication.api";
import {
  DialogContent,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
} from "@mui/material";
import { StyledTable } from "../../../Components/StyledTableComponents";
import StyledDialog from "../../../Components/New/StyledDialog";

const ReceipentsListDialog = ({ open, onClose, messageId }) => {
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMessageHistory = useCallback(async () => {
    try {
      setLoading(true);
      const { data, success, message } = await getMessageRecipientsAPI({
        token,
        messageId,
      });

      if (success) {
        setHistory(data);
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch message recipients!", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert, messageId, token]);

  useEffect(() => {
    if (open) {
      getMessageHistory();
    }
  }, [open, getMessageHistory]);

  return (
    <StyledDialog closeIcon={true} title={"Message Recipients"} open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <CircularProgress />
          </div>
        ) : history.length === 0 ? (
          <Typography>No recipients found.</Typography>
        ) : (
          <StyledTable stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((recipient, index) => (
                <TableRow key={recipient.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{recipient.name}</TableCell>
                  <TableCell>{recipient?.contact || "-"}</TableCell>
                  <TableCell>{recipient.status}</TableCell>
                  <TableCell>{recipient.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

ReceipentsListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messageId: PropTypes.number.isRequired,
};

export default ReceipentsListDialog;
