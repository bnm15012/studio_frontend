import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from 'redux';

import authSlice from './authSlice';
import dialogSlice from './dialogSlice'
import notificationSlice from './notificationSlice';
import branchSlice from './branchSlice'
import activitySlice from './activitySlice'
import expenseSlice from './expenseSlice'
import paymentSlice from './paymentSlice'
import analysisSlice from './analysisSlice'
import clientSlice from './clientSlice'
import bookingSlice from './bookingSlice'
import membershipTypesSlice from './activityMembershipTypeSlice';
import enquirySlice from './enquirySlice';

const rootReducer = combineReducers({
  auth: authSlice,
  activity: activitySlice,
  branch: branchSlice,
  expense: expenseSlice,
  payment: paymentSlice,
  analysis: analysisSlice,
  dialog: dialogSlice,
  client: clientSlice,
  booking: bookingSlice,
  notifications: notificationSlice,
  membershipTypes: membershipTypesSlice,
  enquiry: enquirySlice,
});

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ['auth', 'branch'],
  migrate: (state,) => {
    const currentVersion = state?._persist?.version;
    if (currentVersion !== 2) {
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

// Custom hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
