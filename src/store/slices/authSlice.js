import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

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

const initialState = {
  user: null,
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
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        error.message || 
        'Failed to fetch user profile'
      );
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

      // Fetch user profile after login
      const resultAction = await dispatch(fetchUserProfile());
      
      if (fetchUserProfile.rejected.match(resultAction)) {
        return rejectWithValue(resultAction.payload);
      }
      
      return resultAction.payload; // user profile
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        error.message || 
        'Login failed. Please try again.'
      );
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

      // Fetch user profile after registration
      const resultAction = await dispatch(fetchUserProfile());
      
      if (fetchUserProfile.rejected.match(resultAction)) {
        return rejectWithValue(resultAction.payload);
      }
      
      return resultAction.payload; // user profile
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        error.message || 
        'Verification failed. Please try again.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      // Even if API fails, we want to clear local state
      return rejectWithValue(error.message);
    } finally {
      authService.removeTokens(); // Assuming removeTokens clears localStorage
    }
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
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { clearError, setLoading, clearAuth } = authSlice.actions;

export default authSlice.reducer;
