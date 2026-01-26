import apiClient from '../config/api';

export const documentService = {
  async getAllDocuments(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.appointmentId) params.append('appointmentId', filters.appointmentId);
    if (filters.documentType) params.append('documentType', filters.documentType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/documents?${params.toString()}`);
    return response.data.data;
  },

  async getDocumentById(documentId) {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data.data.document;
  },

  async getDocumentsByPatient(patientId, page = 1, limit = 10, documentType = null) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (documentType) params.append('documentType', documentType);

    const response = await apiClient.get(
      `/documents/patient/${patientId}?${params.toString()}`
    );
    return response.data.data;
  },

  async getDocumentsByAppointment(appointmentId) {
    const response = await apiClient.get(`/documents/appointment/${appointmentId}`);
    return response.data.data.documents;
  },

  async createDocument(documentData) {
    const response = await apiClient.post('/documents', documentData);
    return response.data.data.document;
  },

  async uploadDocument(formData) {
    const response = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.document;
  },

  async updateDocument(documentId, updates) {
    const response = await apiClient.put(`/documents/${documentId}`, updates);
    return response.data.data.document;
  },

  async deleteDocument(documentId) {
    const response = await apiClient.delete(`/documents/${documentId}`);
    return response.data;
  },

  async attachToNote(documentId, clinicalNoteId) {
    const response = await apiClient.post(`/documents/${documentId}/attach-to-note`, {
      clinicalNoteId,
    });
    return response.data.data.clinicalNote;
  },

  async getDocumentTypes() {
    const response = await apiClient.get('/documents/types');
    return response.data.data.types;
  },
};
