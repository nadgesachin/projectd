import { combineReducers } from '@reduxjs/toolkit';

// Import all feature slices
import authSlice from '../features/auth/authSlice';
import userSlice from '../features/user/userSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  // Add more slices here as they are created
  // posts: postSlice,
  // events: eventSlice,
  // chat: chatSlice,
  // community: communitySlice,
  // discovery: discoverySlice,
  // admin: adminSlice,
});

export default rootReducer;
