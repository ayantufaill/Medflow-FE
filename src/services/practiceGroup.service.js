import apiClient from '../config/api';

/**
 * Practice Group Service
 * The Group → Branch tenant layer: a practice group is the top-level entity
 * (an independent practice/organization), each with one or more branches
 * (clinics) underneath it.
 */
export const practiceGroupService = {
  async getPracticeGroups() {
    const response = await apiClient.get('/practice-groups');
    return response.data.data;
  },

  async getPracticeGroupById(groupId) {
    const response = await apiClient.get(`/practice-groups/${groupId}`);
    return response.data.data;
  },

  async createPracticeGroup(payload) {
    const response = await apiClient.post('/practice-groups', payload);
    return response.data.data;
  },

  // payload: { name?, isActive? } — rename and/or deactivate a group.
  async updatePracticeGroup(groupId, payload) {
    const response = await apiClient.patch(`/practice-groups/${groupId}`, payload);
    return response.data.data;
  },

  async createBranch(groupId, payload) {
    const response = await apiClient.post(`/practice-groups/${groupId}/branches`, payload);
    return response.data.data;
  },

  async createGroupAdmin(groupId, payload) {
    const response = await apiClient.post(`/practice-groups/${groupId}/admin`, payload);
    return response.data.data;
  },

  // Every user in the group (any role), each with their current branchIds —
  // powers the Group Admin-facing "My Group" page.
  async getGroupUsers(groupId) {
    const response = await apiClient.get(`/practice-groups/${groupId}/users`);
    return response.data.data;
  },
};
