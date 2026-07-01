import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAlert } from "../../../core/components/feedback/Alert";
import { useSelector } from "react-redux";
import { getMessageRecipientsAPI } from "./communication.api";
import { DialogContent, CircularProgress, Box, Typography, Avatar } from "@mui/material";
import StyledDialog from "../../../core/components/dialogs/StyledDialog";
import { User } from "lucide-react";
import { Close, Done } from "@mui/icons-material";

const ReceipentsListDialog = ({ onClose, messageId }) => {
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
        getMessageHistory();
    }, [getMessageHistory]);

    return (
        <StyledDialog
            closeIcon={true}
            title={"Message Recipients"}
            open={true}
            onClose={onClose}
            fullWidth
        >
            <DialogContent style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                        <CircularProgress />
                    </div>
                ) : history.length === 0 ? (
                    <Typography>No recipients found.</Typography>
                ) : (
                    <>
                        {history.map((recipient) => (
                            <Box
                                key={recipient.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    bgcolor: "action.hover",
                                    transition: "background-color 0.2s",
                                    "&:hover": { bgcolor: "action.selected" },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: "primary.light",
                                        color: "primary.main",
                                    }}
                                >
                                    <User size={20} />
                                </Avatar>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle2" noWrap>
                                        {recipient.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {recipient?.contact}
                                    </Typography>
                                </Box>
                                {recipient.status === "SENT" ? (
                                    <Done sx={{ color: "green", my: "auto", mr: 1 }} />
                                ) : recipient.status === "PENDING" ? (
                                    <CircularProgress />
                                ) : (
                                    <Close sx={{ color: "red", my: "auto", mr: 1 }} />
                                )}
                            </Box>
                        ))}
                    </>
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
