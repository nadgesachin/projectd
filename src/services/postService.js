import { apiService, API_ENDPOINTS } from './api';

class PostService {
  // Get posts with pagination
  async getPosts({ page = 1, limit = 10, type = 'all' } = {}) {
    const response = await apiService.get(API_ENDPOINTS.POSTS.LIST, {
      params: { page, limit, type },
    });
    return response;
  }

  // Get a single post by ID
  async getPost(postId) {
    const response = await apiService.get(`${API_ENDPOINTS.POSTS.LIST}/${postId}`);
    return response;
  }

  // Create a new post
  async createPost(postData) {
    const formData = new FormData();
    
    // Add text content
    formData.append('content', postData.content);
    
    // Add tags if provided
    if (postData.tags && postData.tags.length > 0) {
      formData.append('tags', JSON.stringify(postData.tags));
    }
    
    // Add media files if provided
    if (postData.media && postData.media.length > 0) {
      postData.media.forEach((file, index) => {
        formData.append(`media_${index}`, file);
      });
    }
    
    // Add location if provided
    if (postData.location) {
      formData.append('location', JSON.stringify(postData.location));
    }
    
    // Add visibility settings
    if (postData.visibility) {
      formData.append('visibility', postData.visibility);
    }

    const response = await apiService.upload(API_ENDPOINTS.POSTS.CREATE, formData);
    return response;
  }

  // Update an existing post
  async updatePost(postId, postData) {
    const response = await apiService.put(`${API_ENDPOINTS.POSTS.LIST}/${postId}`, postData);
    return response;
  }

  // Delete a post
  async deletePost(postId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}`);
    return response;
  }

  // Like a post
  async likePost(postId) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/like`);
    return response;
  }

  // Unlike a post
  async unlikePost(postId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}/like`);
    return response;
  }

  // Get post comments
  async getComments(postId, { page = 1, limit = 20 } = {}) {
    const response = await apiService.get(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments`, {
      params: { page, limit },
    });
    return response;
  }

  // Add a comment to a post
  async addComment(postId, commentData) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments`, commentData);
    return response;
  }

  // Update a comment
  async updateComment(postId, commentId, commentData) {
    const response = await apiService.put(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments/${commentId}`, commentData);
    return response;
  }

  // Delete a comment
  async deleteComment(postId, commentId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments/${commentId}`);
    return response;
  }

  // Like a comment
  async likeComment(postId, commentId) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments/${commentId}/like`);
    return response;
  }

  // Unlike a comment
  async unlikeComment(postId, commentId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}/comments/${commentId}/like`);
    return response;
  }

  // Share a post
  async sharePost(postId, shareData = {}) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/share`, shareData);
    return response;
  }

  // Report a post
  async reportPost(postId, reportData) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/report`, reportData);
    return response;
  }

  // Get trending posts
  async getTrendingPosts({ limit = 10 } = {}) {
    const response = await apiService.get(API_ENDPOINTS.POSTS.TRENDING, {
      params: { limit },
    });
    return response;
  }

  // Get posts by user
  async getUserPosts(userId, { page = 1, limit = 10 } = {}) {
    const response = await apiService.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}/posts`, {
      params: { page, limit },
    });
    return response;
  }

  // Get posts by hashtag
  async getPostsByHashtag(hashtag, { page = 1, limit = 10 } = {}) {
    const response = await apiService.get(`${API_ENDPOINTS.POSTS.HASHTAG}/${hashtag}`, {
      params: { page, limit },
    });
    return response;
  }

  // Search posts
  async searchPosts(query, { page = 1, limit = 10, filters = {} } = {}) {
    const response = await apiService.get(API_ENDPOINTS.POSTS.SEARCH, {
      params: { q: query, page, limit, ...filters },
    });
    return response;
  }

  // Get post analytics (for post owner)
  async getPostAnalytics(postId) {
    const response = await apiService.get(`${API_ENDPOINTS.POSTS.LIST}/${postId}/analytics`);
    return response;
  }

  // Pin a post (for user's profile)
  async pinPost(postId) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/pin`);
    return response;
  }

  // Unpin a post
  async unpinPost(postId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}/pin`);
    return response;
  }

  // Save a post
  async savePost(postId) {
    const response = await apiService.post(`${API_ENDPOINTS.POSTS.LIST}/${postId}/save`);
    return response;
  }

  // Unsave a post
  async unsavePost(postId) {
    const response = await apiService.delete(`${API_ENDPOINTS.POSTS.LIST}/${postId}/save`);
    return response;
  }

  // Get saved posts
  async getSavedPosts({ page = 1, limit = 10 } = {}) {
    const response = await apiService.get(API_ENDPOINTS.POSTS.SAVED, {
      params: { page, limit },
    });
    return response;
  }

  // Get post suggestions
  async getPostSuggestions({ limit = 5 } = {}) {
    const response = await apiService.get(API_ENDPOINTS.POSTS.SUGGESTIONS, {
      params: { limit },
    });
    return response;
  }
}

export const postService = new PostService();
