import apiClient from '../config/api';

export const patientReportService = {
  async getReport(patientId, appointmentId) {
    const params = appointmentId ? { appointmentId } : {};
    const response = await apiClient.get(`/patients/${patientId}/report`, { params });
    return response.data.data;
  }
};
