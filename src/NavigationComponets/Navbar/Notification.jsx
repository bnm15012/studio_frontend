import { Badge, CircularProgress, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useCallback, useEffect, useState } from "react";
import { getStudentNamesOncePerDay } from "../../Pages/Management/Student/Student.api";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../core/components/feedback/Alert";
import { markAllAsRead, markAsRead, setNotifications } from "../../state/notificationSlice";

const Notification = () => {
    const theme = useTheme();
    const showAlert = useAlert();
    const dispatch = useDispatch();

    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const token = useSelector((state) => state.auth.token);
    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = useSelector((state) => state.notifications.unreadCount);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState(false);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const getBirthDayStudent = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await getStudentNamesOncePerDay({
                branchId: currentBranch.branchId,
                token,
                page: 1,
                size: -1,
                birthday: true,
            });

            const birthdayNotifications = data.map((d) => ({
                id: d.studentId,
                message: `Todays is ${d.name}'s Birthday!`,
                read: false,
            }));

            dispatch(setNotifications(birthdayNotifications));
        } catch (error) {
            console.error("Failed to fetch student names:", error);
            showAlert("Failed to fetch student names", "error");
        } finally {
            setLoading(false);
        }
    }, [currentBranch.branchId, token, dispatch, showAlert]);

    useEffect(() => {
        getBirthDayStudent();
    }, [getBirthDayStudent]);

    return (
        <>
            <IconButton onClick={handleClick} sx={{ color: "white" }}>
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : unreadCount === 0 ? (
                        <NotificationsNoneIcon />
                    ) : (
                        <NotificationsActiveIcon />
                    )}
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        maxWidth: 700,
                        maxHeight: 500,
                        overflowY: "scroll",
                    },
                }}
            >
                {notifications.filter((m) => !m.read).length === 0 ? (
                    <MenuItem disabled>No new notifications</MenuItem>
                ) : (
                    <>
                        <MenuItem
                            onClick={() => {
                                dispatch(markAllAsRead());
                                handleClose();
                            }}
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                            Mark all as read
                        </MenuItem>
                        {notifications.map(
                            (note, index) =>
                                !note.read && (
                                    <MenuItem
                                        key={note.id || index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span>{note.message}</span>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => dispatch(markAsRead(note.id))}
                                        >
                                            ✅
                                        </IconButton>
                                    </MenuItem>
                                ),
                        )}
                    </>
                )}
            </Menu>
        </>
    );
};

export default Notification;
