import apiClient from '../config/api';

/**
 * Carrier Matching Service
 * Handles converted carriers and Vyne carriers matching APIs
 */

export const carrierMatchingService = {
  // --- Converted Carriers ---

  async getConvertedOldPayers() {
    const response = await apiClient.get('/insurance-companies/converted/old-payers');
    return response.data.data;
  },

  async getConvertedOryxPayers() {
    const response = await apiClient.get('/insurance-companies/converted/oryx-payers');
    return response.data.data;
  },

  async getConvertedMatchedPayers() {
    const response = await apiClient.get('/insurance-companies/converted/matched');
    return response.data.data;
  },

  async matchConvertedCarrier(oldPayerId, oryxPayerId) {
    const response = await apiClient.post('/insurance-companies/converted/match', {
      oldPayerId,
      oryxPayerId,
    });
    return response.data.data;
  },

  async deleteConvertedMatch(oldPayerId) {
    const response = await apiClient.delete(`/insurance-companies/converted/match/${oldPayerId}`);
    return response.data.data;
  },

  async fetchMatches() {
    const response = await apiClient.post('/insurance-companies/converted/fetch-matches');
    return response.data.data;
  },

  // --- Vyne Carriers ---

  async getVyneOfficePayers() {
    const response = await apiClient.get('/insurance-companies/vyne/office-payers');
    return response.data.data;
  },

  async getVynePayers() {
    const response = await apiClient.get('/insurance-companies/vyne/payers');
    return response.data.data;
  },

  async getVyneMatchedPayers() {
    const response = await apiClient.get('/insurance-companies/vyne/matched');
    return response.data.data;
  },

  async matchVyneCarrier(officePayerId, vynePayerId, vyneMasterId) {
    const response = await apiClient.post('/insurance-companies/vyne/match', {
      officePayerId,
      vynePayerId,
      vyneMasterId,
    });
    return response.data.data;
  },

  async deleteVyneMatch(officePayerId) {
    const response = await apiClient.delete(`/insurance-companies/vyne/match/${officePayerId}`);
    return response.data.data;
  },
};
