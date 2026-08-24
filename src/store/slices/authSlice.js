import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { API_BASE_URL } from '../../config/api';
import { decodeTenantClaims } from '../../utils/tokenClaims';
import { getErrorMessage } from '../../utils/errorUtils';

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

// Seeded synchronously from whatever access token is already in localStorage
// at store-creation time (page load/refresh) — an optimistic tenant-context
// snapshot so groupId/branchIds/isGroupAdmin are available immediately,
// without waiting on the fetchUserProfile round-trip. fetchUserProfile.fulfilled
// still overwrites this with the authoritative value once it resolves; nothing
// authorization-sensitive should read this seed instead of waiting for that.
const initialTenantClaims = decodeTenantClaims(
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
);

const initialState = {
  user: initialTenantClaims,
  isAuthenticated: false,
  loading: true, // Start as true so ProtectedRoute waits for initial token check
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await authService.getProfile();
      return profile;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch user profile'));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      const { tokens } = data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      dispatch(authSlice.actions.seedTenantClaims(decodeTenantClaims(tokens.accessToken)));

      // Fetch user profile after login
      const resultAction = await dispatch(fetchUserProfile());
      
      if (fetchUserProfile.rejected.match(resultAction)) {
        return rejectWithValue(resultAction.payload);
      }
      
      return resultAction.payload; // user profile
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Login failed. Please try again.'));
    }
  }
);

export const verifyEmailAndRegister = createAsyncThunk(
  'auth/verifyEmailAndRegister',
  async ({ email, code }, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.verifyEmailAndRegister(email, code);
      const { tokens } = data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      dispatch(authSlice.actions.seedTenantClaims(decodeTenantClaims(tokens.accessToken)));

      // Fetch user profile after registration
      const resultAction = await dispatch(fetchUserProfile());
      
      if (fetchUserProfile.rejected.match(resultAction)) {
        return rejectWithValue(resultAction.payload);
      }
      
      return resultAction.payload; // user profile
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Verification failed. Please try again.'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    // 1. Grab tokens before they are deleted
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // 2. Dispatch clearAuth instantly to purge Redux state and force immediate redirect
    dispatch(authSlice.actions.clearAuth());
    
    // 3. Send the logout request to backend in the background using raw fetch
    // This bypasses the apiClient interceptor which would fail since tokens are being deleted
    if (refreshToken && accessToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ refreshToken })
      }).catch(console.error);
    }
    
    // 4. Clean up any remaining tokens (though ProtectedRoute also does this)
    authService.removeTokens();
    
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Optimistic tenant-context values decoded straight from the access
    // token (see decodeTenantClaims) — merged into whatever's already in
    // state.user so a subsequent fetchUserProfile.fulfilled (the real
    // source of truth) isn't clobbered by a stale re-seed, and so this is a
    // no-op merge when the token carries no such claims (payload === null).
    seedTenantClaims: (state, action) => {
      if (!action.payload) return;
      state.user = { ...state.user, ...action.payload };
    },
    // Used when interceptor encounters 401
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });

    // fetchUserProfile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      // Only clear auth if not a rate limit error (assuming interceptor or specific check, here we just clear)
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });

    // verifyEmailAndRegister
    builder.addCase(verifyEmailAndRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyEmailAndRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(verifyEmailAndRegister.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    });

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    });
  },
});

export const { clearError, setLoading, clearAuth, seedTenantClaims } = authSlice.actions;

export default authSlice.reducer;
