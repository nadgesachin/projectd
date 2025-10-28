import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '../../services/postService';

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  hasMore: true,
  page: 1,
  limit: 10,
  lastUpdated: null,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10, refresh = false }, { rejectWithValue, getState }) => {
    try {
      const response = await postService.getPosts({ page, limit });
      return { posts: response.data, page, refresh };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.likePost(postId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.unlikePost(postId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, commentData }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(postId, commentData);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'posts/updateComment',
  async ({ postId, commentId, commentData }, { rejectWithValue }) => {
    try {
      const response = await postService.updateComment(postId, commentId, commentData);
      return { postId, commentId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await postService.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await postService.likeComment(postId, commentId);
      return { postId, commentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like comment');
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/sharePost',
  async ({ postId, shareData }, { rejectWithValue }) => {
    try {
      const response = await postService.sharePost(postId, shareData);
      return { postId, share: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share post');
    }
  }
);

export const reportPost = createAsyncThunk(
  'posts/reportPost',
  async ({ postId, reportData }, { rejectWithValue }) => {
    try {
      const response = await postService.reportPost(postId, reportData);
      return { postId, report: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report post');
    }
  }
);

// Post slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.currentPost = null;
      state.hasMore = true;
      state.page = 1;
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    addPostToFeed: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePostInFeed: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
      }
    },
    removePostFromFeed: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.page = page;
        state.hasMore = posts.length === state.limit;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.posts.unshift(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, isLiked, likesCount } = action.payload;
        const index = state.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          state.posts[index].isLiked = isLiked;
          state.posts[index].likesCount = likesCount;
        }
        state.lastUpdated = Date.now();
      })
      
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, isLiked, likesCount } = action.payload;
        const index = state.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          state.posts[index].isLiked = isLiked;
          state.posts[index].likesCount = likesCount;
        }
        state.lastUpdated = Date.now();
      })
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const index = state.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          state.posts[index].comments = state.posts[index].comments || [];
          state.posts[index].comments.push(comment);
          state.posts[index].commentsCount = (state.posts[index].commentsCount || 0) + 1;
        }
        state.lastUpdated = Date.now();
      })
      
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const { postId, commentId, comment } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex] = comment;
          }
        }
        state.lastUpdated = Date.now();
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(c => c.id !== commentId);
          state.posts[postIndex].commentsCount = Math.max(0, (state.posts[postIndex].commentsCount || 1) - 1);
        }
        state.lastUpdated = Date.now();
      })
      
      // Like comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const { postId, commentId, isLiked, likesCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex].isLiked = isLiked;
            state.posts[postIndex].comments[commentIndex].likesCount = likesCount;
          }
        }
        state.lastUpdated = Date.now();
      })
      
      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId, share } = action.payload;
        const index = state.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
          state.posts[index].shares = state.posts[index].shares || [];
          state.posts[index].shares.push(share);
          state.posts[index].sharesCount = (state.posts[index].sharesCount || 0) + 1;
        }
        state.lastUpdated = Date.now();
      });
  },
});

export const {
  clearPostError,
  clearPosts,
  setCurrentPost,
  addPostToFeed,
  updatePostInFeed,
  removePostFromFeed,
  setHasMore,
  incrementPage,
  resetPage,
} = postSlice.actions;

// Selectors
export const selectPosts = (state) => state.posts.posts;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectPostsLoading = (state) => state.posts.isLoading;
export const selectPostsCreating = (state) => state.posts.isCreating;
export const selectPostsUpdating = (state) => state.posts.isUpdating;
export const selectPostsDeleting = (state) => state.posts.isDeleting;
export const selectPostsError = (state) => state.posts.error;
export const selectHasMorePosts = (state) => state.posts.hasMore;
export const selectPostsPage = (state) => state.posts.page;
export const selectPostsLastUpdated = (state) => state.posts.lastUpdated;

export default postSlice.reducer;
