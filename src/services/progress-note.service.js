import apiClient from '../config/api';

export const progressNoteService = {
  async getAll(params) {
    const response = await apiClient.get('/progress-notes', { params });
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/progress-notes', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/progress-notes/${id}`, data);
    return response.data;
  },

  async addProcedure(noteId, procedureCode) {
    const response = await apiClient.post(`/progress-notes/${noteId}/procedures`, { procedureCode });
    return response.data;
  },

  async archive(id) {
    const response = await apiClient.patch(`/progress-notes/${id}/archive`);
    return response.data;
  },

  async unarchive(id) {
    const response = await apiClient.patch(`/progress-notes/${id}/unarchive`);
    return response.data;
  },

  async sign(id, data) {
    const response = await apiClient.patch(`/progress-notes/${id}/sign`, data);
    return response.data;
  }
};
