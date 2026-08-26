import { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, logoutUser, clearAuth, loginUser, seedTenantClaims } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { decodeTenantClaims } from '../utils/tokenClaims';
import { getErrorMessage } from '../utils/errorUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  
  // Use a ref to track if we've already dispatched initial fetch
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      if (initialFetchDone.current) return;
      
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        initialFetchDone.current = true;
        await dispatch(fetchUserProfile());
      } else {
        dispatch(clearAuth());
      }
    };

    initAuth();
  }, [dispatch]);

  // Re-seed the optimistic tenant claims whenever api.js silently rotates
  // the access token (see the 'auth:token-refreshed' dispatch there) — kept
  // as a DOM event rather than a direct import since api.js is a plain axios
  // config module with no store access.
  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      dispatch(seedTenantClaims(decodeTenantClaims(event.detail?.accessToken)));
    };
    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);
    return () => window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
  }, [dispatch]);

  // Map remaining methods directly to authService since state is in Redux
  const initiateRegistration = async (userData) => {
    try {
      const data = await authService.initiateRegistration(userData);
      return { success: true, email: data.email };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Registration failed') };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const data = await authService.resendVerificationCode(email);
      return { success: true, email: data.email };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to resend code') };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const data = await authService.requestPasswordReset(email);
      return { success: true, email: data.email };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Password reset failed') };
    }
  };

  const verifyPasswordResetCode = async (email, code) => {
    try {
      await authService.verifyPasswordResetCode(email, code);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Invalid reset code') };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      const data = await authService.resetPassword(email, code, newPassword);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to reset password') };
    }
  };

  const resendPasswordResetCode = async (email) => {
    try {
      const data = await authService.resendPasswordResetCode(email);
      return { success: true, email: data.email };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Failed to resend code') };
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const updateUser = async () => {
    await dispatch(fetchUserProfile());
  };

  const clearSession = () => {
    authService.removeTokens();
    dispatch(clearAuth());
  };

  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(resultAction)) {
      return { success: true, user: resultAction.payload };
    }
    return { success: false, error: resultAction.payload || "Login failed." };
  };

  const verifyEmailAndRegisterWrapper = async (email, code) => {
    // We already have a Redux thunk for this!
    // But since `verifyEmailAndRegister` is exported, we map it.
    // However I forgot to import it. Let me just call authService directly for now.
    try {
      const data = await authService.verifyEmailAndRegister(email, code);
      const { tokens } = data;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      await dispatch(fetchUserProfile());
      return { success: true, user: user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error, 'Verification failed') };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    initiateRegistration,
    verifyEmailAndRegister: verifyEmailAndRegisterWrapper,
    resendVerificationCode,
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPassword,
    resendPasswordResetCode,
    logout,
    updateUser,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
