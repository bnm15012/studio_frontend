import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
    id: string | number;
    read: boolean;
    title?: string;
    message?: string;
    [key: string]: any;
}

export interface NotificationsState {
    items: NotificationItem[];
    unreadCount: number;
}

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.read).length;
        },
        markAsRead: (state, action: PayloadAction<string | number>) => {
            const id = action.payload;
            const notif = state.items.find((n) => n.id === id);
            if (notif && !notif.read) {
                notif.read = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead: (state) => {
            state.items.forEach((n: any) => (n.read = true));
            state.unreadCount = 0;
        },
    },
});

export const { setNotifications, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
