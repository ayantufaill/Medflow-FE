import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import AppointmentDetailFooter from '../appointment-detail-modal/AppointmentDetailFooter';
import AppointmentDetailPatientCard from '../appointment-detail-modal/AppointmentDetailPatientCard';
import LabCasesTable from '../lab-cases-modal/LabCasesTable';
import ProgressNotesTables from '../progress-notes-modal/ProgressNotesTables';

import { BRANCHES, freezeAtCapture, makeStore, renderWithStore } from './testUtils';

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

/**
 * The capture instant is 2026-10-22 01:19 in New York: the clinic's today is
 * the 22nd, while a host in Anchorage is still on the 21st.
 */
describe('schedule modals follow the clinic clock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    freezeAtCapture();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('AppointmentDetailFooter', () => {
    it('reschedules to the clinic today when no date was picked', () => {
      const onSave = jest.fn();
      const store = makeStore({ branch: BRANCHES.A });

      renderWithStore(
        <AppointmentDetailFooter
          isRescheduling
          editDate={null}
          editTime="09:00"
          editAmPm="AM"
          status="scheduled"
          onSave={onSave}
          onClose={() => {}}
          onCancelReschedule={() => {}}
          onStartReschedule={() => {}}
          onClinicalExam={() => {}}
        />,
        { store }
      );

      fireEvent.click(screen.getByRole('button', { name: 'Save Reschedules' }));

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ appointmentDate: '2026-10-22', startTime: '09:00' })
      );
    });
  });

  describe('AppointmentDetailPatientCard', () => {
    it('stamps the card with the clinic today', () => {
      const store = makeStore({ branch: BRANCHES.A });

      renderWithStore(
        <AppointmentDetailPatientCard
          patient={{ firstName: 'Ali', lastName: 'Tariq', dateOfBirth: '1990-05-04' }}
          appointment={{ status: 'scheduled' }}
          isEditing={false}
          onEdit={() => {}}
          onCancel={() => {}}
          onSave={() => {}}
        />,
        { store }
      );

      expect(screen.getAllByText('Oct 22, 2026').length).toBeGreaterThan(0);
      expect(screen.getByText(/10\/22\/2026/)).toBeInTheDocument();
    });
  });

  describe('LabCasesTable', () => {
    it('shows the lab case dates of the clinic', () => {
      const store = makeStore({ branch: BRANCHES.A });

      renderWithStore(
        <LabCasesTable
          labCases={[
            {
              _id: 'l1',
              patientName: 'Ali Tariq',
              labName: 'Dental Arts',
              dueDate: '2026-10-24T23:30:00.000Z',
              appointmentDate: '2026-10-22T09:00:00.000Z',
              status: 'New',
            },
          ]}
          sortConfig={{ key: 'dueDate', order: 'asc' }}
          onSort={() => {}}
          pagination={{ page: 1, totalPages: 1, total: 1 }}
          onPageChange={() => {}}
          expandedNotes={{}}
        />,
        { store }
      );

      expect(screen.getByText('10/24/2026')).toBeInTheDocument();
      expect(screen.getByText('10/22/2026')).toBeInTheDocument();
    });
  });

  describe('ProgressNotesTables', () => {
    it('shows the visit date of the clinic', () => {
      const store = makeStore({ branch: BRANCHES.A });

      renderWithStore(
        <ProgressNotesTables
          missingNotes={[
            {
              _id: 'n1',
              appointmentDate: '2026-10-24T23:30:00.000Z',
              patientId: { firstName: 'Ali', lastName: 'Tariq' },
              procedures: ['Crown'],
            },
          ]}
          unsignedNotes={[]}
          signedNotes={[]}
          expandedNoteIds={[]}
          toggleNoteExpansion={() => {}}
          editingNoteId={null}
          editingContent=""
          setEditingContent={() => {}}
          handleEditStart={() => {}}
          handleEditCancel={() => {}}
          handleEditSave={() => {}}
          handleSignNote={() => {}}
          getProviderName={() => 'Dr Who'}
        />,
        { store }
      );

      expect(screen.getByText('10/24/2026')).toBeInTheDocument();
    });
  });
});
