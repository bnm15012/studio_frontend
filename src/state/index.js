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
import paymentSlice from './paymentSlice'
import analysisSlice from './analysisSlice'
import bookingSlice from './bookingSlice'
import membershipTypesSlice from './activityMembershipTypeSlice';
import enquirySlice from './enquirySlice';
import { clientCruds, expenseCruds } from '../api/all.api';

const rootReducer = combineReducers({
  auth: authSlice,
  activity: activitySlice,
  branch: branchSlice,
  clients: clientCruds.reducer,
  expense: expenseCruds.reducer,
  payment: paymentSlice,
  analysis: analysisSlice,
  dialog: dialogSlice,
  booking: bookingSlice,
  notifications: notificationSlice,
  membershipTypes: membershipTypesSlice,
  enquiry: enquirySlice,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ['auth', 'branch'],
  migrate: (state,) => {
    const currentVersion = state?._persist?.version;
    if (currentVersion !== 1) {
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
