import apiClient from '../config/api';

/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

export const appointmentService = {
  /**
   * Get all appointments with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} providerId - Filter by provider ID
   * @param {string} patientId - Filter by patient ID
   * @param {string} status - Filter by status
   * @param {string} startDate - Filter by start date (YYYY-MM-DD)
   * @param {string} endDate - Filter by end date (YYYY-MM-DD)
   * @param {string} appointmentTypeId - Filter by appointment type ID
   * @returns {Promise<Object>} Appointments data with pagination
   */
  async getAllAppointments(
    page = 1,
    limit = 10,
    providerId = '',
    patientId = '',
    status = '',
    startDate = '',
    endDate = '',
    appointmentTypeId = '',
    search = ''
  ) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (providerId) params.append('providerId', providerId);
    if (patientId) params.append('patientId', patientId);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (appointmentTypeId)
      params.append('appointmentTypeId', appointmentTypeId);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/appointments?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Appointment data
   */
  async getAppointmentById(appointmentId) {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data.data.appointment;
  },

  /**
   * Get provider schedule
   * @param {string} providerId - Provider ID
   * @param {string} view - View type ('day', 'week', 'month')
   * @param {string} date - Date for the view (YYYY-MM-DD)
   * @returns {Promise<Object>} Schedule data
   */
  async getProviderSchedule(providerId, view = 'day', date = '') {
    const params = new URLSearchParams();
    params.append('view', view);
    if (date) params.append('date', date);

    const response = await apiClient.get(
      `/appointments/providers/${providerId}/schedule?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get calendar schedule for multiple providers
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {string[]} providerIds - Optional array of provider IDs
   * @returns {Promise<Object>} Calendar events and providers data
   */
  async getCalendarSchedule(startDate, endDate, providerIds = []) {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (providerIds.length > 0) {
      params.append('providerIds', providerIds.join(','));
    }

    const response = await apiClient.get(
      `/appointments/calendar?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get available time slots for a provider
   * @param {string} providerId - Provider ID
   * @param {string} date - Date for available slots (YYYY-MM-DD)
   * @param {number} durationMinutes - Duration in minutes (optional, default 30)
   * @returns {Promise<Object>} Available slots data
   */
  async getAvailableSlots(providerId, date, durationMinutes = 30) {
    const params = new URLSearchParams();
    params.append('date', date);
    if (durationMinutes) {
      params.append('durationMinutes', durationMinutes.toString());
    }

    const response = await apiClient.get(
      `/appointments/providers/${providerId}/available-slots?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Create appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} Created appointment data
   */
  async createAppointment(appointmentData) {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data.data.appointment;
  },

  /**
   * Update appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} updates - Appointment update data
   * @returns {Promise<Object>} Updated appointment data
   */
  async updateAppointment(appointmentId, updates) {
    const response = await apiClient.put(
      `/appointments/${appointmentId}`,
      updates
    );
    return response.data.data.appointment;
  },

  /**
   * Cancel appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} cancellationReason - Reason for cancellation
   * @returns {Promise<Object>} Cancelled appointment data
   */
  async cancelAppointment(appointmentId, cancellationReason) {
    const response = await apiClient.post(
      `/appointments/${appointmentId}/cancel`,
      {
        cancellationReason,
      }
    );
    return response.data.data.appointment;
  },

  /**
   * Reschedule appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} rescheduleData - New appointment date/time
   * @returns {Promise<Object>} Rescheduled appointment data
   */
  async rescheduleAppointment(appointmentId, rescheduleData) {
    const response = await apiClient.post(
      `/appointments/${appointmentId}/reschedule`,
      rescheduleData
    );
    return response.data.data.appointment;
  },

  /**
   * Check-in appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Checked-in appointment data
   */
  async checkInAppointment(appointmentId) {
    const response = await apiClient.post(
      `/appointments/${appointmentId}/check-in`
    );
    return response.data.data.appointment;
  },

  /**
   * Delete appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Success message
   */
  async deleteAppointment(appointmentId) {
    const response = await apiClient.delete(`/appointments/${appointmentId}`);
    return response.data.data;
  },

  async getAppointmentsByPatient(patientId, page = 1, limit = 50) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('patientId', patientId);

    const response = await apiClient.get(`/appointments?${params.toString()}`);
    return response.data.data.appointments;
  },
};
