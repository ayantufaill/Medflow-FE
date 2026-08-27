import apiClient from '../config/api';

export const referralService = {
  getAllReferrals: async (search = '') => {
    const response = await apiClient.get(`/referrals`, { params: { search } });
    return response.data.data.referrals;
  },
  getReferralById: async (referralId) => {
    const response = await apiClient.get(`/referrals/${referralId}`);
    return response.data.data.referral;
  },
  createReferral: async (referralData) => {
    const response = await apiClient.post('/referrals', referralData);
    return response.data.data.referral;
  }
};

export default referralService;
