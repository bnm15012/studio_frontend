import React, { useCallback, useEffect, useState } from "react";
import { Badge, CircularProgress, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { getStudentNamesOncePerDay } from "@/Pages/Management/Student/Student.api";
import { useAppDispatch, useAppSelector } from "@/state";
import {
    markAllAsRead,
    markAsRead,
    setNotifications,
    NotificationItem,
} from "@/state/notificationSlice";
import { Branch } from "@/api/types";

interface NotificationProps {
    branch: Branch;
    token: string;
}

const Notification: React.FC<NotificationProps> = ({ branch, token }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notifications.items);
    const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const getBirthDayStudent = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await getStudentNamesOncePerDay({
                branchId: branch.branchId,
                token,
                page: 1,
                size: -1,
                birthday: true,
            });

            const birthdayNotifications: NotificationItem[] = (
                data as Array<{ studentId: string | number; name: string }>
            ).map((d) => ({
                id: d.studentId,
                message: `Todays is ${d.name}'s Birthday!`,
                read: false,
            }));

            dispatch(setNotifications(birthdayNotifications));
        } catch (err) {
            console.error("Failed to fetch student names:", err);
        } finally {
            setLoading(false);
        }
    }, [branch.branchId, token, dispatch]);

    useEffect(() => {
        getBirthDayStudent();
    }, [getBirthDayStudent]);

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: theme.palette.mode === "dark" ? theme.palette.text.primary : "white",
                }}
            >
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
                                        key={note.id ?? index}
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
