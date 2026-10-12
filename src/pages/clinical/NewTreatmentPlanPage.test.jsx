import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Link } from 'react-router-dom';
import NewTreatmentPlanPage from './NewTreatmentPlanPage';
import appointmentReducer, { fetchAppointmentById, setCurrentAppointment } from '../../store/slices/appointmentSlice';
import { appointmentService } from '../../services/appointment.service';
import { fetchPatientById } from '../../store/slices/patientSlice';

const mockExamQuery = jest.fn();
const mockProviders = [];
jest.mock('../../hooks/queries/useClinicalExam', () => ({
  useClinicalExamQuery: (type, id) => {
    mockExamQuery(type, id);
    return { data: id === '10' ? { isSigned: true, examData: {} } : null, isLoading: false, isError: false };
  },
}));
jest.mock('./PeriodontalExamPage', () => ({ patientId, appointmentId, appointment }) =>
  <output data-testid="perio-context">{JSON.stringify({ patientId, appointmentId, date: appointment.appointmentDate })}</output>);
jest.mock('../../store/slices/patientSlice', () => ({
  selectCurrentPatient: state => state.patient.currentPatient,
  selectPatientInsurancesCache: state => state.patient.insurancesCache,
  fetchPatientById: jest.fn(id => ({ type: 'fixture/fetchPatient', payload: id })),
  fetchPatientInsurances: jest.fn(), invalidatePatientBalance: jest.fn(),
}));
jest.mock('../../store/slices/providerSlice', () => ({ selectProviderDropdownList: () => mockProviders }));
jest.mock('../../store/slices/billingSlice', () => ({ invalidateLedger: jest.fn(), invalidatePaymentInvoices: jest.fn(), fetchLedgerItems: jest.fn() }));
jest.mock('../../services/appointment.service', () => ({ appointmentService: {
  getAppointmentById: jest.fn(), getPatientHistory: jest.fn().mockResolvedValue([]),
} }));
jest.mock('../../services/treatment-plan.service', () => ({ treatmentPlanService: { getAll: jest.fn().mockResolvedValue({ treatmentPlans: [] }) } }));
jest.mock('../../services/invoice.service', () => ({ invoiceService: {} }));
jest.mock('../../services/authorization.service', () => ({ authorizationService: {} }));
jest.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ user: {} }) }));
jest.mock('../../hooks/redux/useBranch', () => ({ useBranch: () => ({ currentBranchId: '1' }) }));
jest.mock('../../hooks/redux/useDropdownData', () => ({ useDropdownData: () => ({ providers: [], rooms: [], appointmentTypes: [] }) }));
jest.mock('../../config/navMenuItems', () => ({ hasRequiredPermission: () => true }));
jest.mock('@mui/icons-material', () => ({
  ShieldOutlined: () => null, TabletMacOutlined: () => null, SmsOutlined: () => null,
  PrintOutlined: () => null, ArchiveOutlined: () => null, KeyboardArrowDown: () => null,
  AddCircleOutline: () => null, ContentCopy: () => null, Close: () => null, Receipt: () => null,
}));
jest.mock('../../components/patients/form-components/formInputs', () => ({ OutlinedSelect: () => null }));
jest.mock('../../components/clinical/new-treatment-plan/PreAuthModal', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/PreAuthCreationSummaryModal', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/NewTreatmentPlanHeader', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/NewTreatmentPlanOdontogram', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/NewTreatmentPlanProcedures', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/NewTreatmentPlanTable', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/EditProcedureDrawer', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/EditFeesDrawer', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/TreatmentPlanEstimatePrintDialog', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/TreatmentPlanRouteSlipDialog', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/AppointmentHistoryTimelineDialog', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/ChartTable', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/UnplannedProceduresSidebar', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/ArchiveDrawer', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/NotesDrawer', () => () => null);
jest.mock('../../components/clinical/new-treatment-plan/RxDrawer', () => () => null);
jest.mock('../../components/appointments/AddNewPatientAppointmentForm', () => () => null);

const visit = (id, date = '2026-10-12') => ({ _id: id, patientId: '1', appointmentDate: date });
const makeStore = () => configureStore({ reducer: {
  appointment: appointmentReducer,
  patient: (state = { currentPatient: { _id: '1' }, insurancesCache: {}, detailError: null }) => state,
} });
const openPage = async (store, route = '/clinical/treatment-plan?patientId=1&appointmentId=20') => {
  await act(async () => {
    render(<Provider store={store}><MemoryRouter initialEntries={[route]}>
      <Link to="/clinical/treatment-plan?patientId=1&appointmentId=30">Next appointment fixture</Link>
      <NewTreatmentPlanPage />
    </MemoryRouter></Provider>);
  });
  fireEvent.click(screen.getByRole('tab', { name: 'Perio Charts' }));
};

beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

test('waits for the clicked appointment instead of opening the previous signed chart', async () => {
  const store = makeStore();
  store.dispatch(setCurrentAppointment(visit('10', '2026-10-10')));
  let resolve;
  appointmentService.getAppointmentById.mockReturnValue(new Promise(done => { resolve = done; }));
  await openPage(store);
  expect(screen.getByRole('progressbar', { name: 'Loading appointment details' })).toBeInTheDocument();
  expect(screen.queryByTestId('perio-context')).not.toBeInTheDocument();
  expect(mockExamQuery).not.toHaveBeenCalledWith('periodontal', '10');
  await act(async () => { resolve(visit('20')); });
  fireEvent.click(screen.getByRole('button', { name: 'Create Perio chart' }));
  expect(JSON.parse(screen.getByTestId('perio-context').textContent)).toEqual({ patientId: '1', appointmentId: '20', date: '2026-10-12' });
});

test('opens the cached clicked visit and resets the create-chart state for the next appointment', async () => {
  const store = makeStore();
  appointmentService.getAppointmentById.mockResolvedValueOnce(visit('20')).mockResolvedValueOnce(visit('30', '2026-10-15'));
  await store.dispatch(fetchAppointmentById('20'));
  store.dispatch(setCurrentAppointment(visit('10')));
  await openPage(store);
  fireEvent.click(screen.getByRole('button', { name: 'Create Perio chart' }));
  expect(JSON.parse(screen.getByTestId('perio-context').textContent).appointmentId).toBe('20');
  expect(appointmentService.getAppointmentById).toHaveBeenCalledTimes(1);
  await act(async () => { fireEvent.click(screen.getByRole('link', { name: 'Next appointment fixture' })); });
  expect(screen.queryByTestId('perio-context')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Create Perio chart' }));
  expect(JSON.parse(screen.getByTestId('perio-context').textContent)).toEqual({ patientId: '1', appointmentId: '30', date: '2026-10-15' });
});

test('resolves the patient for an appointment-only link', async () => {
  const store = makeStore();
  appointmentService.getAppointmentById.mockResolvedValue(visit('20'));
  await openPage(store, '/clinical/treatment-plan?appointmentId=20');
  expect(fetchPatientById).toHaveBeenCalledWith('1');
  fireEvent.click(screen.getByRole('button', { name: 'Create Perio chart' }));
  expect(JSON.parse(screen.getByTestId('perio-context').textContent).patientId).toBe('1');
});

test('blocks a chart when the route patient does not own the appointment', async () => {
  appointmentService.getAppointmentById.mockResolvedValue(visit('20'));
  await openPage(makeStore(), '/clinical/treatment-plan?patientId=2&appointmentId=20');
  expect(screen.getByText(/belongs to a different patient/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Create Perio chart' })).not.toBeInTheDocument();
  expect(screen.queryByTestId('perio-context')).not.toBeInTheDocument();
});
