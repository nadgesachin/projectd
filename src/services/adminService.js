import { apiService, API_ENDPOINTS } from './api';

const adminService = {
  // Analytics
  getAnalyticsOverview: async () => {
    return apiService.get(API_ENDPOINTS.ADMIN.ANALYTICS + '/overview');
  },

  getUserStats: async (timeRange = '30d') => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/users?timeRange=${timeRange}`);
  },

  getContentStats: async (timeRange = '30d') => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/content?timeRange=${timeRange}`);
  },

  getEngagementStats: async (timeRange = '30d') => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/engagement?timeRange=${timeRange}`);
  },

  getRevenueStats: async (timeRange = '30d') => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}/revenue?timeRange=${timeRange}`);
  },

  exportAnalytics: async (format = 'csv', timeRange = '30d') => {
    return apiService.download(
      `${API_ENDPOINTS.ADMIN.ANALYTICS}/export?format=${format}&timeRange=${timeRange}`
    );
  },

  // User Management
  getUsers: async ({ page = 1, limit = 20, role = '', status = '', search = '', sortBy = 'createdAt', order = 'desc' }) => {
    const params = new URLSearchParams({
      page,
      limit,
      sortBy,
      order,
      ...(role && { role }),
      ...(status && { status }),
      ...(search && { search }),
    });
    return apiService.get(`${API_ENDPOINTS.ADMIN.USERS}?${params}`);
  },

  getUserById: async (id) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  updateUserStatus: async (userId, status) => {
    return apiService.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/status`, { status });
  },

  updateUserRole: async (userId, role) => {
    return apiService.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/role`, { role });
  },

  deleteUser: async (userId) => {
    return apiService.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
  },

  verifyUser: async (userId) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/verify`);
  },

  suspendUser: async (userId, reason, duration) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/suspend`, { reason, duration });
  },

  unsuspendUser: async (userId) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/unsuspend`);
  },

  banUser: async (userId, reason) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/ban`, { reason });
  },

  unbanUser: async (userId) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/unban`);
  },

  getUserActivity: async (userId, timeRange = '30d') => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/activity?timeRange=${timeRange}`);
  },

  bulkUpdateUsers: async (userIds, updates) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.USERS}/bulk-update`, { userIds, updates });
  },

  exportUsers: async (format = 'csv') => {
    return apiService.download(`${API_ENDPOINTS.ADMIN.USERS}/export?format=${format}`);
  },

  // Content Moderation
  getReports: async ({ page = 1, limit = 20, type = '', status = '', priority = '' }) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(type && { type }),
      ...(status && { status }),
      ...(priority && { priority }),
    });
    return apiService.get(`${API_ENDPOINTS.ADMIN.REPORTS}?${params}`);
  },

  getReportById: async (id) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.REPORTS}/${id}`);
  },

  resolveReport: async (reportId, action, reason) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}/resolve`, { action, reason });
  },

  assignReport: async (reportId, moderatorId) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}/assign`, { moderatorId });
  },

  updateReportPriority: async (reportId, priority) => {
    return apiService.patch(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}/priority`, { priority });
  },

  getModerationQueue: async () => {
    return apiService.get(API_ENDPOINTS.ADMIN.MODERATION + '/queue');
  },

  moderateContent: async (contentId, contentType, action, reason) => {
    return apiService.post(API_ENDPOINTS.ADMIN.MODERATION, {
      contentId,
      contentType,
      action,
      reason,
    });
  },

  getContentById: async (contentId, contentType) => {
    return apiService.get(`${API_ENDPOINTS.ADMIN.MODERATION}/content/${contentType}/${contentId}`);
  },

  approveContent: async (contentId, contentType) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.MODERATION}/approve`, { contentId, contentType });
  },

  rejectContent: async (contentId, contentType, reason) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.MODERATION}/reject`, { contentId, contentType, reason });
  },

  flagContent: async (contentId, contentType, reason) => {
    return apiService.post(`${API_ENDPOINTS.ADMIN.MODERATION}/flag`, { contentId, contentType, reason });
  },

  deleteContent: async (contentId, contentType) => {
    return apiService.delete(`${API_ENDPOINTS.ADMIN.MODERATION}/content/${contentType}/${contentId}`);
  },

  // System Settings
  getSystemSettings: async () => {
    return apiService.get(API_ENDPOINTS.ADMIN.SETTINGS || '/admin/settings');
  },

  updateSystemSettings: async (settings) => {
    return apiService.put(API_ENDPOINTS.ADMIN.SETTINGS || '/admin/settings', settings);
  },

  getSystemHealth: async () => {
    return apiService.get('/admin/system/health');
  },

  getSystemLogs: async (level = 'all', limit = 100) => {
    return apiService.get(`/admin/system/logs?level=${level}&limit=${limit}`);
  },

  // Activity Logs
  getActivityLogs: async ({ page = 1, limit = 50, userId = '', action = '', startDate = '', endDate = '' }) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(userId && { userId }),
      ...(action && { action }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    return apiService.get(`/admin/activity-logs?${params}`);
  },

  // Email & Notifications
  sendBulkEmail: async (userIds, subject, message) => {
    return apiService.post('/admin/email/bulk', { userIds, subject, message });
  },

  sendSystemNotification: async (userIds, notification) => {
    return apiService.post('/admin/notifications/send', { userIds, notification });
  },

  // Roles & Permissions
  getRoles: async () => {
    return apiService.get('/admin/roles');
  },

  createRole: async (roleData) => {
    return apiService.post('/admin/roles', roleData);
  },

  updateRole: async (roleId, roleData) => {
    return apiService.put(`/admin/roles/${roleId}`, roleData);
  },

  deleteRole: async (roleId) => {
    return apiService.delete(`/admin/roles/${roleId}`);
  },

  getPermissions: async () => {
    return apiService.get('/admin/permissions');
  },

  // Backup & Restore
  createBackup: async () => {
    return apiService.post('/admin/backup/create');
  },

  getBackups: async () => {
    return apiService.get('/admin/backup/list');
  },

  restoreBackup: async (backupId) => {
    return apiService.post(`/admin/backup/restore/${backupId}`);
  },

  deleteBackup: async (backupId) => {
    return apiService.delete(`/admin/backup/${backupId}`);
  },
};

export default adminService;

