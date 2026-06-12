import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clinicalManagementService } from '../../services/clinical-management.service';

const initialState = {
  products: [],
  checklists: {},
  prescriptionTemplates: [],
  settingsMap: {},
  recareConfig: null,
  treatmentPlanPresentation: null,
  consentTemplates: [],
  instructionTemplates: [],
  
  loadingProducts: false,
  loadingChecklists: false,
  loadingPrescriptions: false,
  loadingSettings: false,
  loadingRecare: false,
  loadingTP: false,
  loadingConsent: false,
  loadingInstructions: false,

  error: null,
};

// --- Products Async Thunks ---
export const fetchProducts = createAsyncThunk(
  'clinicalManagement/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getProducts();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingProducts) return false;
    }
  }
);

export const addProductCategory = createAsyncThunk(
  'clinicalManagement/addProductCategory',
  async ({ name, section }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createProductCategory(name, section);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add product category');
    }
  }
);

export const addProductChoice = createAsyncThunk(
  'clinicalManagement/addProductChoice',
  async ({ categoryId, choiceData }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createProductChoice(categoryId, choiceData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add choice');
    }
  }
);

export const updateProductChoice = createAsyncThunk(
  'clinicalManagement/updateProductChoice',
  async ({ choiceId, updates }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updateProductChoice(choiceId, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update choice');
    }
  }
);

export const deleteProductCategory = createAsyncThunk(
  'clinicalManagement/deleteProductCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deactivateProductCategory(categoryId);
      return categoryId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
    }
  }
);

export const deleteProductChoice = createAsyncThunk(
  'clinicalManagement/deleteProductChoice',
  async (choiceId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deactivateProductChoice(choiceId);
      return choiceId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete choice');
    }
  }
);

// --- Checklists Async Thunks ---
export const fetchChecklists = createAsyncThunk(
  'clinicalManagement/fetchChecklists',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getChecklists();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch checklists');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingChecklists) return false;
    }
  }
);

export const addChecklistCategory = createAsyncThunk(
  'clinicalManagement/addChecklistCategory',
  async (name, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createChecklistCategory(name);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add checklist category');
    }
  }
);

export const addChecklist = createAsyncThunk(
  'clinicalManagement/addChecklist',
  async ({ categoryName, checklistData }, { rejectWithValue }) => {
    try {
      const data = await clinicalManagementService.createChecklist(categoryName, checklistData);
      return { categoryName, checklist: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create checklist');
    }
  }
);

export const addChecklistItem = createAsyncThunk(
  'clinicalManagement/addChecklistItem',
  async ({ checklistId, itemData }, { rejectWithValue }) => {
    try {
      const data = await clinicalManagementService.createChecklistItem(checklistId, itemData);
      return { checklistId, item: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add checklist item');
    }
  }
);

export const addChoiceToChecklistItem = createAsyncThunk(
  'clinicalManagement/addChoiceToChecklistItem',
  async ({ itemId, choice }, { rejectWithValue }) => {
    try {
      const data = await clinicalManagementService.addChoiceToChecklistItem(itemId, choice);
      return { itemId, choices: data.choices };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add choice to item');
    }
  }
);

export const addProductToChecklistItem = createAsyncThunk(
  'clinicalManagement/addProductToChecklistItem',
  async ({ itemId, product }, { rejectWithValue }) => {
    try {
      const data = await clinicalManagementService.addProductToChecklistItem(itemId, product);
      return { itemId, products: data.products };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add product to item');
    }
  }
);

export const updateChecklist = createAsyncThunk(
  'clinicalManagement/updateChecklist',
  async ({ checklistId, updates }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updateChecklist(checklistId, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update checklist');
    }
  }
);

export const deleteChecklist = createAsyncThunk(
  'clinicalManagement/deleteChecklist',
  async (checklistId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deleteChecklist(checklistId);
      return checklistId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete checklist');
    }
  }
);

export const deleteChecklistItem = createAsyncThunk(
  'clinicalManagement/deleteChecklistItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deleteChecklistItem(itemId);
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
    }
  }
);

// --- Prescriptions Async Thunks ---
export const fetchPrescriptionTemplates = createAsyncThunk(
  'clinicalManagement/fetchPrescriptionTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getPrescriptionTemplates();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch prescription templates');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingPrescriptions) return false;
    }
  }
);

export const addPrescriptionTemplate = createAsyncThunk(
  'clinicalManagement/addPrescriptionTemplate',
  async (data, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createPrescriptionTemplate(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create template');
    }
  }
);

export const updatePrescriptionTemplate = createAsyncThunk(
  'clinicalManagement/updatePrescriptionTemplate',
  async ({ templateId, updates }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updatePrescriptionTemplate(templateId, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deletePrescriptionTemplate = createAsyncThunk(
  'clinicalManagement/deletePrescriptionTemplate',
  async (templateId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deletePrescriptionTemplate(templateId);
      return templateId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete template');
    }
  }
);

// --- System Settings Async Thunks ---
export const fetchSystemSettings = createAsyncThunk(
  'clinicalManagement/fetchSystemSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getSystemSettings();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch system settings');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingSettings) return false;
    }
  }
);

export const updateSystemSetting = createAsyncThunk(
  'clinicalManagement/updateSystemSetting',
  async ({ key, value }, { rejectWithValue }) => {
    try {
      await clinicalManagementService.updateSystemSetting(key, value);
      return { key, value };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update system setting');
    }
  }
);

// --- Recare Config Async Thunks ---
export const fetchRecareConfig = createAsyncThunk(
  'clinicalManagement/fetchRecareConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getRecareConfig();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recare config');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingRecare) return false;
    }
  }
);

export const updateRecareConfig = createAsyncThunk(
  'clinicalManagement/updateRecareConfig',
  async (data, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updateRecareConfig(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update recare config');
    }
  }
);

// --- Treatment Plan Presentation Async Thunks ---
export const fetchTreatmentPlanPresentationConfig = createAsyncThunk(
  'clinicalManagement/fetchTreatmentPlanPresentationConfig',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getTreatmentPlanPresentationConfig();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch treatment plan presentations');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingTP) return false;
    }
  }
);

export const updateTreatmentPlanPresentationConfig = createAsyncThunk(
  'clinicalManagement/updateTreatmentPlanPresentationConfig',
  async (data, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updateTreatmentPlanPresentationConfig(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update treatment plan presentation');
    }
  }
);

// --- Informed Consent Async Thunks ---
export const fetchConsentTemplates = createAsyncThunk(
  'clinicalManagement/fetchConsentTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getInformedConsents();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch consent templates');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingConsent) return false;
    }
  }
);

export const addConsentTemplate = createAsyncThunk(
  'clinicalManagement/addConsentTemplate',
  async ({ name, content }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createInformedConsent(name, content);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create consent template');
    }
  }
);

export const updateConsentTemplate = createAsyncThunk(
  'clinicalManagement/updateConsentTemplate',
  async ({ templateId, updates }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updateInformedConsent(templateId, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update consent template');
    }
  }
);

export const deleteConsentTemplate = createAsyncThunk(
  'clinicalManagement/deleteConsentTemplate',
  async (templateId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deleteInformedConsent(templateId);
      return templateId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete consent template');
    }
  }
);

// --- Pre & Post-Ops Async Thunks ---
export const fetchInstructionTemplates = createAsyncThunk(
  'clinicalManagement/fetchInstructionTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.getPrePostOps();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch instruction templates');
    }
  },
  {
    condition: (_, { getState }) => {
      const { clinicalManagement } = getState();
      if (clinicalManagement.loadingInstructions) return false;
    }
  }
);

export const addInstructionTemplate = createAsyncThunk(
  'clinicalManagement/addInstructionTemplate',
  async ({ name, type, content }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.createPrePostOp(name, type, content);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create instruction template');
    }
  }
);

export const updateInstructionTemplate = createAsyncThunk(
  'clinicalManagement/updateInstructionTemplate',
  async ({ templateId, updates }, { rejectWithValue }) => {
    try {
      return await clinicalManagementService.updatePrePostOp(templateId, updates);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update instruction template');
    }
  }
);

export const deleteInstructionTemplate = createAsyncThunk(
  'clinicalManagement/deleteInstructionTemplate',
  async (templateId, { rejectWithValue }) => {
    try {
      await clinicalManagementService.deletePrePostOp(templateId);
      return templateId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete instruction template');
    }
  }
);

const clinicalManagementSlice = createSlice({
  name: 'clinicalManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchProducts.pending, (state) => { state.loadingProducts = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loadingProducts = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = action.payload;
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(addProductChoice.fulfilled, (state, action) => {
        const cat = state.products.find(c => c.id === action.payload.categoryId);
        if (cat) {
          if (!cat.choices) cat.choices = [];
          cat.choices.push(action.payload);
        }
      })
      .addCase(updateProductChoice.fulfilled, (state, action) => {
        state.products.forEach(cat => {
          if (cat.choices) {
            const idx = cat.choices.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) {
              cat.choices[idx] = action.payload;
            }
          }
        });
      })
      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.products = state.products.filter(c => c.id !== action.payload);
      })
      .addCase(deleteProductChoice.fulfilled, (state, action) => {
        state.products.forEach(cat => {
          if (cat.choices) {
            cat.choices = cat.choices.filter(c => c.id !== action.payload);
          }
        });
      })

      // Checklists
      .addCase(fetchChecklists.pending, (state) => { state.loadingChecklists = true; })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.loadingChecklists = false;
        state.checklists = action.payload || {};
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.loadingChecklists = false;
        state.error = action.payload;
      })
      .addCase(addChecklistCategory.fulfilled, (state, action) => {
        const { name } = action.payload;
        if (!state.checklists[name]) {
          state.checklists[name] = [];
        }
      })
      .addCase(addChecklist.fulfilled, (state, action) => {
        const { categoryName, checklist } = action.payload;
        if (!state.checklists[categoryName]) {
          state.checklists[categoryName] = [];
        }
        state.checklists[categoryName].push(checklist);
      })
      .addCase(addChecklistItem.fulfilled, (state, action) => {
        const { checklistId, item } = action.payload;
        for (const category in state.checklists) {
          const ch = state.checklists[category].find(c => c.id === checklistId);
          if (ch) {
            if (!ch.items) ch.items = [];
            ch.items.push(item);
            break;
          }
        }
      })
      .addCase(addChoiceToChecklistItem.fulfilled, (state, action) => {
        const { itemId, choices } = action.payload;
        for (const category in state.checklists) {
          for (const ch of state.checklists[category]) {
            if (ch.items) {
              const item = ch.items.find(i => i.id === itemId);
              if (item) {
                item.choices = choices;
                return;
              }
            }
          }
        }
      })
      .addCase(addProductToChecklistItem.fulfilled, (state, action) => {
        const { itemId, products } = action.payload;
        for (const category in state.checklists) {
          for (const ch of state.checklists[category]) {
            if (ch.items) {
              const item = ch.items.find(i => i.id === itemId);
              if (item) {
                item.products = products;
                return;
              }
            }
          }
        }
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        const updatedChecklist = action.payload;
        for (const category in state.checklists) {
          const idx = state.checklists[category].findIndex(c => c.id === updatedChecklist.id);
          if (idx !== -1) {
            const existingItems = state.checklists[category][idx].items || [];
            state.checklists[category][idx] = {
              ...updatedChecklist,
              items: updatedChecklist.items || existingItems
            };
            break;
          }
        }
      })
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        const checklistId = action.payload;
        for (const category in state.checklists) {
          state.checklists[category] = state.checklists[category].filter(c => c.id !== checklistId);
        }
      })
      .addCase(deleteChecklistItem.fulfilled, (state, action) => {
        const itemId = action.payload;
        for (const category in state.checklists) {
          state.checklists[category].forEach(ch => {
            if (ch.items) {
              ch.items = ch.items.filter(i => i.id !== itemId);
            }
          });
        }
      })

      // Prescriptions
      .addCase(fetchPrescriptionTemplates.pending, (state) => { state.loadingPrescriptions = true; })
      .addCase(fetchPrescriptionTemplates.fulfilled, (state, action) => {
        state.loadingPrescriptions = false;
        state.prescriptionTemplates = action.payload;
      })
      .addCase(fetchPrescriptionTemplates.rejected, (state, action) => {
        state.loadingPrescriptions = false;
        state.error = action.payload;
      })
      .addCase(addPrescriptionTemplate.fulfilled, (state, action) => {
        state.prescriptionTemplates.push(action.payload);
      })
      .addCase(updatePrescriptionTemplate.fulfilled, (state, action) => {
        const idx = state.prescriptionTemplates.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.prescriptionTemplates[idx] = action.payload;
      })
      .addCase(deletePrescriptionTemplate.fulfilled, (state, action) => {
        state.prescriptionTemplates = state.prescriptionTemplates.filter(p => p.id !== action.payload);
      })

      // System Settings
      .addCase(fetchSystemSettings.pending, (state) => { state.loadingSettings = true; })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.loadingSettings = false;
        state.settingsMap = action.payload;
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.loadingSettings = false;
        state.error = action.payload;
      })
      .addCase(updateSystemSetting.fulfilled, (state, action) => {
        state.settingsMap[action.payload.key] = action.payload.value;
      })

      // Recare Config
      .addCase(fetchRecareConfig.pending, (state) => { state.loadingRecare = true; })
      .addCase(fetchRecareConfig.fulfilled, (state, action) => {
        state.loadingRecare = false;
        state.recareConfig = action.payload;
      })
      .addCase(fetchRecareConfig.rejected, (state, action) => {
        state.loadingRecare = false;
        state.error = action.payload;
      })
      .addCase(updateRecareConfig.fulfilled, (state, action) => {
        state.recareConfig = action.payload;
      })

      // Treatment Plan Presentations
      .addCase(fetchTreatmentPlanPresentationConfig.pending, (state) => { state.loadingTP = true; })
      .addCase(fetchTreatmentPlanPresentationConfig.fulfilled, (state, action) => {
        state.loadingTP = false;
        state.treatmentPlanPresentation = action.payload;
      })
      .addCase(fetchTreatmentPlanPresentationConfig.rejected, (state, action) => {
        state.loadingTP = false;
        state.error = action.payload;
      })
      .addCase(updateTreatmentPlanPresentationConfig.fulfilled, (state, action) => {
        state.treatmentPlanPresentation = action.payload;
      })

      // Consents
      .addCase(fetchConsentTemplates.pending, (state) => { state.loadingConsent = true; })
      .addCase(fetchConsentTemplates.fulfilled, (state, action) => {
        state.loadingConsent = false;
        state.consentTemplates = action.payload;
      })
      .addCase(fetchConsentTemplates.rejected, (state, action) => {
        state.loadingConsent = false;
        state.error = action.payload;
      })
      .addCase(addConsentTemplate.fulfilled, (state, action) => {
        state.consentTemplates.push(action.payload);
      })
      .addCase(updateConsentTemplate.fulfilled, (state, action) => {
        const idx = state.consentTemplates.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.consentTemplates[idx] = action.payload;
      })
      .addCase(deleteConsentTemplate.fulfilled, (state, action) => {
        state.consentTemplates = state.consentTemplates.filter(c => c.id !== action.payload);
      })

      // Instruction Templates (Pre/Post-Ops)
      .addCase(fetchInstructionTemplates.pending, (state) => { state.loadingInstructions = true; })
      .addCase(fetchInstructionTemplates.fulfilled, (state, action) => {
        state.loadingInstructions = false;
        state.instructionTemplates = action.payload;
      })
      .addCase(fetchInstructionTemplates.rejected, (state, action) => {
        state.loadingInstructions = false;
        state.error = action.payload;
      })
      .addCase(addInstructionTemplate.fulfilled, (state, action) => {
        state.instructionTemplates.push(action.payload);
      })
      .addCase(updateInstructionTemplate.fulfilled, (state, action) => {
        const idx = state.instructionTemplates.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.instructionTemplates[idx] = action.payload;
      })
      .addCase(deleteInstructionTemplate.fulfilled, (state, action) => {
        state.instructionTemplates = state.instructionTemplates.filter(i => i.id !== action.payload);
      });
  }
});

// Selectors
export const selectProducts = (state) => state.clinicalManagement.products;
export const selectChecklists = (state) => state.clinicalManagement.checklists;
export const selectPrescriptionTemplates = (state) => state.clinicalManagement.prescriptionTemplates;
export const selectSettingsMap = (state) => state.clinicalManagement.settingsMap;
export const selectRecareConfig = (state) => state.clinicalManagement.recareConfig;
export const selectTreatmentPlanPresentationConfig = (state) => state.clinicalManagement.treatmentPlanPresentation;
export const selectConsentTemplates = (state) => state.clinicalManagement.consentTemplates;
export const selectInstructionTemplates = (state) => state.clinicalManagement.instructionTemplates;

export const selectLoadingProducts = (state) => state.clinicalManagement.loadingProducts;
export const selectLoadingChecklists = (state) => state.clinicalManagement.loadingChecklists;
export const selectLoadingPrescriptions = (state) => state.clinicalManagement.loadingPrescriptions;
export const selectLoadingSettings = (state) => state.clinicalManagement.loadingSettings;
export const selectLoadingRecare = (state) => state.clinicalManagement.loadingRecare;
export const selectLoadingTP = (state) => state.clinicalManagement.loadingTP;
export const selectLoadingConsent = (state) => state.clinicalManagement.loadingConsent;
export const selectLoadingInstructions = (state) => state.clinicalManagement.loadingInstructions;

export default clinicalManagementSlice.reducer;
