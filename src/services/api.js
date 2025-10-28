import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference (will be set by setupInterceptors)
let storeRef = null;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage instead of store to avoid circular dependency
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    if (response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Request to ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle different error status codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', response.data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', response.data.message);
          break;
        case 422:
          // Validation error
          console.error('Validation error:', response.data.errors);
          break;
        case 429:
          // Rate limit exceeded
          console.error('Rate limit exceeded:', response.data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', response.data.message);
          break;
        default:
          console.error('API Error:', response.data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Generic CRUD operations
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // File upload
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Download file
  download: (url, config = {}) => {
    return api.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
  
  // Cancel request
  cancel: (source) => {
    if (source) {
      source.cancel('Request cancelled by user');
    }
  },
  
  // Create cancel token
  createCancelToken: () => {
    return axios.CancelToken.source();
  },
};

// Request timeout configuration
export const REQUEST_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    CONNECTIONS: '/user/connections',
    CONNECTION_REQUEST: '/user/connection-request',
    BLOCK_USER: '/user/block',
    UPLOAD_IMAGE: '/user/upload-image',
  },
  
  // Posts
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
    LIKE: '/posts/:id/like',
    COMMENT: '/posts/:id/comments',
  },
  
  // Events
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    UPDATE: '/events/:id',
    DELETE: '/events/:id',
    RSVP: '/events/:id/rsvp',
    SEARCH: '/events/search',
  },
  
  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/conversations/:id/messages',
    SEND_MESSAGE: '/chat/conversations/:id/messages',
    MARK_READ: '/chat/conversations/:id/read',
  },
  
  // Community
  COMMUNITY: {
    LIST: '/communities',
    CREATE: '/communities',
    JOIN: '/communities/:id/join',
    LEAVE: '/communities/:id/leave',
    MEMBERS: '/communities/:id/members',
  },
  
  // Discovery
  DISCOVERY: {
    NEARBY_USERS: '/discovery/nearby-users',
    SEARCH_USERS: '/discovery/search-users',
    SUGGESTIONS: '/discovery/suggestions',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
    MODERATION: '/admin/moderation',
  },
};

export default api;
