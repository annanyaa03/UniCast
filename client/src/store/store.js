import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    ui: uiReducer,
    notifications: notificationReducer,
  },
});
