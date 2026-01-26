import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Verify base URL is loaded from env


/**
 * Decode JWT token to get expiration time
 * @param {string} token - JWT token
 * @returns {number|null} - Expiration timestamp in milliseconds, or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired or invalid
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return Date.now() >= expiration;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // List of public endpoints that should not trigger auth redirect on 401
    // These endpoints use 401 for validation errors, not auth errors
    const publicAuthEndpoints = [
      '/auth/forgot-password',
      '/auth/forgot-password/verify',
      '/auth/forgot-password/reset',
      '/auth/forgot-password/resend-code',
      '/auth/login',
      '/auth/register',
      '/auth/register/initiate',
      '/auth/register/verify',
      '/auth/register/resend-link',
      '/auth/setup-password',
    ];

    // Check if this is a public auth endpoint
    const isPublicAuthEndpoint = publicAuthEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // Handle 429 Too Many Requests - rate limit exceeded
    if (error.response?.status === 429) {
      // Don't retry 429 errors - just reject and let the component handle it
      // Clear any retry flags to prevent loops
      if (originalRequest._retry) {
        originalRequest._retry = false;
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { authService } = await import('../services/auth.service');
        const data = await authService.refreshToken(refreshToken);
        const { tokens } = data;

        if (tokens?.accessToken) {
          // Only rotate the access token. Refresh token remains the same.
          localStorage.setItem('accessToken', tokens.accessToken);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          
          // Process queued requests
          processQueue(null, tokens.accessToken);
          isRefreshing = false;

          // Retry the original request (no need to notify AuthContext, this handles it)
          return apiClient(originalRequest);
        }

        throw new Error('Invalid tokens received');
      } catch (refreshError) {
        // Refresh token failed, clear storage and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

