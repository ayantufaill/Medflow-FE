import apiClient from '../config/api';

export const communicationService = {
  getSettings: async () => {
    const response = await apiClient.get('/communication/settings');
    return response.data?.data || response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await apiClient.put('/communication/settings', settingsData);
    return response.data?.data || response.data;
  }
};
