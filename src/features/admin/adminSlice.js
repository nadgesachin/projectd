import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

// Initial state
const initialState = {
  // Analytics
  analytics: {
    overview: null,
    userStats: null,
    contentStats: null,
    engagementStats: null,
    revenueStats: null,
  },
  
  // Users
  users: [],
  currentUser: null,
  userFilters: {
    role: '',
    status: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
  userPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  
  // Reports
  reports: [],
  currentReport: null,
  reportFilters: {
    type: '',
    status: '',
    priority: '',
  },
  reportPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  
  // Moderation Queue
  moderationQueue: [],
  
  // System Settings
  systemSettings: null,
  
  loading: false,
  error: null,
};

// Async Thunks

// Analytics
export const fetchAnalyticsOverview = createAsyncThunk(
  'admin/fetchAnalyticsOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAnalyticsOverview();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'admin/fetchUserStats',
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserStats(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
);

export const fetchContentStats = createAsyncThunk(
  'admin/fetchContentStats',
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await adminService.getContentStats(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content stats');
    }
  }
);

export const fetchEngagementStats = createAsyncThunk(
  'admin/fetchEngagementStats',
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await adminService.getEngagementStats(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch engagement stats');
    }
  }
);

// User Management
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers({ page, limit, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'admin/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserStatus(userId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateUserRole(userId, role);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'admin/verifyUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminService.verifyUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify user');
    }
  }
);

// Content Moderation
export const fetchReports = createAsyncThunk(
  'admin/fetchReports',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await adminService.getReports({ page, limit, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'admin/fetchReportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminService.getReportById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
    }
  }
);

export const resolveReport = createAsyncThunk(
  'admin/resolveReport',
  async ({ reportId, action, reason }, { rejectWithValue }) => {
    try {
      const response = await adminService.resolveReport(reportId, action, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve report');
    }
  }
);

export const fetchModerationQueue = createAsyncThunk(
  'admin/fetchModerationQueue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getModerationQueue();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch moderation queue');
    }
  }
);

export const moderateContent = createAsyncThunk(
  'admin/moderateContent',
  async ({ contentId, contentType, action, reason }, { rejectWithValue }) => {
    try {
      const response = await adminService.moderateContent(contentId, contentType, action, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to moderate content');
    }
  }
);

// System Settings
export const fetchSystemSettings = createAsyncThunk(
  'admin/fetchSystemSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getSystemSettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system settings');
    }
  }
);

export const updateSystemSettings = createAsyncThunk(
  'admin/updateSystemSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await adminService.updateSystemSettings(settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update system settings');
    }
  }
);

// Admin Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserFilters: (state, action) => {
      state.userFilters = { ...state.userFilters, ...action.payload };
    },
    clearUserFilters: (state) => {
      state.userFilters = {
        role: '',
        status: '',
        search: '',
        sortBy: 'createdAt',
        order: 'desc',
      };
    },
    setReportFilters: (state, action) => {
      state.reportFilters = { ...state.reportFilters, ...action.payload };
    },
    clearReportFilters: (state) => {
      state.reportFilters = {
        type: '',
        status: '',
        priority: '',
      };
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Analytics Overview
      .addCase(fetchAnalyticsOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics.overview = action.payload;
      })
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // User Stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.analytics.userStats = action.payload;
      })

      // Content Stats
      .addCase(fetchContentStats.fulfilled, (state, action) => {
        state.analytics.contentStats = action.payload;
      })

      // Engagement Stats
      .addCase(fetchEngagementStats.fulfilled, (state, action) => {
        state.analytics.engagementStats = action.payload;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || action.payload;
        state.userPagination = action.payload.pagination || state.userPagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })

      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload.userId);
        if (state.currentUser && state.currentUser._id === action.payload.userId) {
          state.currentUser = null;
        }
      })

      // Verify User
      .addCase(verifyUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports || action.payload;
        state.reportPagination = action.payload.pagination || state.reportPagination;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Report By ID
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.currentReport = action.payload;
      })

      // Resolve Report
      .addCase(resolveReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.currentReport && state.currentReport._id === action.payload._id) {
          state.currentReport = action.payload;
        }
      })

      // Fetch Moderation Queue
      .addCase(fetchModerationQueue.fulfilled, (state, action) => {
        state.moderationQueue = action.payload;
      })

      // Moderate Content
      .addCase(moderateContent.fulfilled, (state, action) => {
        state.moderationQueue = state.moderationQueue.filter(
          item => item._id !== action.payload._id
        );
      })

      // Fetch System Settings
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload;
      })

      // Update System Settings
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  setUserFilters,
  clearUserFilters,
  setReportFilters,
  clearReportFilters,
  clearCurrentUser,
  clearCurrentReport,
} = adminSlice.actions;

// Export selectors
export const selectAnalyticsOverview = (state) => state.admin.analytics.overview;
export const selectUserStats = (state) => state.admin.analytics.userStats;
export const selectContentStats = (state) => state.admin.analytics.contentStats;
export const selectEngagementStats = (state) => state.admin.analytics.engagementStats;
export const selectUsers = (state) => state.admin.users;
export const selectCurrentUser = (state) => state.admin.currentUser;
export const selectUserFilters = (state) => state.admin.userFilters;
export const selectUserPagination = (state) => state.admin.userPagination;
export const selectReports = (state) => state.admin.reports;
export const selectCurrentReport = (state) => state.admin.currentReport;
export const selectReportFilters = (state) => state.admin.reportFilters;
export const selectReportPagination = (state) => state.admin.reportPagination;
export const selectModerationQueue = (state) => state.admin.moderationQueue;
export const selectSystemSettings = (state) => state.admin.systemSettings;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

// Export reducer
export default adminSlice.reducer;

