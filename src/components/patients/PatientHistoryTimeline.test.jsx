import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientHistoryTimeline from './PatientHistoryTimeline';
import VisitDatesTimeline from './VisitDatesTimeline';
import { usePatientHistoryTimeline } from '../../hooks/queries/usePatientHistoryTimeline';
import { patientService } from '../../services/patient.service';
import { practiceInfoService } from '../../services/practice-info.service';

jest.mock('../../hooks/redux/useBranch', () => ({ useBranch: () => ({ currentBranchId: 'clinic-2' }) }));
jest.mock('../../services/patient.service', () => ({ patientService: { getPatientAuditHistory: jest.fn() } }));
jest.mock('../../services/practice-info.service', () => ({ practiceInfoService: { getCurrentPracticeInfo: jest.fn() } }));

const event = (id, section = 'medical_history', patientId = '7') => ({
  _id: id, patientId, section, changedAt: '2026-10-09T20:00:00Z',
  actor: { firstName: 'Test', lastName: 'Clinician' }, source: 'office',
  oldValue: { generalInfo: { concern: 'Before' } },
  newValue: { generalInfo: { concern: 'After' } },
});

function Harness({ patientId = '7', section = 'medical_history' }) {
  const timeline = usePatientHistoryTimeline(patientId, section);
  return <>
    <button onClick={() => timeline.refresh()}>Refresh after save</button>
    <PatientHistoryTimeline key={`${patientId}-${section}`} timeline={timeline} historyLabel={section === 'medical_history' ? 'Medical' : 'Dental'} />
  </>;
}

function setup(props) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { ...render(<Harness {...props} />, { wrapper }), client };
}

beforeEach(() => {
  jest.clearAllMocks();
  practiceInfoService.getCurrentPracticeInfo.mockResolvedValue({ timezone: 'Asia/Karachi' });
});

test('loads real event details, keeps same-day saves, refreshes and reloads from the service', async () => {
  const records = [event('m1'), event('d1', 'dental_history'), event('other', 'medical_history', '8')];
  patientService.getPatientAuditHistory.mockImplementation(async () => [...records]);
  const view = setup();
  await screen.findByText(/Asia\/Karachi \(clinic timezone\)/);
  expect(screen.getAllByRole('button', { name: /^Saved / })).toHaveLength(1);
  expect(screen.getByText('Oct 10, 2026')).toBeInTheDocument();
  expect(practiceInfoService.getCurrentPracticeInfo).toHaveBeenCalledWith('clinic-2');
  fireEvent.keyDown(screen.getByRole('button', { name: /^Saved / }), { key: 'Enter' });
  expect(await screen.findByRole('dialog')).toHaveTextContent('Recorded by: Test Clinician');
  expect(screen.getByRole('table')).toHaveTextContent('Before');
  expect(screen.getByRole('table')).toHaveTextContent('After');
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  records.push(event('m2'));
  fireEvent.click(screen.getByRole('button', { name: 'Refresh after save' }));
  await waitFor(() => expect(screen.getAllByRole('button', { name: /^Saved / })).toHaveLength(2));
  view.unmount();
  view.client.clear();
  setup();
  await waitFor(() => expect(screen.getAllByRole('button', { name: /^Saved / })).toHaveLength(2));
  expect(patientService.getPatientAuditHistory).toHaveBeenCalledWith('7', { strict: true });
});

test('distinguishes loading, error and empty, retries and labels timezone fallback', async () => {
  let rejectRequest;
  patientService.getPatientAuditHistory.mockReturnValueOnce(new Promise((resolve, reject) => { rejectRequest = reject; }));
  practiceInfoService.getCurrentPracticeInfo.mockRejectedValue(new Error('Unavailable'));
  setup();
  expect(screen.getByRole('status')).toHaveTextContent('Loading medical');
  expect(screen.queryByText(/No recorded/)).not.toBeInTheDocument();
  rejectRequest(new Error('Unavailable'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load');
  expect(screen.queryByText(/No recorded/)).not.toBeInTheDocument();
  patientService.getPatientAuditHistory.mockResolvedValueOnce([]);
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  await screen.findByText('No recorded medical history changes yet.');
  patientService.getPatientAuditHistory.mockResolvedValueOnce([event('m1')]);
  fireEvent.click(screen.getByRole('button', { name: 'Refresh after save' }));
  await screen.findByText(/UTC \(clinic timezone unavailable\)/);
});

test('switching patient or section never displays the previous patient history', async () => {
  patientService.getPatientAuditHistory.mockImplementation(async (id) => [event(`m-${id}`, 'medical_history', id), event(`d-${id}`, 'dental_history', id)]);
  const view = setup();
  await screen.findByRole('button', { name: /^Saved / });
  view.rerender(<Harness patientId="8" section="dental_history" />);
  expect(screen.queryByRole('button', { name: /^Saved / })).not.toBeInTheDocument();
  await screen.findByRole('button', { name: /^Saved / });
  fireEvent.click(screen.getByRole('button', { name: /^Saved / }));
  expect(await screen.findByRole('dialog')).toHaveTextContent('Dental history');
  expect(patientService.getPatientAuditHistory).toHaveBeenLastCalledWith('8', { strict: true });
});

test('a failed refresh keeps earlier events visible with a retry message', async () => {
  patientService.getPatientAuditHistory.mockResolvedValueOnce([event('m1')]);
  setup();
  await screen.findByRole('button', { name: /^Saved / });
  patientService.getPatientAuditHistory.mockRejectedValueOnce(new Error('Disconnected'));
  fireEvent.click(screen.getByRole('button', { name: 'Refresh after save' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Previously loaded events are shown below');
  expect(screen.getByRole('button', { name: /^Saved / })).toBeInTheDocument();
  expect(screen.queryByText(/No recorded/)).not.toBeInTheDocument();
});

test('preserves appointment selection and deletion used by other clinical pages', () => {
  const onDateClick = jest.fn();
  const onRemoveDate = jest.fn();
  render(<VisitDatesTimeline visitDates={[{ appointmentId: 'apt1', label: 'Oct 09, 2026' }]}
    onDateClick={onDateClick} activeAppointmentId="apt1" onRemoveDate={onRemoveDate} />);
  const node = screen.getByRole('button', { name: 'Oct 09, 2026' });
  expect(node).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(node);
  expect(onDateClick).toHaveBeenCalledWith('apt1');
  fireEvent.click(screen.getByTestId('DeleteOutlineIcon'));
  expect(onRemoveDate).toHaveBeenCalledWith(0);
});
