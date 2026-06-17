import apiClient from '../config/api';

export const treatmentPlanService = {
  async getAll(params) {
    const response = await apiClient.get('/treatment-plans', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/treatment-plans/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/treatment-plans', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.patch(`/treatment-plans/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/treatment-plans/${id}`);
    return response.data;
  }
};
