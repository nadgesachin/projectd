import { apiService, API_ENDPOINTS } from './api';

class UserService {
  // Get user profile
  async getProfile(userId = null) {
    const endpoint = userId 
      ? `${API_ENDPOINTS.USER.PROFILE}/${userId}`
      : API_ENDPOINTS.USER.PROFILE;
    const response = await apiService.get(endpoint);
    return response;
  }

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiService.put(API_ENDPOINTS.USER.PROFILE, profileData);
    return response;
  }

  // Upload profile image
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiService.upload(API_ENDPOINTS.USER.UPLOAD_IMAGE, formData);
    return response;
  }

  // Update user preferences
  async updatePreferences(preferences) {
    const response = await apiService.put(API_ENDPOINTS.USER.PREFERENCES, preferences);
    return response;
  }

  // Get user connections
  async getConnections() {
    const response = await apiService.get(API_ENDPOINTS.USER.CONNECTIONS);
    return response;
  }

  // Send connection request
  async sendConnectionRequest(userId) {
    const response = await apiService.post(API_ENDPOINTS.USER.CONNECTION_REQUEST, {
      userId,
    });
    return response;
  }

  // Accept connection request
  async acceptConnectionRequest(userId) {
    const response = await apiService.put(`${API_ENDPOINTS.USER.CONNECTION_REQUEST}/${userId}/accept`);
    return response;
  }

  // Reject connection request
  async rejectConnectionRequest(userId) {
    const response = await apiService.put(`${API_ENDPOINTS.USER.CONNECTION_REQUEST}/${userId}/reject`);
    return response;
  }

  // Block user
  async blockUser(userId) {
    const response = await apiService.post(API_ENDPOINTS.USER.BLOCK_USER, {
      userId,
    });
    return response;
  }

  // Unblock user
  async unblockUser(userId) {
    const response = await apiService.delete(`${API_ENDPOINTS.USER.BLOCK_USER}/${userId}`);
    return response;
  }

  // Search users
  async searchUsers(query, filters = {}) {
    const response = await apiService.get(API_ENDPOINTS.DISCOVERY.SEARCH_USERS, {
      params: { q: query, ...filters },
    });
    return response;
  }

  // Get nearby users
  async getNearbyUsers(latitude, longitude, radius = 10) {
    const response = await apiService.get(API_ENDPOINTS.DISCOVERY.NEARBY_USERS, {
      params: { latitude, longitude, radius },
    });
    return response;
  }

  // Get connection suggestions
  async getConnectionSuggestions() {
    const response = await apiService.get(API_ENDPOINTS.DISCOVERY.SUGGESTIONS);
    return response;
  }

  // Remove connection
  async removeConnection(userId) {
    const response = await apiService.delete(`${API_ENDPOINTS.USER.CONNECTIONS}/${userId}`);
    return response;
  }

  // Get user activity
  async getUserActivity(userId) {
    const response = await apiService.get(`/user/${userId}/activity`);
    return response;
  }

  // Update user status
  async updateStatus(status) {
    const response = await apiService.put('/user/status', { status });
    return response;
  }

  // Get user notifications
  async getNotifications() {
    const response = await apiService.get('/user/notifications');
    return response;
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    const response = await apiService.put(`/user/notifications/${notificationId}/read`);
    return response;
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    const response = await apiService.put('/user/notifications/read-all');
    return response;
  }
}

export const userService = new UserService();
