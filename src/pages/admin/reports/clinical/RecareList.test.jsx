import { fireEvent, render, screen } from '@testing-library/react';
import RecareList from './RecareList';
import { fetchRecareReport } from '../../../../store/slices/clinicalReportSlice';

const mockDispatch = jest.fn();
let mockState;
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));
jest.mock('../../../../store/slices/clinicalReportSlice', () => ({
  fetchRecareReport: jest.fn(params => ({ type: 'fetchRecare', payload: params })),
  selectRecareData: state => state.rows,
  selectClinicalReportLoading: state => state.loading,
  selectClinicalReportError: state => state.error,
}));
jest.mock('../../../../store/slices/providerSlice', () => ({
  fetchAllProvidersForDropdown: () => ({ type: 'fetchProviders' }),
  selectProviderDropdownList: state => state.providers,
}));
jest.mock('../../../../components/shared/PatientChat', () => () => null);
jest.mock('../../../../components/reports/financial/ProductionReportActions', () => () => null);
jest.mock('../../../../components/reports/clinical/RecareListFilters', () => ({ handleApplyFilters, handleClearFilters, setIncludeAppointed }) => (
  <div>
    <button onClick={handleApplyFilters}>Apply</button>
    <button onClick={handleClearFilters}>Clear</button>
    <button onClick={() => setIncludeAppointed(true)}>Include Appointed</button>
  </div>
));

beforeEach(() => {
  jest.clearAllMocks();
  mockState = { branch: { currentBranchId: '9' }, providers: [], loading: false, error: null, rows: [] };
});

it('renders saved clinical and follow-up fields, and preserves a zero contact count', () => {
  mockState.rows = [{ id: '1', patient: 'Test Patient', recallDate: '2027-01-01', lastExam: '2026-09-01', lastProphy: '2026-09-02', lastMaintenance: '2026-09-03', lastComm: '2026-10-01', note: 'Call after 5 pm', contactAgain: '2026-10-20', followUp: '2026-11-01', contactCount: 0 }];
  render(<RecareList />);
  for (const value of ['01/01/2027', '09/01/2026', '09/02/2026', '09/03/2026', '10/01/2026', '10/20/2026', '11/01/2026', 'Call after 5 pm', '0']) {
    expect(screen.getByText(value)).toBeInTheDocument();
  }
});

it('retains the selected branch when applying and clearing filters', () => {
  render(<RecareList />);
  fireEvent.click(screen.getByText('Apply'));
  expect(fetchRecareReport).toHaveBeenLastCalledWith(expect.objectContaining({ branchId: '9' }));
  fireEvent.click(screen.getByText('Clear'));
  expect(fetchRecareReport).toHaveBeenLastCalledWith({ branchId: '9' });
});

it('shows appointed patients when requested without substituting unrelated treatment or visit dates', () => {
  mockState.rows = [
    { id: '1', patient: 'Recare Patient', apptDate: '2026-11-02' },
    { id: '2', patient: 'Other Patient', lastAppt: '2026-08-09', nextTreatmentAppt: '2026-11-03' },
  ];
  render(<RecareList />);
  expect(screen.queryByText('Recare Patient')).not.toBeInTheDocument();
  expect(screen.getByText('Other Patient')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Include Appointed'));
  expect(screen.getByText('11/02/2026')).toBeInTheDocument();
  expect(screen.queryByText('08/09/2026')).not.toBeInTheDocument();
  expect(screen.queryByText('11/03/2026')).not.toBeInTheDocument();
});

it('shows a backend failure instead of silently presenting only an empty report', () => {
  mockState.error = 'Unable to load recare records';
  render(<RecareList />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load recare records');
});
