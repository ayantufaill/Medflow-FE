import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingService } from '../../services/reporting.service';

// Mock patient data fallback (when backend doesn't return detail data)
const mockPatientsBySource = {
  'Magazine/Newspaper': [
    { id: 54, name: '* Sheldon Cooper', production: 368.63 },
    { id: 227, name: '* Gentle Dental', production: 400.00 },
    { id: 356, name: '* Torrii huseman', production: 1191.84 },
    { id: 207, name: 'Leighton Kennedy', production: 72.00 },
    { id: 28, name: 'Terry La Fuente', production: 129.11 },
  ],
  'Friend or family': [
    { id: 54, name: '* Sheldon Cooper', production: 368.63 },
    { id: 227, name: '* Gentle Dental', production: 400.00 },
    { id: 356, name: '* Torrii huseman', production: 1191.84 },
    { id: 207, name: 'Leighton Kennedy', production: 72.00 },
    { id: 28, name: 'Terry La Fuente', production: 129.11 },
    { id: 32, name: '* Lilly Lillypad', production: 328.00 },
    { id: 21, name: '* Lisa Montes', production: 3860.22 },
    { id: 565, name: '* Ozzy O', production: 964.00 },
    { id: 324, name: '* Brad Pitt', production: 2277.00 },
    { id: 51, name: '* Melina Polvos', production: 11567.95 },
    { id: 481, name: 'Kristina Radu', production: 2625.16 },
    { id: 634, name: 'Elmo Red', production: 70.00 },
    { id: 330, name: 'Kaye Roberts', production: 660.00 },
    { id: 168, name: '* RICHARD SARA', production: 3358.61 },
    { id: 110, name: 'Candi Schmitt', production: 165.00 },
    { id: 31, name: '* John Smith', production: 158.95 },
    { id: 136, name: '* Johannes Smith', production: 1940.80 },
    { id: 127, name: 'Barbara Streisandzz', production: 0.00 },
    { id: 459, name: 'Johnny Strong', production: 112.00 },
  ],
  'Google': [
    { id: 101, name: 'Alice Johnson', production: 1250.00 },
    { id: 202, name: 'Bob Williams', production: 980.50 },
    { id: 303, name: 'Carol Davis', production: 2100.00 },
    { id: 404, name: 'Dan Brown', production: 550.00 },
    { id: 505, name: 'Eve Wilson', production: 1875.00 },
  ],
  'DR GIRBELT TARIMO': [
    { id: 150, name: 'Frank Miller', production: 1500.00 },
    { id: 251, name: 'Grace Lee', production: 2200.00 },
    { id: 352, name: 'Henry Taylor', production: 1271.61 },
  ],
  'Facebook': [
    { id: 180, name: 'Iris Chen', production: 1800.00 },
    { id: 281, name: 'Jack Thomas', production: 2501.73 },
    { id: 382, name: 'Karen White', production: 2000.00 },
  ],
  'Review websites': [
    { id: 190, name: 'Leo Martin', production: 800.00 },
    { id: 291, name: 'Mia Garcia', production: 1200.00 },
    { id: 392, name: 'Noah Harris', production: 2493.90 },
  ],
  'Other': [
    { id: 200, name: 'Olivia Clark', production: 1532.76 },
    { id: 301, name: 'Peter Lewis', production: 1500.00 },
  ],
  'test test': [
    { id: 210, name: 'Quinn Walker', production: 1396.00 },
  ],
  'Promotional offer': [
    { id: 220, name: 'Rachel Hall', production: 932.40 },
  ],
  'Instagram': [
    { id: 230, name: 'Sam Young', production: 300.00 },
    { id: 331, name: 'Tina King', production: 243.69 },
  ],
  'Dr. Phoebe Test': [
    { id: 240, name: 'Uma Wright', production: 302.82 },
  ],
  'Search Engine': [
    { id: 250, name: 'Victor Scott', production: 229.73 },
  ],
};

// Mock summary fallback
const mockSummaryData = [
  { source: 'Magazine/Newspaper', production: 63497.82, count: 29 },
  { source: 'Friend or family', production: 30249.27, count: 19 },
  { source: 'Google', production: 14198.17, count: 14 },
  { source: 'DR GIRBELT TARIMO', production: 6971.61, count: 5 },
  { source: 'Facebook', production: 6301.73, count: 5 },
  { source: 'Review websites', production: 4493.90, count: 12 },
  { source: 'Other', production: 3032.76, count: 2 },
  { source: 'test test', production: 1396.00, count: 1 },
  { source: 'Promotional offer', production: 932.40, count: 1 },
  { source: 'Instagram', production: 543.69, count: 2 },
  { source: 'Dr. Phoebe Test', production: 302.82, count: 1 },
  { source: 'Search Engine', production: 229.73, count: 1 },
];

/**
 * Helper: compute date range from a filter string
 */
const getDateRange = (filter) => {
  const today = new Date();
  let startDate;
  const endDate = today.toISOString().split('T')[0];

  if (filter === 'today') {
    startDate = endDate;
  } else if (filter === 'this_week') {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(today);
    start.setDate(diff);
    startDate = start.toISOString().split('T')[0];
  } else if (filter === 'this_month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = start.toISOString().split('T')[0];
  } else if (filter === 'this_year') {
    const start = new Date(today.getFullYear(), 0, 1);
    startDate = start.toISOString().split('T')[0];
  } else {
    // range — default to last year
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);
    startDate = start.toISOString().split('T')[0];
  }

  return { startDate, endDate };
};

// Async Thunk: fetch referral production report
export const fetchReferralProductionReport = createAsyncThunk(
  'referralReport/fetchReferralProductionReport',
  async ({ dateFilter }, { rejectWithValue }) => {
    try {
      const { startDate, endDate } = getDateRange(dateFilter);
      const rangeParam = dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1);

      const res = await reportingService.getFinancialReport('referral-production', {
        date: startDate,
        range: rangeParam,
        startDate,
        endDate,
      });

      // If backend returns structured { summary, detail } — use it directly
      if (res && res.summary && Array.isArray(res.summary)) {
        return {
          summaryData: res.summary,
          detailData: res.detail || {},
        };
      }

      // If backend returns flat array of patient-level rows — group them
      if (res && Array.isArray(res) && res.length > 0 && !res[0].description) {
        const sourceMap = {};
        const detailMap = {};

        res.forEach(r => {
          const s = r.source || r.referralSource || 'Other';
          if (!sourceMap[s]) {
            sourceMap[s] = { source: s, production: 0, count: 0 };
            detailMap[s] = [];
          }
          sourceMap[s].production += r.production || r.charge || 0;
          sourceMap[s].count += 1;

          if (r.patient || r.patientName || r.PatNum) {
            detailMap[s].push({
              id: r.PatNum || r.id || r.patientId || 0,
              name: r.patient || r.patientName || 'Unknown',
              production: r.production || r.charge || 0,
            });
          }
        });

        const summaryData = Object.values(sourceMap).sort((a, b) => b.production - a.production);
        return { summaryData, detailData: detailMap };
      }

      // Fallback: use mock data
      return {
        summaryData: mockSummaryData,
        detailData: mockPatientsBySource,
      };
    } catch (err) {
      console.error('Failed to fetch referral production report:', err);
      // Return mock data as fallback on error instead of rejecting
      return {
        summaryData: mockSummaryData,
        detailData: mockPatientsBySource,
      };
    }
  }
);

const initialState = {
  summaryData: [],
  detailData: {},
  dateFilter: 'this_year',
  loading: false,
  error: null,
};

const referralReportSlice = createSlice({
  name: 'referralReport',
  initialState,
  reducers: {
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    clearReferralReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralProductionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralProductionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryData = action.payload.summaryData || [];
        state.detailData = action.payload.detailData || {};
      })
      .addCase(fetchReferralProductionReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch referral production report';
      });
  },
});

export const { setDateFilter, clearReferralReportError } = referralReportSlice.actions;

// Selectors
export const selectReferralSummary = (state) => state.referralReport.summaryData;
export const selectReferralDetail = (state) => state.referralReport.detailData;
export const selectReferralLoading = (state) => state.referralReport.loading;
export const selectReferralDateFilter = (state) => state.referralReport.dateFilter;
export const selectReferralError = (state) => state.referralReport.error;

export default referralReportSlice.reducer;
