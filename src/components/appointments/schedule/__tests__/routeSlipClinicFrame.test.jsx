import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import RouteSlipDialog from '../route-slip-modal/RouteSlipDialog';

import clinicalManagementReducer from '../../../../store/slices/clinicalManagementSlice';
import { appointmentService } from '../../../../services/appointment.service';
import {
  BRANCHES,
  freezeAtCapture,
  initialSliceState,
  makeStore,
  renderWithStore,
} from './testUtils';

jest.mock('../../../../config/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../../contexts/SnackbarContext', () => ({
  useSnackbar: () => ({
    showSnackbar: jest.fn(),
    hideSnackbar: jest.fn(),
    snackbar: { open: false, message: '', severity: 'success' },
  }),
  SnackbarProvider: ({ children }) => children,
}));

jest.mock('../../../../services/appointment.service', () => ({
  appointmentService: {
    getPatientAppointments: jest.fn(),
    getFamilyAppointments: jest.fn(),
  },
}));

const PATIENT = { _id: 'p1', id: 'p1', firstName: 'Ali', lastName: 'Tariq' };

/** The route slip template the backend stores for the practice. */
const TEMPLATE = `
  <div class="route-slip">
    <div>Appointment Date</div>
    <div>Appt Time</div>
    <div>Patient DOB</div>
    <div>Next Appointment Info</div>
  </div>
`;

/**
 * The route slip falls back to "the appointment of the clinic's today" when no
 * appointment is selected. The host machine's today is a different day
 * whenever the host runs in another zone (the capture instant is still the
 * 21st in Anchorage), so the fallback has to follow the clinic.
 */
describe('RouteSlipDialog follows the clinic clock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    freezeAtCapture();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderSlip = (patientHistoryList, currentAppointment = null) => {
    appointmentService.getPatientAppointments.mockResolvedValue(patientHistoryList);

    const store = makeStore({
      branch: BRANCHES.A, // America/New_York
      patient: { currentPatient: PATIENT },
      appointment: {
        routeSlipDialogOpen: true,
        currentAppointment,
        patientHistoryList,
      },
      extra: {
        clinicalManagement: {
          ...initialSliceState(clinicalManagementReducer),
          settingsMap: { route_slip_template_config: TEMPLATE },
        },
      },
    });

    return renderWithStore(
      <MemoryRouter>
        <RouteSlipDialog />
      </MemoryRouter>,
      { store }
    );
  };

  it('picks the appointment of the clinic day, not of the host day', async () => {
    // The capture instant is 2026-10-22 01:19 in New York, but still the
    // 21st in Anchorage. Only the 22nd is the clinic's today.
    renderSlip([
      {
        _id: 'host-day',
        appointmentDate: '2026-10-21T15:00:00.000Z',
        startTime: '15:00',
        patientId: PATIENT,
      },
      {
        _id: 'clinic-day',
        appointmentDate: '2026-10-22T09:00:00.000Z',
        startTime: '09:00',
        patientId: PATIENT,
      },
    ]);

    await waitFor(() =>
      expect(screen.getByText('Thursday Oct 22, 2026')).toBeInTheDocument()
    );
    expect(screen.queryByText('Wednesday Oct 21, 2026')).not.toBeInTheDocument();
  });

  it('shows the next appointment of the clinic', async () => {
    renderSlip([
      {
        _id: 'clinic-day',
        appointmentDate: '2026-10-22T09:00:00.000Z',
        startTime: '09:00',
        patientId: PATIENT,
      },
      {
        _id: 'later',
        appointmentDate: '2026-10-25T14:30:00.000Z',
        startTime: '14:30',
        patientId: PATIENT,
      },
    ]);

    await waitFor(() =>
      expect(screen.getByText('Thursday Oct 22, 2026')).toBeInTheDocument()
    );
    expect(screen.getByText(/Sunday Oct 25, 2026/)).toBeInTheDocument();
  });

  it('shows the time of the clinic', async () => {
    // The selected appointment carries no wall-clock time, so the renderer
    // reads the clock off the stored pseudo-instant — the clinic's wall clock.
    renderSlip(
      [],
      {
        _id: 'selected',
        appointmentDate: '2026-10-22T09:00:00.000Z',
        patientId: PATIENT,
      }
    );

    await waitFor(() => expect(screen.getByText('9:00 AM')).toBeInTheDocument());
    expect(screen.getByText('Thursday Oct 22, 2026')).toBeInTheDocument();
  });
});
