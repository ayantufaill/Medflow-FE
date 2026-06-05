import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../../services/document.service';

export const fetchPatientDocumentsThunk = createAsyncThunk(
  'document/fetchPatientDocuments',
  async ({ patientId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const data = await documentService.getDocumentsByPatient(patientId, page, limit);
      return { patientId, documents: data?.documents || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch patient documents');
    }
  },
  {
    condition: ({ patientId }, { getState }) => {
      const { document } = getState();
      if (document.patientDocumentsLoading) {
        console.log('🛑 [documentSlice] Blocked duplicate fetch: already loading');
        return false;
      }
      if (document.patientDocumentsCache && document.patientDocumentsCache[patientId]) {
        console.log('🛑 [documentSlice] Blocked duplicate fetch: cache exists');
        return false;
      }
      console.log('✅ [documentSlice] Proceeding with fetch');
      return true;
    }
  }
);

export const deleteDocumentThunk = createAsyncThunk(
  'document/deleteDocument',
  async ({ documentId, patientId }, { dispatch, rejectWithValue }) => {
    try {
      await documentService.deleteDocument(documentId);
      // Automatically refresh the patient's documents list
      if (patientId) {
        dispatch(fetchPatientDocumentsThunk({ patientId }));
      }
      return documentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete document');
    }
  }
);

const initialState = {
  patientDocumentsCache: {}, // { [patientId]: { data, timestamp } }
  patientDocumentsLoading: false,
  patientDocumentsError: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    invalidatePatientDocuments: (state, action) => {
      delete state.patientDocumentsCache[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPatientDocumentsThunk
      .addCase(fetchPatientDocumentsThunk.pending, (state) => {
        state.patientDocumentsLoading = true;
        state.patientDocumentsError = null;
      })
      .addCase(fetchPatientDocumentsThunk.fulfilled, (state, action) => {
        const { patientId, documents } = action.payload;
        state.patientDocumentsCache[patientId] = { data: documents, timestamp: Date.now() };
        state.patientDocumentsLoading = false;
      })
      .addCase(fetchPatientDocumentsThunk.rejected, (state, action) => {
        state.patientDocumentsLoading = false;
        state.patientDocumentsError = action.payload;
      });
  }
});

export const { invalidatePatientDocuments } = documentSlice.actions;

export const selectPatientDocumentsCache = (state) => state.document.patientDocumentsCache;
export const selectPatientDocumentsLoading = (state) => state.document.patientDocumentsLoading;
export const selectPatientDocumentsError = (state) => state.document.patientDocumentsError;

export default documentSlice.reducer;
