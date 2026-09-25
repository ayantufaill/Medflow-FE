import apiClient from '../config/api';

export const treatmentPlanService = {
  async getAll(params) {
    const response = await apiClient.get('/treatment-plans', { params });
    return response.data.data ? response.data.data : response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/treatment-plans/${id}`);
    return response.data.data ? response.data.data : response.data;
  },

  async create(data) {
    const response = await apiClient.post('/treatment-plans', data);
    return response.data.data ? response.data.data : response.data;
  },

  async update(id, data) {
    const response = await apiClient.patch(`/treatment-plans/${id}`, data);
    return response.data.data ? response.data.data : response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/treatment-plans/${id}`);
    return response.data.data ? response.data.data : response.data;
  },

  async generatePreAuth(id, payload) {
    const response = await apiClient.post(`/treatment-plans/${id}/generate-preauth`, payload);
    return response.data.data ? response.data.data : response.data;
  }
};
