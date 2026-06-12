import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockGoals = {
  providerProduction: {
    dentist: [
      { id: '1', name: 'Christina Sabour', value: '200' },
      { id: '2', name: 'Sabour Ortho', value: '1' },
      { id: '3', name: 'TDS Doc', value: '0' }
    ],
    hygienist: [
      { id: '4', name: 'Temp Hygiene', value: '50' }
    ]
  },
  hygieneGroups: [
    { color: '#9067c6', name: 'Preventative', percentage: 8, codes: ['D1206', 'D1208', 'D1310', 'D1320', 'D1330', 'D1351', 'D1352', 'D1353', 'D1354'] },
    { color: '#d0679b', name: 'Prophy', percentage: 30, codes: ['D1110', 'D1120'] },
    { color: '#8d3d66', name: 'Maintenance', percentage: 15, codes: ['D4910'] },
    { color: '#b2b9e1', name: 'Perio Treatment', percentage: 32, codes: ['D4341', 'D4342', 'D4346', 'D4355', 'CD4999.1'] },
    { color: '#90d5e2', name: 'Diagnostic-HYG', percentage: 15, codes: ['D0210', 'D0220', 'D0230', 'D0240', 'D0250', 'D0251', 'D0270', 'D0272', 'D0273', 'D0274', 'D0277', 'D0290', 'D0310', 'D0320', 'D0321'], hasMore: true },
    { color: '#f0b0c0', name: 'Adjunctive', percentage: 0, codes: ['D4381', 'D4921'] },
  ],
  treatmentGroups: [
    { color: '#90d5e2', name: 'Diagnostic', percentage: 20, codes: ['D0120', 'D0140', 'D0145', 'D0150', 'D0160', 'D0170', 'D0171', 'D0180', 'D0190', 'D0191', 'D0414', 'D0415', 'D0416', 'D0417', 'D0418'], hasMore: true },
    { color: '#00acc1', name: 'Direct Restoration', percentage: 25, codes: ['D2140', 'D2150', 'D2160', 'D2161', 'D2330', 'D2331', 'D2332', 'D2335', 'D2390', 'D2391', 'D2392', 'D2393', 'D2394', 'D2410', 'D2420'], hasMore: true },
    { color: '#ffb74d', name: 'Orthodontics', percentage: 5, codes: ['D8010', 'D8020', 'D8030', 'D8040', 'D8050', 'D8060', 'D8070', 'D8080', 'D8090', 'D8210', 'D8220', 'D8660', 'D8670', 'D8680', 'D8681'], hasMore: true },
    { color: '#00bfa5', name: 'Indirect Restoration', percentage: 35, codes: ['D2961', 'D2962', 'D2510', 'D2520', 'D2530', 'D2542', 'D2543', 'D2544', 'D2610', 'D2620', 'D2630', 'D2642', 'D2643', 'D2644', 'D2650'], hasMore: true },
    { color: '#80cbc4', name: 'Implant', percentage: 10, codes: ['D6010', 'D6011', 'D6012', 'D6013', 'D6040', 'D6050', 'D6051', 'D6055', 'D6056', 'D6057', 'D6058', 'D6059', 'D6060', 'D6061', 'D6062'], hasMore: true },
    { color: '#ff8a65', name: 'Oral Surgery', percentage: 5, codes: ['D7111', 'D7140', 'D7210', 'D7220', 'D7230', 'D7240', 'D7241', 'D7250', 'D7251', 'D7260', 'D7261', 'D7270', 'D7272', 'D7280', 'D7282'], hasMore: true },
  ],
  collectionPercent: '98',
  newPatientsTotal: '25',
  newPatientsProvider: {
    dentist: [
      { id: '1', name: 'Christina Sabour', value: '' },
      { id: '2', name: 'Sabour Ortho', value: '' },
      { id: '3', name: 'TDS Doc', value: '' }
    ],
    hygienist: [
      { id: '4', name: 'Temp Hygiene', value: '' }
    ]
  },
  visitsTotal: '60',
  visitsHygienePercent: '40',
  visitsTreatmentPercent: '60',
  reappointmentPercent: '100',
  acceptanceNewPt: '65',
  acceptanceExistingPt: '65',
};

export const fetchDashboardGoals = createAsyncThunk(
  'dashboardGoals/fetch',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGoals;
  },
  {
    condition: (_, { getState }) => {
      const { dashboardGoals } = getState();
      if (dashboardGoals.loading || dashboardGoals.data !== mockGoals) return false;
      return true;
    }
  }
);

export const updateDashboardGoalField = createAsyncThunk(
  'dashboardGoals/updateField',
  async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return payload; // { fieldPath, value }
  }
);

const dashboardGoalsSlice = createSlice({
  name: 'dashboardGoals',
  initialState: {
    data: mockGoals,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardGoals.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateDashboardGoalField.fulfilled, (state, action) => {
        const { fieldPath, value } = action.payload;
        // Simple dot notation assignment for mock state
        const keys = fieldPath.split('.');
        let current = state.data;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      });
  }
});

export const selectDashboardGoals = (state) => state.dashboardGoals.data;
export const selectDashboardGoalsLoading = (state) => state.dashboardGoals.loading;

export default dashboardGoalsSlice.reducer;
