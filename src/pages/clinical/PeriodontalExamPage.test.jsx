import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PeriodontalExamPage from './PeriodontalExamPage';

let mockRecord = null;
let mockRecords = {};
let mockHistory = [];
let mockAppointment;
const mockExamQuery = jest.fn();
const mockSave = jest.fn();
const mockSign = jest.fn();
const mockSnackbar = jest.fn();
const mockBuildPrintHtml = jest.fn(() => '<html></html>');
const mockPrintChart = jest.fn(() => Promise.resolve());
const mockMutation = { mutateAsync: mockSave, isPending: false };
jest.mock('../../hooks/queries/useClinicalExam', () => ({
  useClinicalExamQuery: (type, appointmentId) => {
    mockExamQuery(type, appointmentId);
    return { data: type === 'periodontal' ? (Object.hasOwn(mockRecords, appointmentId) ? mockRecords[appointmentId] : mockRecord) : null, isLoading: false, isError: false };
  },
  useUpsertClinicalExam: () => mockMutation,
  useSignClinicalExam: () => ({ mutateAsync: mockSign }),
  useDeleteClinicalExam: () => ({ mutateAsync: jest.fn() }),
  useExamHistoryDates: () => ({ data: mockHistory }),
}));
jest.mock('../../contexts/SnackbarContext', () => ({ useSnackbar: () => ({ showSnackbar: mockSnackbar }) }));
jest.mock('../../hooks/redux/useAppointment', () => ({ useAppointmentDetail: () => ({ currentAppointment: mockAppointment }) }));
jest.mock('../../store/slices/patientSlice', () => ({ selectSelectedPatientId: () => '1' }));
jest.mock('../../store/slices/appointmentSlice', () => ({ selectSelectedAppointmentId: () => '10' }));
jest.mock('../../services/patient.service', () => ({ patientService: { getPatientById: jest.fn() } }));
jest.mock('../../utils/printPeriodontalChart', () => ({
  buildPeriodontalChartPrintHtml: (...args) => mockBuildPrintHtml(...args),
  printPeriodontalChart: (...args) => mockPrintChart(...args),
}));
jest.mock('../../components/clinical/ClinicalNavbar', () => () => null);
jest.mock('../../components/clinical/ExamNavbar', () => () => null);
jest.mock('../../components/shared/ConfirmationDialog', () => () => null);
jest.mock('../../components/appointments/right-panel/RightPanel', () => () => null);
jest.mock('../../components/clinical/periodontal/PeriographTab', () => () => null);
jest.mock('../../components/clinical/periodontal/SummaryCard', () => () => null);
jest.mock('../../components/clinical/periodontal/DiagnosisCard', () => () => null);
jest.mock('../../components/radiographic/ExamActionBar', () => ({ onSave, onConfirmSign }) => <>
  <button onClick={onSave}>Save chart fixture</button>
  <button onClick={onConfirmSign}>Sign chart fixture</button>
</>);
jest.mock('../../components/clinical/PerioChartGrid', () => {
  const React = require('react');
  return { __esModule: true, default: React.forwardRef(function Chart({ chartData, setChartData }, ref) {
    return <div ref={ref}>
      <output data-testid="chart">{JSON.stringify(chartData)}</output>
      <button onClick={() => setChartData(prev => ({ ...prev, 1: { ...prev[1], facial: { ...prev[1]?.facial, probe: ['5', '', ''] } } }))}>Record pocket</button>
    </div>;
  }) };
});

function fixture() {
  const initial = { auth: { user: { providerId: '2' } }, clinicalExamSession: { exam: { periodontal: {} } } };
  const store = configureStore({ reducer: (state = initial, action) => {
    if (action.type !== 'clinicalExamSession/setExamSubTabSession') return state;
    return { ...state, clinicalExamSession: { exam: { periodontal: {
      ...state.clinicalExamSession.exam.periodontal, ...action.payload.data,
    } } } };
  } });
  const view = (patientId = '1', appointmentId = '10', appointment) => <Provider store={store}>
    <PeriodontalExamPage embedded patientId={patientId} appointmentId={appointmentId} appointment={appointment} />
  </Provider>;
  return { ...render(view()), view };
}

beforeEach(() => {
  jest.useFakeTimers();
  mockRecord = null;
  mockRecords = {};
  mockHistory = [];
  mockAppointment = { _id: '10', providerId: { _id: '2' }, appointmentDate: '2026-10-12' };
  mockExamQuery.mockClear();
  mockSave.mockReset().mockResolvedValue({});
  mockSign.mockReset().mockResolvedValue({});
  mockBuildPrintHtml.mockClear();
  mockPrintChart.mockClear();
});
afterEach(() => { jest.useRealTimers(); });

test('opening a new chart leaves measurements blank and does not autosave', async () => {
  fixture();
  const data = JSON.parse(screen.getByTestId('chart').textContent);
  expect(data['1'].facial).toMatchObject({ probe: ['', '', ''], bleeding: [], recession: ['', '', ''], mobility: '', pcs: [] });
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(mockSave).not.toHaveBeenCalled();
});

test('prints the selected patient and appointment chart without saving it', async () => {
  const { patientService } = require('../../services/patient.service');
  patientService.getPatientById.mockResolvedValueOnce({ _id: '1', firstName: 'Ava', lastName: 'Stone', patientCode: 'P-1' });
  mockRecord = { examData: { chartData: { 1: { facial: { probe: ['5', '', ''] } } } }, updatedAt: '2026-10-12' };
  fixture();

  fireEvent.click(screen.getByRole('button', { name: 'Print periodontal chart' }));
  await waitFor(() => expect(mockPrintChart).toHaveBeenCalledWith('<html></html>'));
  expect(mockBuildPrintHtml).toHaveBeenCalledWith(expect.objectContaining({
    patient: expect.objectContaining({ firstName: 'Ava' }),
    patientId: '1', appointmentId: '10',
    chartData: expect.objectContaining({ 1: expect.objectContaining({ facial: expect.objectContaining({ probe: ['5', '', ''] }) }) }),
  }));
  expect(mockSave).not.toHaveBeenCalled();
});

test('autosaves entered data and reloads the saved chart without saving it again', async () => {
  const { rerender, view } = fixture();
  fireEvent.click(screen.getByText('Record pocket'));
  await act(async () => { jest.advanceTimersByTime(3000); });
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(mockSave.mock.calls[0][0]).toMatchObject({ patientId: '1', providerId: '2',
    examData: { chartData: { 1: { facial: { probe: ['5', '', ''] } } }, missingTeeth: [] },
  });
  mockRecord = { examData: mockSave.mock.calls[0][0].examData };
  rerender(view());
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(JSON.parse(screen.getByTestId('chart').textContent)['1'].facial.probe).toEqual(['5', '', '']);
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test('changing patients cancels a pending autosave and clears the previous chart', async () => {
  const { rerender, view } = fixture();
  fireEvent.click(screen.getByText('Record pocket'));
  rerender(view('3', '30'));
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(mockSave).not.toHaveBeenCalled();
  expect(JSON.parse(screen.getByTestId('chart').textContent)['1'].facial.probe).toEqual(['', '', '']);
});

test('keeps pending chart edits when leaving and returning to the same appointment', async () => {
  const { unmount, view } = fixture();
  fireEvent.click(screen.getByText('Record pocket'));
  unmount();
  render(view());
  expect(JSON.parse(screen.getByTestId('chart').textContent)['1'].facial.probe).toEqual(['5', '', '']);
  await act(async () => { jest.advanceTimersByTime(3000); });
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test('persists pending edits before signing and cancels the pending autosave', async () => {
  fixture();
  fireEvent.click(screen.getByText('Record pocket'));
  await act(async () => { fireEvent.click(screen.getByText('Sign chart fixture')); });
  expect(mockSave).toHaveBeenCalledTimes(1);
  expect(mockSign).toHaveBeenCalledTimes(1);
  expect(mockSave.mock.invocationCallOrder[0]).toBeLessThan(mockSign.mock.invocationCallOrder[0]);
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(mockSave).toHaveBeenCalledTimes(1);
});

test('shows and selects the current appointment date before its first chart save', () => {
  mockHistory = [{ appointmentId: '9', date: '2026-10-10' }];
  fixture();
  expect(screen.getByRole('button', { name: /Oct 12, 2026/ })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Oct 10, 2026' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByText('Record pocket')).not.toBeDisabled();
  expect(mockSave).not.toHaveBeenCalled();
});

test('returns from signed history to the current editable appointment without modifying history', async () => {
  mockHistory = [{ appointmentId: '9', date: '2026-10-10' }];
  mockRecords['9'] = { isSigned: true, examData: { chartData: { 1: { facial: { probe: ['7', '', ''] } } } } };
  fixture();
  fireEvent.click(screen.getByRole('button', { name: 'Oct 10, 2026' }));
  expect(screen.getByText(/signed and locked/)).toBeInTheDocument();
  expect(screen.getByText('Record pocket')).toBeDisabled();
  expect(screen.getByRole('button', { name: 'New Exam' })).not.toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'New Exam' }));
  expect(screen.queryByText(/signed and locked/)).not.toBeInTheDocument();
  expect(screen.getByText('Record pocket')).not.toBeDisabled();
  expect(screen.getByRole('button', { name: /Oct 12, 2026/ })).toHaveAttribute('aria-pressed', 'true');
  expect(JSON.parse(screen.getByTestId('chart').textContent)['1'].facial.probe).toEqual(['', '', '']);
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(mockSave).not.toHaveBeenCalled();
});

test('switching appointments resets a historical selection and uses the passed appointment date', () => {
  mockHistory = [{ appointmentId: '9', date: '2026-10-10' }];
  mockRecords['9'] = { isSigned: true, examData: {} };
  const { rerender, view } = fixture();
  fireEvent.click(screen.getByRole('button', { name: 'Oct 10, 2026' }));
  rerender(view('1', '20', { _id: '20', appointmentDate: '2026-10-15' }));
  expect(screen.queryByText(/signed and locked/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Oct 15, 2026/ })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('button', { name: /Oct 12, 2026/ })).not.toBeInTheDocument();
  expect(mockExamQuery).toHaveBeenLastCalledWith('radiographic', '20');
});

test('deduplicates numeric history IDs and keeps the current scheduled date after saving', () => {
  mockHistory = [{ appointmentId: 10, date: '2026-10-13' }];
  mockRecord = { isSigned: true, examData: {} };
  fixture();
  expect(screen.getAllByRole('button', { name: 'Oct 12, 2026' })).toHaveLength(1);
  expect(screen.queryByRole('button', { name: 'Oct 13, 2026' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'New Exam' })).toBeDisabled();
  expect(screen.getByText('Record pocket')).toBeDisabled();
});
