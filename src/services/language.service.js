import apiClient from '../config/api';

export const languageService = {
  async getAllLanguages(isActive = true) {
    const params = new URLSearchParams();
    if (isActive !== null && isActive !== undefined) {
      params.append('isActive', isActive ? 'true' : 'false');
    }

    const response = await apiClient.get(`/languages?${params.toString()}`);
    // Backend returns { success: true, data: languages, message: '...' }
    return response.data.data || [];
  },
};
