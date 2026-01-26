import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Decode JWT token to get expiration time
 */
const getTokenExpiration = (token) => {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.exp ? payload.exp * 1000 : null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User profile data
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isRefreshingRef = useRef(false);

  /**
   * Fetch user profile from API
   */
  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If profile fetch fails, user might not be authenticated
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Refresh access token using refresh token from localStorage
   * Note: This is mainly for manual refresh. The axios interceptor handles automatic refresh on 401.
   */
  const refreshToken = async () => {
    if (isRefreshingRef.current) {
      return false; // Prevent concurrent refresh attempts
    }

    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      await logout();
      return false;
    }

    // Check if refresh token is expired
    const refreshExpiration = getTokenExpiration(refreshTokenValue);
    if (!refreshExpiration || Date.now() >= refreshExpiration) {
      await logout();
      return false;
    }

    try {
      isRefreshingRef.current = true;
      const data = await authService.refreshToken(refreshTokenValue);
      const { tokens } = data;

      if (tokens?.accessToken) {
        localStorage.setItem('accessToken', tokens.accessToken);
        
        // Fetch user profile after token refresh
        await fetchUserProfile();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Check if refresh token is still valid
      const refreshExpiration = getTokenExpiration(refreshTokenValue);
      const isRefreshExpired = !refreshExpiration || Date.now() >= refreshExpiration;
      
      // Only logout if both tokens are expired
      const accessToken = localStorage.getItem('accessToken');
      const accessExpiration = getTokenExpiration(accessToken);
      const isAccessExpired = !accessExpiration || Date.now() >= accessExpiration;
      
      if (isRefreshExpired) {
        await logout();
        return false;
      }

      if (isAccessExpired) {
        await logout();
      }

      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // Initialize auth state - fetch user profile on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');

        if (accessToken) {
          // Fetch user profile to verify authentication
          // Handle 429 errors gracefully - don't logout on rate limit
          try {
            await fetchUserProfile();
          } catch (error) {
            // If it's a 429 error, don't clear auth state - just set loading to false
            if (error.response?.status === 429) {
              console.warn('Rate limit exceeded during profile fetch');
              // Keep user logged in, just don't update profile
              setLoading(false);
              return;
            }
            // For other errors, clear auth state
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // Only clear auth state if it's not a rate limit error
        if (error.response?.status !== 429) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Note: We removed the 'auth:token-refreshed' listener because it caused an infinite loop.
  // The axios interceptor already retries the original request after token refresh,
  // so we don't need to manually fetch profile again here.

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      const { tokens } = data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      // Fetch user profile after login
      const userProfile = await fetchUserProfile();
      return { success: true, user: userProfile };
    } catch (error) {
      // Return error object instead of throwing it
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Login failed. Please try again.';
      return { success: false, error: message, errorObj: error };
    }
  };

  const initiateRegistration = async (userData) => {
    try {
      const data = await authService.initiateRegistration(userData);
      return { success: true, email: data.email };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to send verification code. Please try again.';
      return { success: false, error: message };
    }
  };

  const verifyEmailAndRegister = async (email, code) => {
    try {
      const data = await authService.verifyEmailAndRegister(email, code);
      const { tokens } = data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      // Fetch user profile after registration
      const userProfile = await fetchUserProfile();
      return { success: true, user: userProfile };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Verification failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const data = await authService.resendVerificationCode(email);
      return { success: true, email: data.email };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to resend verification code. Please try again.';
      return { success: false, error: message };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const data = await authService.requestPasswordReset(email);
      return { success: true, email: data.email };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to send password reset code. Please try again.';
      return { success: false, error: message };
    }
  };

  const verifyPasswordResetCode = async (email, code) => {
    try {
      const data = await authService.verifyPasswordResetCode(email, code);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Invalid reset code. Please try again.';
      return { success: false, error: message, errorObj: error };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      const data = await authService.resetPassword(email, code, newPassword);
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to reset password. Please try again.';
      return { success: false, error: message };
    }
  };

  const resendPasswordResetCode = async (email) => {
    try {
      const data = await authService.resendPasswordResetCode(email);
      return { success: true, email: data.email };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to resend password reset code. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    // Clear localStorage and call logout endpoint
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Note: Navigation to /login should be handled by the component calling logout
  };

  const updateUser = async () => {
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  const clearSession = () => {
    authService.removeTokens();
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    initiateRegistration,
    verifyEmailAndRegister,
    resendVerificationCode,
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPassword,
    resendPasswordResetCode,
    logout,
    refreshToken,
    updateUser,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

