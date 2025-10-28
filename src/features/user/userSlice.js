import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

// Initial state
const initialState = {
  profile: null,
  preferences: {
    role: null, // mentor, investor, entrepreneur
    interests: [],
    location: null,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public', // public, connections, private
      showLocation: true,
      showEmail: false,
    },
  },
  connections: [],
  pendingConnections: [],
  blockedUsers: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await userService.uploadImage(imageFile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await userService.updatePreferences(preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

export const fetchConnections = createAsyncThunk(
  'user/fetchConnections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getConnections();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections');
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'user/sendConnectionRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.sendConnectionRequest(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send connection request');
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'user/acceptConnectionRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.acceptConnectionRequest(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept connection request');
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  'user/rejectConnectionRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.rejectConnectionRequest(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject connection request');
    }
  }
);

export const blockUser = createAsyncThunk(
  'user/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.blockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

export const unblockUser = createAsyncThunk(
  'user/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.unblockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock user');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.connections = [];
      state.pendingConnections = [];
      state.blockedUsers = [];
      state.error = null;
    },
    updateLocalProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = Date.now();
      }
    },
    addConnection: (state, action) => {
      state.connections.push(action.payload);
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
      );
    },
    addPendingConnection: (state, action) => {
      state.pendingConnections.push(action.payload);
    },
    removePendingConnection: (state, action) => {
      state.pendingConnections = state.pendingConnections.filter(
        (connection) => connection.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = Date.now();
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload image
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImage = action.payload.imageUrl;
          state.lastUpdated = Date.now();
        }
      })
      // Update preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
        state.lastUpdated = Date.now();
      })
      // Fetch connections
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload.connections;
        state.pendingConnections = action.payload.pendingConnections;
      })
      // Send connection request
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        // Connection request sent successfully
        state.lastUpdated = Date.now();
      })
      // Accept connection request
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const connection = action.payload;
        state.connections.push(connection);
        state.pendingConnections = state.pendingConnections.filter(
          (req) => req.id !== connection.id
        );
        state.lastUpdated = Date.now();
      })
      // Reject connection request
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.pendingConnections = state.pendingConnections.filter(
          (req) => req.id !== action.payload.userId
        );
        state.lastUpdated = Date.now();
      })
      // Block user
      .addCase(blockUser.fulfilled, (state, action) => {
        state.blockedUsers.push(action.payload);
        state.connections = state.connections.filter(
          (connection) => connection.id !== action.payload.id
        );
        state.lastUpdated = Date.now();
      })
      // Unblock user
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.blockedUsers = state.blockedUsers.filter(
          (user) => user.id !== action.payload.userId
        );
        state.lastUpdated = Date.now();
      });
  },
});

export const {
  clearUserError,
  clearUserData,
  updateLocalProfile,
  addConnection,
  removeConnection,
  addPendingConnection,
  removePendingConnection,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectUserConnections = (state) => state.user.connections;
export const selectPendingConnections = (state) => state.user.pendingConnections;
export const selectBlockedUsers = (state) => state.user.blockedUsers;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectUserLastUpdated = (state) => state.user.lastUpdated;

export default userSlice.reducer;
