import apiClient from '../config/api';

export const communicationService = {
  getSettings: async () => {
    const response = await apiClient.get('/communication/settings');
    return response.data?.data || response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await apiClient.put('/communication/settings', settingsData);
    return response.data?.data || response.data;
  },

  getTemplates: async (category) => {
    const url = category ? `/communication/templates?type=${category}` : '/communication/templates';
    const response = await apiClient.get(url);
    return response.data?.data || response.data;
  },

  updateTemplate: async (id, data) => {
    const response = await apiClient.put(`/communication/templates/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteTemplate: async (id) => {
    const response = await apiClient.delete(`/communication/templates/${id}`);
    return response.data?.data || response.data;
  },

  // Campaign endpoints
  getCampaigns: async (params) => {
    const response = await apiClient.get('/communication/campaigns', { params });
    return response.data?.data || response.data;
  },

  getCampaignMetrics: async () => {
    const response = await apiClient.get('/communication/campaigns/metrics');
    return response.data?.data || response.data;
  },

  getCampaignById: async (id) => {
    const response = await apiClient.get(`/communication/campaigns/${id}`);
    return response.data?.data || response.data;
  },

  createCampaign: async (data) => {
    const response = await apiClient.post('/communication/campaigns', data);
    return response.data?.data || response.data;
  },

  updateCampaign: async (id, data) => {
    const response = await apiClient.put(`/communication/campaigns/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteCampaign: async (id) => {
    const response = await apiClient.delete(`/communication/campaigns/${id}`);
    return response.data?.data || response.data;
  },

  // Questionnaire endpoints
  getQuestionnaires: async () => {
    const response = await apiClient.get('/communication/questionnaires');
    return response.data?.data || response.data;
  },

  getQuestionnaireById: async (id) => {
    const response = await apiClient.get(`/communication/questionnaires/${id}`);
    return response.data?.data || response.data;
  },

  createQuestionnaire: async (data) => {
    const response = await apiClient.post('/communication/questionnaires', data);
    return response.data?.data || response.data;
  },

  updateQuestionnaire: async (id, data) => {
    const response = await apiClient.put(`/communication/questionnaires/${id}`, data);
    return response.data?.data || response.data;
  },

  deleteQuestionnaire: async (id) => {
    const response = await apiClient.delete(`/communication/questionnaires/${id}`);
    return response.data?.data || response.data;
  }
};
