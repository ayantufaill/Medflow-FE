import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AppointmentHistoryDialog from '../appointment-history-modal/AppointmentHistoryDialog';
import FamilyAppointmentsDialog from '../family-appointments-modal/FamilyAppointmentsDialog';
import ScheduleGridHeader from '../ScheduleGridHeader';

import { appointmentService } from '../../../../services/appointment.service';
import {
  BRANCHES,
  LIVE,
  appointmentDateLabel,
  appointmentLabel,
  appointmentWallClock,
  clinicWallClock,
  freezeAtCapture,
  liveAppointments,
  liveBranch,
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

const capturedAt = new Date(LIVE.capturedAt);

/** Selects an option in a MUI <Select> (the filters use ReportSelect). */
const selectOption = async (combobox, optionLabel) => {
  fireEvent.mouseDown(combobox);
  const option = await screen.findByRole('option', { name: optionLabel });
  fireEvent.click(option);
};

const PATIENT_A = { id: '1907934300951087', firstName: 'Ali', lastName: 'Tariq' };

/** The date/time pairs the history table currently shows, sorted. */
const readHistoryRows = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => {
      const cells = within(row).getAllByRole('cell');
      return `${cells[1].textContent} ${cells[2].textContent}`;
    })
    .sort();

describe('schedule screen uses the clinic timezone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    freezeAtCapture();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ScheduleGridHeader', () => {
    it('shows the clinic clock and the clinic calendar day, not the host ones', async () => {
      const branch = BRANCHES.A; // America/New_York
      const store = makeStore({
        branch,
        appointment: { selectedDate: capturedAt.toISOString(), calendarView: 'day' },
      });

      renderWithStore(
        <MemoryRouter>
          <ScheduleGridHeader
            onNewAppointment={() => {}}
            onPrintClick={() => {}}
            onMoreClick={() => {}}
            privacyMode={false}
            setPrivacyMode={() => {}}
            hideBlocks={false}
            setHideBlocks={() => {}}
            showGhosted={false}
            setShowGhosted={() => {}}
          />
        </MemoryRouter>,
        { store }
      );

      const clinicNow = clinicWallClock(capturedAt, branch.timeZone);
      // The clinic's own date (New York is on the 22nd while UTC is on the 22nd
      // too, but the clock and the weekday must come from the clinic).
      const expectedDate = new Date(
        `${clinicNow.date}T12:00:00Z`
      ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });

      expect(screen.getByText(expectedDate)).toBeInTheDocument();

      const hour = Number(clinicNow.time.split(':')[0]);
      const minute = clinicNow.time.split(':')[1];
      const expectedClock = `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${
        hour < 12 ? 'AM' : 'PM'
      }`;
      expect(screen.getByText(expectedClock)).toBeInTheDocument();
    });
  });

  describe('FamilyAppointmentsDialog', () => {
    const FAMILY_MEMBER_2 = {
      _id: '1907934300951090',
      id: '1907934300951090',
      firstName: 'Sara',
      lastName: 'Tariq',
    };

    /** The live family payload of a branch, with a second family member. */
    const liveFamilyPayload = (key) => {
      const payload = liveBranch(key).familyAppointments;
      const appointments = payload.appointments.map((appt, idx) =>
        idx % 2 === 0
          ? appt
          : { ...appt, patientId: { ...FAMILY_MEMBER_2, id: FAMILY_MEMBER_2.id, _id: FAMILY_MEMBER_2._id } }
      );
      return {
        ...payload,
        familyMembers: [FAMILY_MEMBER_2],
        appointments,
        recareDueDatesByMember: {
          [PATIENT_A.id]: {
            'D1111': { dueDate: '2026-10-15', isOverdue: true },
            'D2222': { dueDate: '2026-12-01', isOverdue: false },
          },
        },
      };
    };

    beforeEach(() => {
      appointmentService.getFamilyAppointments.mockResolvedValue(liveFamilyPayload('A'));
    });

    it('lists the family appointments on the clinic calendar day', async () => {
      const branch = BRANCHES.A;
      const store = makeStore({
        branch,
        patient: { currentPatient: { ...PATIENT_A, firstName: 'Ali', lastName: 'Tariq' } },
        appointment: {
          familyAppointmentsDialogOpen: true,
          familyAppointmentsList: liveFamilyPayload('A').appointments,
          familyAppointmentsMembers: [FAMILY_MEMBER_2],
          familyAppointmentsRecareDueDates: liveFamilyPayload('A').recareDueDatesByMember,
        },
      });

      renderWithStore(<FamilyAppointmentsDialog />, { store });

      await waitFor(() =>
        expect(screen.getByText('Upcoming Appointments')).toBeInTheDocument()
      );

      // Every upcoming appointment is labelled with the clinic's date, i.e.
      // the UTC components of the pseudo-instant.
      const expectedLabels = liveAppointments('A')
        .map((a) => {
          const { date } = appointmentWallClock(a);
          const [y, m, d] = date.split('-');
          const weekday = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
            weekday: 'short',
            timeZone: 'UTC',
          });
          const month = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
            month: 'short',
            timeZone: 'UTC',
          });
          return `${weekday}, ${month} ${Number(d)}`;
        })
        .sort();

      const shown = screen
        .getAllByText(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}$/)
        .map((node) => node.textContent)
        .sort();

      expect(shown).toEqual(expectedLabels);
    });

    it('shows the overdue recare procedure on the clinic calendar day', async () => {
      const branch = BRANCHES.A;
      const store = makeStore({
        branch,
        patient: { currentPatient: { ...PATIENT_A, firstName: 'Ali', lastName: 'Tariq' } },
        appointment: {
          familyAppointmentsDialogOpen: true,
          familyAppointmentsList: liveFamilyPayload('A').appointments,
          familyAppointmentsMembers: [FAMILY_MEMBER_2],
          familyAppointmentsRecareDueDates: liveFamilyPayload('A').recareDueDatesByMember,
        },
      });

      renderWithStore(<FamilyAppointmentsDialog />, { store });

      await waitFor(() =>
        expect(screen.getByText('Upcoming Appointments')).toBeInTheDocument()
      );

      // The due date is a date-only clinical field: it must not drift with the
      // host's midnight, and only the overdue procedure is due.
      fireEvent.click(screen.getByRole('tab', { name: 'Due' }));

      await waitFor(() => expect(screen.getByText('Due Oct 15, 2026')).toBeInTheDocument());
      expect(screen.queryByText('Due Dec 01, 2026')).not.toBeInTheDocument();
    });
  });

  describe('AppointmentHistoryDialog', () => {
    beforeEach(() => {
      appointmentService.getPatientAppointments.mockResolvedValue(liveAppointments('A'));
    });

    it('renders every appointment on the clinic calendar day', async () => {
      const branch = BRANCHES.A;
      const store = makeStore({ branch });

      renderWithStore(
        <AppointmentHistoryDialog open onClose={() => {}} patient={PATIENT_A} />,
        { store }
      );

      await waitFor(() =>
        expect(appointmentService.getPatientAppointments).toHaveBeenCalledWith(
          PATIENT_A.id,
          500
        )
      );
      await waitFor(() =>
        expect(screen.getAllByRole('row').length).toBe(liveAppointments('A').length + 1)
      );

      // Every live appointment must be shown with the clinic's date (the UTC
      // components of the pseudo-instant), never the host machine's date.
      expect(readHistoryRows()).toEqual(
        liveAppointments('A')
          .map((a) => appointmentLabel(a))
          .sort()
      );
    });

    it('splits past and future appointments by the clinic clock', async () => {
      const branch = BRANCHES.A; // America/New_York
      const store = makeStore({ branch });

      renderWithStore(
        <AppointmentHistoryDialog open onClose={() => {}} patient={PATIENT_A} />,
        { store }
      );

      await waitFor(() =>
        expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
      );

      const clinicNow = clinicWallClock(capturedAt, branch.timeZone);
      const appointments = liveAppointments('A');
      const past = appointments.filter(
        (a) => appointmentWallClock(a).key <= clinicNow.key
      );
      const future = appointments.filter(
        (a) => appointmentWallClock(a).key > clinicNow.key
      );

      expect(past.length).toBeGreaterThan(0);
      expect(future.length).toBeGreaterThan(0);

      // ── Past ──────────────────────────────────────────────────────────────
      const filterSelect = screen.getAllByRole('combobox')[0];
      await selectOption(filterSelect, 'Past');

      await waitFor(() => {
        expect(readHistoryRows()).toEqual(past.map((a) => appointmentLabel(a)).sort());
      });

      // ── Future ────────────────────────────────────────────────────────────
      await selectOption(screen.getAllByRole('combobox')[0], 'Future');
      await waitFor(() => {
        expect(readHistoryRows()).toEqual(future.map((a) => appointmentLabel(a)).sort());
      });
    });
  });
});
