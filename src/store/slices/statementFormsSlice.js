import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';

export const fetchStatementForms = createAsyncThunk(
  'statementForms/fetch',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/statement-forms', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialized } = getState().statementForms;
      if (loading || initialized) {
        return false;
      }
    }
  }
);

export const createStatementForm = createAsyncThunk(
  'statementForms/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin-finance/statement-forms', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStatementForm = createAsyncThunk(
  'statementForms/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin-finance/statement-forms/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStatementForm = createAsyncThunk(
  'statementForms/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/statement-forms/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const statementFormsSlice = createSlice({
  name: 'statementForms',
  initialState: {
    forms: [],
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatementForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatementForms.fulfilled, (state, action) => {
        state.forms = action.payload || [];
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchStatementForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStatementForm.fulfilled, (state, action) => {
        if (action.payload.isDefault) {
          state.forms.forEach(f => f.isDefault = false);
        }
        state.forms.push(action.payload);
      })
      .addCase(updateStatementForm.fulfilled, (state, action) => {
        if (action.payload.isDefault) {
          state.forms.forEach(f => f.isDefault = false);
        }
        const index = state.forms.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.forms[index] = action.payload;
        }
      })
      .addCase(deleteStatementForm.fulfilled, (state, action) => {
        state.forms = state.forms.filter(f => f.id !== action.payload);
      });
  }
});

export const selectStatementForms = (state) => state.statementForms.forms;
export const selectStatementFormsLoading = (state) => state.statementForms.loading;

export default statementFormsSlice.reducer;
