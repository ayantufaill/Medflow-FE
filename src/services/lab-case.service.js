import apiClient from '../config/api';

class LabCaseService {
  async getAllLabCases({ page = 1, limit = 25, patientId, tab, status, sortBy, order, startDate, endDate } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (patientId) params.append('patientId', patientId);
    if (tab) params.append('tab', tab);
    if (status && status !== 'Select Status' && status !== 'All') {
      // Map FE 'Printed' to BE 'Sent' if necessary
      params.append('status', status === 'Printed' ? 'Sent' : status);
    }
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/lab-cases?${params.toString()}`);
    return response.data;
  }

  async getLabCaseById(id) {
    const response = await apiClient.get(`/lab-cases/${id}`);
    return response.data;
  }

  async createLabCase(data) {
    const response = await apiClient.post('/lab-cases', data);
    return response.data;
  }

  async updateLabCase(id, data) {
    const response = await apiClient.patch(`/lab-cases/${id}`, data);
    return response.data;
  }

  async updateLabCaseStatus(id, status) {
    const response = await apiClient.patch(`/lab-cases/${id}/status`, { status });
    return response.data;
  }

  async deleteLabCase(id) {
    const response = await apiClient.delete(`/lab-cases/${id}`);
    return response.data;
  }

  async getAllLaboratories(page = 1, limit = 50, includeHidden = false) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (includeHidden) params.append('includeHidden', includeHidden);

    const response = await apiClient.get(`/lab-cases/laboratories?${params.toString()}`);
    return response.data;
  }
}

export const labCaseService = new LabCaseService();
