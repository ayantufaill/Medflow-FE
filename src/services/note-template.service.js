import apiClient from '../config/api';

export const noteTemplateService = {
  async getAllNoteTemplates(
    page = 1,
    limit = 10,
    search = '',
    specialty = '',
    isActive = null
  ) {
    const params = [];
    if (page) params.push(`page=${page}`);
    if (limit) params.push(`limit=${limit}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (specialty) params.push(`specialty=${encodeURIComponent(specialty)}`);
    if (isActive !== null && isActive !== undefined) {
      params.push(`isActive=${isActive ? 'true' : 'false'}`);
    }

    const response = await apiClient.get(
      `/note-templates?${params.join('&')}`
    );
    return response.data.data;
  },

  async getNoteTemplateById(noteTemplateId) {
    const response = await apiClient.get(
      `/note-templates/${noteTemplateId}`
    );
    return response.data.data.noteTemplate;
  },

  async createNoteTemplate(noteTemplateData) {
    const response = await apiClient.post(
      '/note-templates',
      noteTemplateData
    );
    return response.data.data.noteTemplate;
  },

  async updateNoteTemplate(noteTemplateId, updates) {
    const response = await apiClient.put(
      `/note-templates/${noteTemplateId}`,
      updates
    );
    return response.data.data.noteTemplate;
  },

  async deleteNoteTemplate(noteTemplateId) {
    const response = await apiClient.delete(
      `/note-templates/${noteTemplateId}`
    );
    return response.data.data;
  },

  async duplicateNoteTemplate(noteTemplateId, newName) {
    const response = await apiClient.post(
      `/note-templates/${noteTemplateId}/duplicate`,
      { newName }
    );
    return response.data.data.noteTemplate;
  },

  async getTemplatesBySpecialty(specialty) {
    const response = await apiClient.get(
      `/note-templates/specialty/${specialty}`
    );
    return response.data.data.noteTemplates;
  },

  async getActiveTemplates() {
    const response = await apiClient.get('/note-templates/active');
    return response.data.data.noteTemplates;
  },

  async getSpecialties() {
    const response = await apiClient.get('/providers/specialties');
    return response.data.data.specialties;
  },

  async toggleNoteTemplateStatus(noteTemplateId) {
    const response = await apiClient.patch(
      `/note-templates/${noteTemplateId}/status`
    );
    return response.data.data.noteTemplate;
  },
};
