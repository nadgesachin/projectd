import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from '../features/auth/authSlice';
import userSlice from '../features/user/userSlice';
import postSlice from '../features/posts/postSlice';
import chatSlice from '../features/chat/chatSlice';
import communitySlice from '../features/community/communitySlice';
import eventSlice from '../features/events/eventSlice';
import adminSlice from '../features/admin/adminSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // Only persist auth and user data
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  posts: postSlice,
  chat: chatSlice,
  community: communitySlice,
  events: eventSlice,
  admin: adminSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Export types for TypeScript (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
