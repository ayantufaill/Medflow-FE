import apiClient from '../config/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Initiate registration - sends verification code to email
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} [userData.phone] - User phone number (optional)
   * @param {string} [userData.preferredLanguage] - Preferred language (optional)
   * @param {string} [userData.roleId] - Role ID (optional)
   * @returns {Promise<Object>} Success message and email
   */
  async initiateRegistration(userData) {
    const response = await apiClient.post('/auth/register/initiate', userData);
    return response.data.data;
  },

  /**
   * Verify email token and complete registration
   * @param {string} token - Verification token
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and tokens
   */
  async verifyEmailAndRegister(token, password) {
    const response = await apiClient.post('/auth/register/verify', { token, password });
    return response.data.data;
  },

  /**
   * Resend verification link
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message and email
   */
  async resendVerificationCode(email) {
    const response = await apiClient.post('/auth/register/resend-link', { email });
    return response.data.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and tokens
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token from localStorage
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data.data.user;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(passwordData) {
    const response = await apiClient.post('/users/profile/change-password', passwordData);
    return response.data.data;
  },

  /**
   * Request password reset - sends reset code to email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message and email
   */
  async requestPasswordReset(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data.data;
  },

  /**
   * Verify password reset code
   * @param {string} email - User email
   * @param {string} code - Reset code
   * @returns {Promise<Object>} Success message
   */
  async verifyPasswordResetCode(email, code) {
    const response = await apiClient.post('/auth/forgot-password/verify', { email, code });
    return response.data.data;
  },

  /**
   * Reset password with new password
   * @param {string} email - User email
   * @param {string} code - Reset code
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(email, code, newPassword) {
    const response = await apiClient.post('/auth/forgot-password/reset', {
      email,
      code,
      newPassword,
    });
    return response.data.data;
  },

  /**
   * Resend password reset code
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message and email
   */
  async resendPasswordResetCode(email) {
    const response = await apiClient.post('/auth/forgot-password/resend-code', { email });
    return response.data.data;
  },

  /**
   * Verify token and set password (for admin-created users)
   * @param {string} token - Verification token from email link
   * @param {string} password - New password
   * @returns {Promise<Object>} Success message and user data
   */
  async setupPassword(token, password) {
    const response = await apiClient.post('/auth/setup-password', { token, password });
    return response.data.data;
  },

  /**
   * Logout user (clears local storage and calls logout endpoint)
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      // Call logout endpoint to blacklist tokens
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Even if logout endpoint fails, clear local storage
      console.error('Logout endpoint error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Remove the tokens from storage without calling logout endpoint
   */
  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

