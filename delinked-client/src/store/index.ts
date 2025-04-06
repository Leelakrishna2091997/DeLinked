import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import organizerReducer from './slices/organizerSlice';
import candidateReducer from './slices/candidateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizer: organizerReducer,
    candidate: candidateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;