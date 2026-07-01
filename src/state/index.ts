import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authSlice from "./authSlice";
import dialogSlice from "./dialogSlice";
import notificationSlice from "./notificationSlice";
import analysisSlice from "./analysisSlice";

import {
    activityCruds,
    bookingCruds,
    branchCruds,
    clientCruds,
    enquiryCruds,
    expenseCruds,
    genericTemplateCruds,
    instructorsAssignmentsCruds,
    instructorsCruds,
    membershipPackageCruds,
    paymentCruds,
    studentsAssignmentsCruds,
    studentsCruds,
    usersCruds,
} from "../api/all.api";

const rootReducer = combineReducers({
    auth: authSlice,
    activities: activityCruds.reducer,
    users: usersCruds.reducer,
    instructors: instructorsCruds.reducer,
    instructorActivities: instructorsAssignmentsCruds.reducer,
    students: studentsCruds.reducer,
    studentActivities: studentsAssignmentsCruds.reducer,
    branch: branchCruds.reducer,
    clients: clientCruds.reducer,
    booking: bookingCruds.reducer,
    expenses: expenseCruds.reducer,
    payments: paymentCruds.reducer,
    analysis: analysisSlice,
    dialog: dialogSlice,
    notifications: notificationSlice,
    membershipPackages: membershipPackageCruds.reducer,
    enquiries: enquiryCruds.reducer,
    genericTemplate: genericTemplateCruds.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    version: 10,
    whitelist: ["auth", "branch"],
    migrate: (state) => {
        const currentVersion = state?._persist?.version;
        if (currentVersion !== 10) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(state);
    },
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
            },
        }),
});

// Custom hooks & Redux Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
