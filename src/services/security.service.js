import apiClient from '../config/api';

export const securityService = {
  async getAuditLogs(params) {
    const query = new URLSearchParams();
    if (params.from) query.append('from', params.from);
    if (params.to) query.append('to', params.to);
    if (params.user) query.append('user', params.user);
    if (params.patNum) query.append('patNum', params.patNum);
    if (params.permType) query.append('permType', params.permType);
    if (params.source) query.append('source', params.source);
    if (params.page) query.append('page', params.page);

    const response = await apiClient.get(`/security/audit?${query.toString()}`);
    return response.data;
  },

  async verifyAudit() {
    const response = await apiClient.get('/security/audit/verify');
    return response.data;
  }
};
