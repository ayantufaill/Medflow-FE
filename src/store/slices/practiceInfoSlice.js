import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { practiceInfoService } from '../../services/practice-info.service';

const initialState = {
  data: null,
  paymentTerminals: {
    openEdge: [],
    prosperiPay: [],
    payrix: [],
  },
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// --- Thunks ---

export const fetchCurrentPracticeInfo = createAsyncThunk(
  'practiceInfo/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.getCurrentPracticeInfo();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to fetch practice info'
      );
    }
  },
  {
    condition: (force, { getState }) => {
      const { practiceInfo } = getState();
      if (!force && (practiceInfo.loading || practiceInfo.data)) {
        return false;
      }
    }
  }
);

export const createPracticeInfo = createAsyncThunk(
  'practiceInfo/create',
  async (practiceInfoData, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.createPracticeInfo(practiceInfoData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create practice info'
      );
    }
  }
);

export const updatePracticeInfo = createAsyncThunk(
  'practiceInfo/update',
  async ({ practiceInfoId, updates }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updatePracticeInfo(practiceInfoId, updates);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update practice info'
      );
    }
  }
);

export const updateOfficeTimings = createAsyncThunk(
  'practiceInfo/updateOfficeTimings',
  async ({ practiceInfoId, officeTimingsData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateOfficeTimings(practiceInfoId, officeTimingsData);
      return response; // returns updated practiceInfo
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update office timings'
      );
    }
  }
);

export const updateScheduleConfig = createAsyncThunk(
  'practiceInfo/updateScheduleConfig',
  async ({ practiceInfoId, scheduleConfigData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateScheduleConfig(practiceInfoId, scheduleConfigData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update schedule config'
      );
    }
  }
);

export const updateKioskSettings = createAsyncThunk(
  'practiceInfo/updateKioskSettings',
  async ({ practiceInfoId, kioskSettingsData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateKioskSettings(practiceInfoId, kioskSettingsData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update kiosk settings'
      );
    }
  }
);

export const updateMyChartSettings = createAsyncThunk(
  'practiceInfo/updateMyChartSettings',
  async ({ practiceInfoId, mychartSettingsData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateMyChartSettings(practiceInfoId, mychartSettingsData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update MyChart settings'
      );
    }
  }
);

export const updateOnlineSchedule = createAsyncThunk(
  'practiceInfo/updateOnlineSchedule',
  async ({ practiceInfoId, onlineScheduleData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateOnlineSchedule(practiceInfoId, onlineScheduleData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update online schedule settings'
      );
    }
  }
);

export const updatePatientFlags = createAsyncThunk(
  'practiceInfo/updatePatientFlags',
  async ({ practiceInfoId, patientFlagsData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updatePatientFlags(practiceInfoId, patientFlagsData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update patient flags'
      );
    }
  }
);

export const updateDocumentCategories = createAsyncThunk(
  'practiceInfo/updateDocumentCategories',
  async ({ practiceInfoId, documentCategoriesData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updateDocumentCategories(practiceInfoId, documentCategoriesData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update document categories'
      );
    }
  }
);

export const updatePracticeSettings = createAsyncThunk(
  'practiceInfo/updatePracticeSettings',
  async ({ practiceInfoId, practiceSettingsData }, { rejectWithValue }) => {
    try {
      const response = await practiceInfoService.updatePracticeSettings(practiceInfoId, practiceSettingsData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update practice settings'
      );
    }
  }
);

// Mock thunk for Payment Terminals until backend is ready
export const savePaymentTerminalsLocal = createAsyncThunk(
  'practiceInfo/savePaymentTerminalsLocal',
  async (terminalsData) => {
    return terminalsData;
  }
);

// --- Slice ---

const practiceInfoSlice = createSlice({
  name: 'practiceInfo',
  initialState,
  reducers: {
    clearPracticeInfoError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    // Reducers to directly modify local payment terminals state
    addOpenEdgeTerminal: (state, action) => {
      state.paymentTerminals.openEdge.push(action.payload);
    },
    removeOpenEdgeTerminal: (state, action) => {
      state.paymentTerminals.openEdge = state.paymentTerminals.openEdge.filter(t => t.id !== action.payload);
    },
    addProsperiPayTerminal: (state, action) => {
      state.paymentTerminals.prosperiPay.push(action.payload);
    },
    removeProsperiPayTerminal: (state, action) => {
      state.paymentTerminals.prosperiPay = state.paymentTerminals.prosperiPay.filter(t => t.id !== action.payload);
    },
    addPayrixTerminal: (state, action) => {
      state.paymentTerminals.payrix.push(action.payload);
    },
    removePayrixTerminal: (state, action) => {
      state.paymentTerminals.payrix = state.paymentTerminals.payrix.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // fetchCurrentPracticeInfo
    builder
      .addCase(fetchCurrentPracticeInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentPracticeInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrentPracticeInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createPracticeInfo
    builder
      .addCase(createPracticeInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(createPracticeInfo.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(createPracticeInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });

    // updatePracticeInfo
    builder
      .addCase(updatePracticeInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updatePracticeInfo.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.data = action.payload;
      })
      .addCase(updatePracticeInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });

    // updateOfficeTimings
    builder
      .addCase(updateOfficeTimings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateOfficeTimings.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.data) {
          state.data.officeTimings = action.payload?.officeTimings;
        } else {
          state.data = action.payload;
        }
      })
      .addCase(updateOfficeTimings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });

    // updateScheduleConfig
    builder
      .addCase(updateScheduleConfig.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateScheduleConfig.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.data) {
          state.data.scheduleConfig = action.payload?.scheduleConfig;
        } else {
          state.data = action.payload;
        }
      })
      .addCase(updateScheduleConfig.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updateKioskSettings
    builder
      .addCase(updateKioskSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateKioskSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.kioskAccounts = practiceInfo.kioskAccounts;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updateKioskSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updateMyChartSettings
    builder
      .addCase(updateMyChartSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateMyChartSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.myChartSettings = practiceInfo.myChartSettings;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updateMyChartSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updateOnlineSchedule
    builder
      .addCase(updateOnlineSchedule.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateOnlineSchedule.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.onlineSchedule = practiceInfo.onlineSchedule;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updateOnlineSchedule.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updatePatientFlags
    builder
      .addCase(updatePatientFlags.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updatePatientFlags.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.patientFlags = practiceInfo.patientFlags;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updatePatientFlags.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updateDocumentCategories
    builder
      .addCase(updateDocumentCategories.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateDocumentCategories.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.documentCategories = practiceInfo.documentCategories;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updateDocumentCategories.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
    // updatePracticeSettings
    builder
      .addCase(updatePracticeSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updatePracticeSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        const practiceInfo = action.payload?.practiceInfo || action.payload;
        if (state.data && practiceInfo) {
          state.data.practiceSettings = practiceInfo.practiceSettings;
        } else if (practiceInfo) {
          state.data = practiceInfo;
        }
      })
      .addCase(updatePracticeSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const {
  clearPracticeInfoError,
  addOpenEdgeTerminal,
  removeOpenEdgeTerminal,
  addProsperiPayTerminal,
  removeProsperiPayTerminal,
  addPayrixTerminal,
  removePayrixTerminal,
} = practiceInfoSlice.actions;

// Selectors
export const selectPracticeInfo = (state) => state.practiceInfo.data;
export const selectPracticeInfoLoading = (state) => state.practiceInfo.loading;
export const selectPracticeInfoError = (state) => state.practiceInfo.error;
export const selectPracticeInfoUpdateLoading = (state) => state.practiceInfo.updateLoading;
export const selectPracticeInfoUpdateError = (state) => state.practiceInfo.updateError;

export const selectPaymentTerminals = (state) => state.practiceInfo.paymentTerminals;

export default practiceInfoSlice.reducer;
