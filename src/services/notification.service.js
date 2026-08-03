import apiClient from '../config/api';

const buildParams = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await apiClient.get(`/notifications?${buildParams(params)}`);
    return response.data.data;
  },

  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data;
  },

  async markAsRead(notificationId) {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  async markAllAsRead() {
    const response = await apiClient.patch('/notifications/mark-all-read');
    return response.data.data;
  },
};
