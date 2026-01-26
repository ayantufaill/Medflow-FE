import apiClient from '../config/api';

export const clinicalNoteService = {
  async getAllClinicalNotes(
    page = 1,
    limit = 10,
    filters = {}
  ) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (filters.search) params.append('search', filters.search);
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.appointmentId) params.append('appointmentId', filters.appointmentId);
    if (filters.noteType) params.append('noteType', filters.noteType);
    if (filters.isSigned !== undefined && filters.isSigned !== null) {
      params.append('isSigned', filters.isSigned ? 'true' : 'false');
    }
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/clinical-notes?${params.toString()}`);
    return response.data.data;
  },

  async getClinicalNoteById(clinicalNoteId) {
    const response = await apiClient.get(`/clinical-notes/${clinicalNoteId}`);
    return response.data.data.clinicalNote;
  },

  async getClinicalNotesByPatient(patientId, page = 1, limit = 10) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await apiClient.get(
      `/clinical-notes/patient/${patientId}?${params.toString()}`
    );
    return response.data.data;
  },

  async getClinicalNoteByAppointment(appointmentId) {
    const response = await apiClient.get(
      `/clinical-notes/appointment/${appointmentId}`
    );
    return response.data.data.clinicalNote;
  },

  async getUnsignedNotes(providerId) {
    const response = await apiClient.get(
      `/clinical-notes/unsigned/${providerId}`
    );
    return response.data.data.unsignedNotes;
  },

  async createClinicalNote(noteData) {
    const response = await apiClient.post('/clinical-notes', noteData);
    return response.data.data.clinicalNote;
  },

  async createNoteFromTemplate(templateId, noteData) {
    const response = await apiClient.post(
      `/clinical-notes/from-template/${templateId}`,
      noteData
    );
    return response.data.data.clinicalNote;
  },

  async updateClinicalNote(clinicalNoteId, updates) {
    const response = await apiClient.put(
      `/clinical-notes/${clinicalNoteId}`,
      updates
    );
    return response.data.data.clinicalNote;
  },

  async saveDraft(clinicalNoteId, draftData) {
    const response = await apiClient.put(
      `/clinical-notes/${clinicalNoteId}/draft`,
      draftData
    );
    return response.data.data.clinicalNote;
  },

  async signClinicalNote(clinicalNoteId) {
    const response = await apiClient.post(
      `/clinical-notes/${clinicalNoteId}/sign`
    );
    return response.data.data.clinicalNote;
  },

  async addAttachment(clinicalNoteId, attachmentUrl) {
    const response = await apiClient.post(
      `/clinical-notes/${clinicalNoteId}/attachments`,
      { attachmentUrl }
    );
    return response.data.data.clinicalNote;
  },

  async removeAttachment(clinicalNoteId, attachmentUrl) {
    const response = await apiClient.delete(
      `/clinical-notes/${clinicalNoteId}/attachments`,
      { data: { attachmentUrl } }
    );
    return response.data.data.clinicalNote;
  },

  async deleteClinicalNote(clinicalNoteId) {
    const response = await apiClient.delete(
      `/clinical-notes/${clinicalNoteId}`
    );
    return response.data;
  },

  async getPatientMedicalHistory(patientId, options = {}) {
    const params = new URLSearchParams();
    
    if (options.includeAllergies === false) params.append('includeAllergies', 'false');
    if (options.includeVitals === false) params.append('includeVitals', 'false');
    if (options.includePrescriptions === false) params.append('includePrescriptions', 'false');
    if (options.includeLabOrders === false) params.append('includeLabOrders', 'false');
    if (options.includeLabResults === false) params.append('includeLabResults', 'false');
    if (options.includeDocuments === false) params.append('includeDocuments', 'false');
    if (options.includeNotes === false) params.append('includeNotes', 'false');
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const url = `/clinical-notes/patient/${patientId}/medical-history${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data.data;
  },
};
