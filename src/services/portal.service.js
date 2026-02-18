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

export const portalService = {
  async getMyProfile() {
    const response = await apiClient.get('/portal/me');
    return response.data.data;
  },

  async updateMyProfile(payload) {
    const response = await apiClient.put('/portal/me/profile', payload);
    return response.data.data;
  },

  async getMyAppointments(params = {}) {
    const response = await apiClient.get(`/portal/appointments?${buildParams(params)}`);
    return response.data.data;
  },

  async getMyAppointmentById(appointmentId) {
    const response = await apiClient.get(`/portal/appointments/${appointmentId}`);
    return response.data.data.appointment;
  },

  async getProviders() {
    const response = await apiClient.get('/portal/appointments/providers');
    return response.data.data.providers || [];
  },

  async getAvailableSlots(providerId, date, durationMinutes = 30) {
    const response = await apiClient.get(
      `/portal/appointments/available-slots?${buildParams({ providerId, date, durationMinutes })}`
    );
    return response.data.data;
  },

  async bookAppointment(payload) {
    const response = await apiClient.post('/portal/appointments', payload);
    return response.data.data.appointment;
  },

  async rescheduleAppointment(appointmentId, payload) {
    const response = await apiClient.post(
      `/portal/appointments/${appointmentId}/reschedule`,
      payload
    );
    return response.data.data.appointment;
  },

  async cancelAppointment(appointmentId, cancellationReason) {
    const response = await apiClient.post(`/portal/appointments/${appointmentId}/cancel`, {
      cancellationReason,
    });
    return response.data.data.appointment;
  },

  async getMessageThreads() {
    const response = await apiClient.get('/portal/messages/threads');
    return response.data.data.threads || [];
  },

  async getThreadMessages(threadId) {
    const response = await apiClient.get(`/portal/messages/threads/${threadId}`);
    return response.data.data.messages || [];
  },

  async sendMessage(payload) {
    const response = await apiClient.post('/portal/messages', payload);
    return response.data.data.messages || [];
  },

  async getForms(params = {}) {
    const response = await apiClient.get(`/portal/forms?${buildParams(params)}`);
    return response.data.data;
  },

  async getPendingForms() {
    const response = await apiClient.get('/portal/forms/pending');
    return response.data.data.pendingForms || [];
  },

  async submitForm(payload) {
    const response = await apiClient.post('/portal/forms', payload);
    return response.data.data.form;
  },

  async getFormById(formId) {
    const response = await apiClient.get(`/portal/forms/${formId}`);
    return response.data.data.form;
  },

  async updateForm(formId, payload) {
    const response = await apiClient.put(`/portal/forms/${formId}`, payload);
    return response.data.data.form;
  },

  async getNotifications(params = {}) {
    const response = await apiClient.get(`/portal/notifications?${buildParams(params)}`);
    return response.data.data;
  },

  async markNotificationRead(notificationId) {
    const response = await apiClient.post(`/portal/notifications/${notificationId}/read`);
    return response.data.data;
  },

  async getNotificationPreferences() {
    const response = await apiClient.get('/portal/notifications/preferences');
    return response.data.data.preferences;
  },

  async updateNotificationPreferences(payload) {
    const response = await apiClient.put('/portal/notifications/preferences', payload);
    return response.data.data.preferences;
  },

  async getProviderMessageThreads() {
    const response = await apiClient.get('/portal/provider/messages/threads');
    return response.data.data.threads || [];
  },

  async getProviderThreadMessages(threadId) {
    const response = await apiClient.get(`/portal/provider/messages/threads/${threadId}`);
    return response.data.data.messages || [];
  },

  async replyToProviderThread(payload) {
    const response = await apiClient.post('/portal/provider/messages/reply', payload);
    return response.data.data.message;
  },
};
