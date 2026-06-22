import apiClient from '../config/api';

export const clinicalExamService = {
  /**
   * Fetch an exam record by type and appointmentId
   */
  async getExam(examType, appointmentId) {
    const response = await apiClient.get(`/clinical-exams/${examType}/${appointmentId}`);
    return response.data.data?.exam;
  },

  /**
   * Create or update an exam record (upsert)
   * payload: { patientId, providerId, examData }
   */
  async upsertExam(examType, appointmentId, payload) {
    const response = await apiClient.put(`/clinical-exams/${examType}/${appointmentId}`, payload);
    return response.data.data?.exam;
  },

  /**
   * Sign and lock an exam record
   */
  async signExam(examType, appointmentId) {
    const response = await apiClient.post(`/clinical-exams/${examType}/${appointmentId}/sign`);
    return response.data.data?.exam;
  },

  /**
   * Fetch a chronological list of dates for previous exams
   */
  async getExamHistoryDates(examType, patientId) {
    const response = await apiClient.get(`/clinical-exams/history/${examType}/patient/${patientId}`);
    return response.data.data.dates;
  }
};
