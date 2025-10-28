import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import communityService from '../../services/communityService';

// Initial state
const initialState = {
  communities: [],
  myCommunities: [],
  currentCommunity: null,
  members: [],
  discussions: [],
  loading: false,
  error: null,
  searchResults: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

// Async Thunks
export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async ({ page = 1, limit = 12, search = '', category = '' }, { rejectWithValue }) => {
    try {
      const response = await communityService.getCommunities({ page, limit, search, category });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch communities');
    }
  }
);

export const fetchMyCommunities = createAsyncThunk(
  'community/fetchMyCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communityService.getMyCommunities();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your communities');
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  'community/fetchCommunityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await communityService.getCommunityById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch community details');
    }
  }
);

export const createCommunity = createAsyncThunk(
  'community/createCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await communityService.createCommunity(communityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create community');
    }
  }
);

export const updateCommunity = createAsyncThunk(
  'community/updateCommunity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await communityService.updateCommunity(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update community');
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'community/joinCommunity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await communityService.joinCommunity(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join community');
    }
  }
);

export const leaveCommunity = createAsyncThunk(
  'community/leaveCommunity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await communityService.leaveCommunity(id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave community');
    }
  }
);

export const fetchCommunityMembers = createAsyncThunk(
  'community/fetchCommunityMembers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await communityService.getCommunityMembers(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
    }
  }
);

export const fetchCommunityDiscussions = createAsyncThunk(
  'community/fetchCommunityDiscussions',
  async (id, { rejectWithValue }) => {
    try {
      const response = await communityService.getCommunityDiscussions(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch discussions');
    }
  }
);

export const createDiscussion = createAsyncThunk(
  'community/createDiscussion',
  async ({ communityId, data }, { rejectWithValue }) => {
    try {
      const response = await communityService.createDiscussion(communityId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create discussion');
    }
  }
);

export const searchCommunities = createAsyncThunk(
  'community/searchCommunities',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await communityService.searchCommunities(searchQuery);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search communities');
    }
  }
);

// Community Slice
const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCommunity: (state) => {
      state.currentCommunity = null;
      state.members = [];
      state.discussions = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Communities
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload.communities || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Communities
      .addCase(fetchMyCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.myCommunities = action.payload;
      })
      .addCase(fetchMyCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Community By ID
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Community
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities.unshift(action.payload);
        state.myCommunities.unshift(action.payload);
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Community
      .addCase(updateCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
        const index = state.communities.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.communities[index] = action.payload;
        }
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Join Community
      .addCase(joinCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity) {
          state.currentCommunity.members = action.payload.members;
          state.currentCommunity.isMember = true;
        }
        if (!state.myCommunities.find(c => c._id === action.payload._id)) {
          state.myCommunities.push(action.payload);
        }
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Leave Community
      .addCase(leaveCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCommunity && state.currentCommunity._id === action.payload.id) {
          state.currentCommunity.isMember = false;
        }
        state.myCommunities = state.myCommunities.filter(c => c._id !== action.payload.id);
      })
      .addCase(leaveCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Community Members
      .addCase(fetchCommunityMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchCommunityMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Community Discussions
      .addCase(fetchCommunityDiscussions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions = action.payload;
      })
      .addCase(fetchCommunityDiscussions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Discussion
      .addCase(createDiscussion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscussion.fulfilled, (state, action) => {
        state.loading = false;
        state.discussions.unshift(action.payload);
      })
      .addCase(createDiscussion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Communities
      .addCase(searchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearCurrentCommunity, clearSearchResults } = communitySlice.actions;

// Export selectors
export const selectCommunities = (state) => state.community.communities;
export const selectMyCommunities = (state) => state.community.myCommunities;
export const selectCurrentCommunity = (state) => state.community.currentCommunity;
export const selectCommunityMembers = (state) => state.community.members;
export const selectCommunityDiscussions = (state) => state.community.discussions;
export const selectCommunityLoading = (state) => state.community.loading;
export const selectCommunityError = (state) => state.community.error;
export const selectSearchResults = (state) => state.community.searchResults;
export const selectPagination = (state) => state.community.pagination;

// Export reducer
export default communitySlice.reducer;

