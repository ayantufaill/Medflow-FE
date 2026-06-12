import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';

export const fetchCoverageShortcuts = createAsyncThunk(
  'coverageShortcuts/fetch',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/coverage-book-shortcuts', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialized } = getState().coverageShortcuts;
      if (loading || initialized) {
        return false;
      }
    }
  }
);

export const createCoverageShortcut = createAsyncThunk(
  'coverageShortcuts/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin-finance/coverage-book-shortcuts', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCoverageShortcut = createAsyncThunk(
  'coverageShortcuts/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin-finance/coverage-book-shortcuts/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCoverageShortcut = createAsyncThunk(
  'coverageShortcuts/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/coverage-book-shortcuts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const coverageShortcutsSlice = createSlice({
  name: 'coverageShortcuts',
  initialState: {
    shortcuts: [],
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoverageShortcuts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoverageShortcuts.fulfilled, (state, action) => {
        state.shortcuts = action.payload || [];
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchCoverageShortcuts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoverageShortcut.fulfilled, (state, action) => {
        state.shortcuts.push(action.payload);
      })
      .addCase(updateCoverageShortcut.fulfilled, (state, action) => {
        const index = state.shortcuts.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.shortcuts[index] = action.payload;
        }
      })
      .addCase(deleteCoverageShortcut.fulfilled, (state, action) => {
        state.shortcuts = state.shortcuts.filter((s) => s.id !== action.payload);
      });
  },
});

export const selectCoverageShortcuts = (state) => state.coverageShortcuts.shortcuts;

export default coverageShortcutsSlice.reducer;
