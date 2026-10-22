import apiClient from '../config/api';

export const icd10Service = {
  async search({ search = '', code, signal } = {}) {
    const response = await apiClient.get('/icd10-codes', { params: { search, code, limit: 50 }, signal });
    return response.data;
  },
};
