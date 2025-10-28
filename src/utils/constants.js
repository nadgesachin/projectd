// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'ThriveUnity',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Professional networking platform for entrepreneurs, mentors, and investors',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'debug',
};

// Feature Flags
export const FEATURE_FLAGS = {
  CHAT: import.meta.env.VITE_ENABLE_CHAT !== 'false',
  EVENTS: import.meta.env.VITE_ENABLE_EVENTS !== 'false',
  COMMUNITIES: import.meta.env.VITE_ENABLE_COMMUNITIES !== 'false',
  DISCOVERY: import.meta.env.VITE_ENABLE_DISCOVERY !== 'false',
  ADMIN: import.meta.env.VITE_ENABLE_ADMIN !== 'false',
};

// User Roles
export const USER_ROLES = {
  ENTREPRENEUR: 'entrepreneur',
  MENTOR: 'mentor',
  INVESTOR: 'investor',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// User Status
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
};

// Connection Status
export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
};

// Post Types
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  POLL: 'poll',
  EVENT: 'event',
};

// Event Types
export const EVENT_TYPES = {
  NETWORKING: 'networking',
  WORKSHOP: 'workshop',
  CONFERENCE: 'conference',
  MEETUP: 'meetup',
  WEBINAR: 'webinar',
  PITCH: 'pitch',
  MENTORING: 'mentoring',
  INVESTMENT: 'investment',
};

// Event Status
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// RSVP Status
export const RSVP_STATUS = {
  GOING: 'going',
  INTERESTED: 'interested',
  NOT_GOING: 'not_going',
};

// Community Types
export const COMMUNITY_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite_only',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  EVENT_INVITE: 'event_invite',
  EVENT_REMINDER: 'event_reminder',
  MESSAGE: 'message',
  COMMUNITY_INVITE: 'community_invite',
  MENTORING_REQUEST: 'mentoring_request',
  INVESTMENT_INTEREST: 'investment_interest',
};

// Privacy Settings
export const PRIVACY_SETTINGS = {
  PUBLIC: 'public',
  CONNECTIONS: 'connections',
  PRIVATE: 'private',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

// API Timeouts
export const API_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 60000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  CONNECTIONS: '/connections',
  DISCOVERY: '/discovery',
  FEED: '/feed',
  EVENTS: '/events',
  CREATE_EVENT: '/events/create',
  EVENT_DETAIL: '/events/:id',
  CHAT: '/chat',
  COMMUNITIES: '/communities',
  CREATE_COMMUNITY: '/communities/create',
  COMMUNITY_DETAIL: '/communities/:id',
  ADMIN: '/admin',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ERROR_404: '/404',
  ERROR_500: '/500',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  USERNAME_INVALID: 'Username must be 3-30 characters and contain only letters, numbers, and underscores',
  PHONE_INVALID: 'Please enter a valid phone number',
  URL_INVALID: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  FILE_TYPE_INVALID: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Please check your input and try again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  CONNECTION_SENT: 'Connection request sent',
  CONNECTION_ACCEPTED: 'Connection request accepted',
  POST_CREATED: 'Post created successfully',
  EVENT_CREATED: 'Event created successfully',
  COMMUNITY_CREATED: 'Community created successfully',
  MESSAGE_SENT: 'Message sent successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  LIGHT: '#f8fafc',
  DARK: '#0f172a',
};

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  NOTIFICATION: 'notification',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  CONNECTION_REQUEST: 'connection_request',
  EVENT_UPDATE: 'event_update',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    CONNECTIONS: '/user/connections',
    CONNECTION_REQUEST: '/user/connection-request',
    BLOCK_USER: '/user/block',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    TRENDING: '/posts/trending',
    HASHTAG: '/posts/hashtag',
    SEARCH: '/posts/search',
    SAVED: '/posts/saved',
    SUGGESTIONS: '/posts/suggestions',
  },
  DISCOVERY: {
    SEARCH_USERS: '/discovery/users',
    NEARBY_USERS: '/discovery/nearby',
    SUGGESTIONS: '/discovery/suggestions',
  },
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    DETAIL: '/events',
  },
  COMMUNITIES: {
    LIST: '/communities',
    CREATE: '/communities',
    DETAIL: '/communities',
  },
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/messages',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
  },
};
