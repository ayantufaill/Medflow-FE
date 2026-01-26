import apiClient from '../config/api';

export const vitalSignService = {
  async getAllVitalSigns(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.appointmentId) params.append('appointmentId', filters.appointmentId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/vital-signs?${params.toString()}`);
    return response.data.data;
  },

  async getVitalSignById(vitalSignId) {
    const response = await apiClient.get(`/vital-signs/${vitalSignId}`);
    return response.data.data.vitalSign;
  },

  async getVitalSignsByPatient(patientId, page = 1, limit = 10) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiClient.get(
      `/vital-signs/patient/${patientId}?${params.toString()}`
    );
    return response.data.data;
  },

  async getVitalSignByAppointment(appointmentId) {
    const response = await apiClient.get(
      `/vital-signs/appointment/${appointmentId}`
    );
    return response.data.data.vitalSign;
  },

  async getLatestVitalsByPatient(patientId) {
    const response = await apiClient.get(
      `/vital-signs/patient/${patientId}/latest`
    );
    return response.data.data.vitalSign;
  },

  async getVitalsTrend(patientId, days = 30) {
    const response = await apiClient.get(
      `/vital-signs/patient/${patientId}/trend?days=${days}`
    );
    return response.data.data.vitals;
  },

  async createVitalSign(vitalSignData) {
    const response = await apiClient.post('/vital-signs', vitalSignData);
    return response.data.data.vitalSign;
  },

  async updateVitalSign(vitalSignId, updates) {
    const response = await apiClient.put(`/vital-signs/${vitalSignId}`, updates);
    return response.data.data.vitalSign;
  },

  async deleteVitalSign(vitalSignId) {
    const response = await apiClient.delete(`/vital-signs/${vitalSignId}`);
    return response.data;
  },
};
