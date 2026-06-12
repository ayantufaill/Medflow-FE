import apiClient from '../config/api';

/**
 * Clinical Management Service
 * Handles API integration for all clinical configurations.
 */
export const clinicalManagementService = {
  // --- PRODUCTS ---
  async getProducts() {
    const response = await apiClient.get('/clinical-management/products');
    return response.data.data;
  },

  async createProductCategory(name, section) {
    const response = await apiClient.post('/clinical-management/products', { name, section });
    return response.data.data;
  },

  async createProductChoice(categoryId, choiceData) {
    const response = await apiClient.post(`/clinical-management/products/${categoryId}/choices`, choiceData);
    return response.data.data;
  },

  async updateProductChoice(choiceId, updates) {
    const response = await apiClient.put(`/clinical-management/products/choices/${choiceId}`, updates);
    return response.data.data;
  },

  async deactivateProductCategory(categoryId) {
    const response = await apiClient.delete(`/clinical-management/products/${categoryId}`);
    return response.data.data;
  },

  async deactivateProductChoice(choiceId) {
    const response = await apiClient.delete(`/clinical-management/products/choices/${choiceId}`);
    return response.data.data;
  },

  // --- CHECKLISTS ---
  async getChecklists() {
    const response = await apiClient.get('/clinical-management/checklists');
    return response.data.data;
  },

  async createChecklistCategory(name) {
    const response = await apiClient.post('/clinical-management/checklists/categories', { name });
    return response.data.data;
  },

  async createChecklist(categoryName, checklistData) {
    const response = await apiClient.post('/clinical-management/checklists', { categoryName, ...checklistData });
    return response.data.data;
  },

  async createChecklistItem(checklistId, itemData) {
    const response = await apiClient.post(`/clinical-management/checklists/${checklistId}/items`, itemData);
    return response.data.data;
  },

  async addChoiceToChecklistItem(itemId, choice) {
    const response = await apiClient.post(`/clinical-management/checklists/items/${itemId}/choice`, { choice });
    return response.data.data;
  },

  async addProductToChecklistItem(itemId, product) {
    const response = await apiClient.post(`/clinical-management/checklists/items/${itemId}/product`, { product });
    return response.data.data;
  },

  async updateChecklist(checklistId, updates) {
    const response = await apiClient.put(`/clinical-management/checklists/${checklistId}`, updates);
    return response.data.data;
  },

  async deleteChecklist(checklistId) {
    const response = await apiClient.delete(`/clinical-management/checklists/${checklistId}`);
    return response.data.data;
  },

  async deleteChecklistItem(itemId) {
    const response = await apiClient.delete(`/clinical-management/checklists/items/${itemId}`);
    return response.data.data;
  },

  // --- PRESCRIPTION TEMPLATES ---
  async getPrescriptionTemplates() {
    const response = await apiClient.get('/clinical-management/prescription-templates');
    return response.data.data;
  },

  async createPrescriptionTemplate(data) {
    const response = await apiClient.post('/clinical-management/prescription-templates', data);
    return response.data.data;
  },

  async updatePrescriptionTemplate(templateId, updates) {
    const response = await apiClient.put(`/clinical-management/prescription-templates/${templateId}`, updates);
    return response.data.data;
  },

  async deletePrescriptionTemplate(templateId) {
    const response = await apiClient.delete(`/clinical-management/prescription-templates/${templateId}`);
    return response.data.data;
  },

  // --- SYSTEM SETTINGS ---
  async getSystemSettings() {
    const response = await apiClient.get('/clinical-management/settings');
    return response.data.data;
  },

  async updateSystemSetting(key, value) {
    const response = await apiClient.put('/clinical-management/settings', { key, value });
    return response.data.data;
  },

  // --- RECARE CONFIG ---
  async getRecareConfig() {
    const response = await apiClient.get('/clinical-management/recare-config');
    return response.data.data;
  },

  async updateRecareConfig(data) {
    const response = await apiClient.put('/clinical-management/recare-config', data);
    return response.data.data;
  },

  // --- TREATMENT PLAN PRESENTATION ---
  async getTreatmentPlanPresentationConfig() {
    const response = await apiClient.get('/clinical-management/treatment-plan-presentations');
    return response.data.data;
  },

  async updateTreatmentPlanPresentationConfig(data) {
    const response = await apiClient.put('/clinical-management/treatment-plan-presentations', data);
    return response.data.data;
  },

  // --- INFORMED CONSENT ---
  async getInformedConsents() {
    const response = await apiClient.get('/clinical-management/consent-templates');
    return response.data.data;
  },

  async createInformedConsent(name, content) {
    const response = await apiClient.post('/clinical-management/consent-templates', { name, content });
    return response.data.data;
  },

  async updateInformedConsent(templateId, updates) {
    const response = await apiClient.put(`/clinical-management/consent-templates/${templateId}`, updates);
    return response.data.data;
  },

  async deleteInformedConsent(templateId) {
    const response = await apiClient.delete(`/clinical-management/consent-templates/${templateId}`);
    return response.data.data;
  },

  // --- PRE/POST-OPS ---
  async getPrePostOps() {
    const response = await apiClient.get('/clinical-management/instruction-templates');
    return response.data.data;
  },

  async createPrePostOp(name, type, content) {
    const response = await apiClient.post('/clinical-management/instruction-templates', { name, type, content });
    return response.data.data;
  },

  async updatePrePostOp(templateId, updates) {
    const response = await apiClient.put(`/clinical-management/instruction-templates/${templateId}`, updates);
    return response.data.data;
  },

  async deletePrePostOp(templateId) {
    const response = await apiClient.delete(`/clinical-management/instruction-templates/${templateId}`);
    return response.data.data;
  }
};

export default clinicalManagementService;
