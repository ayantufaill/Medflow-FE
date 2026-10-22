import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { MemoryRouter } from 'react-router-dom';

import ScheduleTimeGrid from '../ScheduleTimeGrid';

import { BRANCHES, makeStore, renderWithStore } from './testUtils';

jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { _id: 'u1', firstName: 'A', lastName: 'B', roles: [] } }),
  AuthProvider: ({ children }) => children,
}));

jest.mock('../../../../config/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

/**
 * 2026-10-22T15:00Z is 11:00 in New York. The grid's day is therefore the
 * 22nd and the 09:00 slot is in the past while the 13:00 slot is not — no
 * matter which zone the host machine runs in.
 */
const CLINIC_NOW = '2026-10-22T15:00:00.000Z';

const ROOMS = [{ _id: 'r1', name: 'Op 1' }];

const appointment = (overrides) => ({
  _id: 'apt-1',
  appointmentDate: '2026-10-22T09:00:00.000Z',
  startTime: '09:00',
  endTime: '10:00',
  roomId: 'r1',
  patientId: { firstName: 'Ali', lastName: 'Tariq' },
  appointmentType: { name: 'Exam' },
  providerId: { firstName: 'Dr', lastName: 'Who' },
  status: 'scheduled',
  ...overrides,
});

const renderGrid = (list) => {
  const store = makeStore({
    branch: BRANCHES.A, // America/New_York
    appointment: {
      selectedDate: CLINIC_NOW,
      calendarView: 'day',
      list,
    },
  });

  return renderWithStore(
    <MemoryRouter>
      <DndContext>
        <ScheduleTimeGrid
          rooms={ROOMS}
          onSlotClick={() => {}}
          onBlockClick={() => {}}
          scheduleBlocks={[]}
          privacyMode={false}
          showGhosted={false}
          isCloseOpenDayMode={false}
          closedOperatories={{}}
        />
      </DndContext>
    </MemoryRouter>,
    { store }
  );
};

/** The clickable 10-minute zones of one grid hour (7 AM is the first hour). */
const slotZone = (container, hour) => {
  const cells = container.querySelectorAll('.droppable-cell-container');
  const cell = cells[hour - 7];
  return cell?.children[0] ?? null;
};

describe('ScheduleTimeGrid follows the clinic clock', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
    jest.setSystemTime(new Date(CLINIC_NOW));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('labels the appointments with the clinic wall clock', () => {
    const { container } = renderGrid([
      appointment({ _id: 'apt-1' }),
      appointment({
        _id: 'apt-2',
        appointmentDate: '2026-10-22T13:00:00.000Z',
        startTime: '13:00',
        endTime: '14:00',
      }),
    ]);

    // The card's time comes from the stored wall clock (the clinic's), so it
    // never depends on the host's zone.
    expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('1:00 PM')).toBeInTheDocument();
  });

  it('refuses to open a slot that the clinic already passed', () => {
    const { container } = renderGrid([]);

    fireEvent.click(slotZone(container, 9));
    expect(screen.queryByText('Schedule Appointment')).not.toBeInTheDocument();

    fireEvent.click(slotZone(container, 13));
    expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
  });

  it('closes every slot of a day that is over for the clinic', () => {
    // The 21st is yesterday in New York, no matter where the host runs.
    const store = makeStore({
      branch: BRANCHES.A,
      appointment: {
        selectedDate: '2026-10-21T15:00:00.000Z',
        calendarView: 'day',
        list: [],
      },
    });

    const { container } = renderWithStore(
      <MemoryRouter>
        <DndContext>
          <ScheduleTimeGrid
            rooms={ROOMS}
            onSlotClick={() => {}}
            onBlockClick={() => {}}
            scheduleBlocks={[]}
            privacyMode={false}
            showGhosted={false}
            isCloseOpenDayMode={false}
            closedOperatories={{}}
          />
        </DndContext>
      </MemoryRouter>,
      { store }
    );

    fireEvent.click(slotZone(container, 13));
    expect(screen.queryByText('Schedule Appointment')).not.toBeInTheDocument();
  });
});
