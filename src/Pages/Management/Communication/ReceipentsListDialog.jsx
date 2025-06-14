import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAlert } from "../../../utils/Alert";
import { useSelector } from "react-redux";
import { getMessageRecipientsAPI } from "./communication.api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ReceipentsListDialog = ({ open, onClose, messageId }) => {
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // Makes dialog full screen on small devices

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="md"
    >
      <DialogTitle>Message Recipients</DialogTitle>
      <DialogContent
        dividers
        style={{
          maxHeight: fullScreen ? "100vh" : "60vh",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <CircularProgress />
          </div>
        ) : history.length === 0 ? (
          <Typography>No recipients found.</Typography>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((recipient, index) => (
                <TableRow key={recipient.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{recipient.name}</TableCell>
                  <TableCell>{recipient.phoneNumber}</TableCell>
                  <TableCell>{recipient?.email || "-"}</TableCell>
                  <TableCell>{recipient.status}</TableCell>
                  <TableCell>{recipient.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReceipentsListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messageId: PropTypes.number.isRequired,
};

export default ReceipentsListDialog;
