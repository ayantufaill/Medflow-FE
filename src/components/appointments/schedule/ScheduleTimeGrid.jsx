import { useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import {
  HOURS, HOUR_HEIGHT, TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH,
  START_HOUR, END_HOUR, STATUS_COLORS, formatHour,
} from './scheduleConstants';
import AppointmentCard from './AppointmentCard';
import { useScheduleState, useAppointmentList, useDropdownData } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

// Total height of the scrollable grid area — never changes.
const TOTAL_HEIGHT = HOURS.length * HOUR_HEIGHT;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Maps a raw API appointment object to the shape AppointmentCard expects.
// Returns null for appointments that fall outside the visible hour range.
const mapApiAppointmentToGridItem = (appt) => {
  if (!appt.startTime || !appt.endTime) return null;

  const [startHour, startMinute] = appt.startTime.split(':').map(Number);
  const [endHour, endMinute] = appt.endTime.split(':').map(Number);

  // Skip appointments that start before the grid or after the last visible hour
  if (startHour < START_HOUR || startHour >= END_HOUR) return null;

  const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

  // patientId may be a populated Mongoose object or a bare string ID.
  const patientObj = appt.patientId && typeof appt.patientId === 'object' ? appt.patientId : null;
  const patientName = patientObj
    ? `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim() || 'Patient'
    : 'Patient';

  // Convert 24-hr "09:30" → "9:30 AM" for display in the card header.
  const displayTime = dayjs(`2000-01-01T${appt.startTime}`).format('h:mm A');

  const statusKey = (appt.status || 'unconfirmed').toLowerCase();

    const cf = appt.customFields || {};
    let procString = appt.chiefComplaint || appt.appointmentTypeName || appt.type || 'EXAM, PROPHY';
    let computedPrice = appt.totalAmount || 0;
    
    if (cf.procedures && Array.isArray(cf.procedures) && cf.procedures.length > 0) {
      procString = cf.procedures.map(p => p.treatment || p.code).join(', ');
      computedPrice = cf.procedures.reduce((sum, p) => {
        const charge = String(p.charge || '0').replace(/[^0-9.]/g, '');
        return sum + (parseFloat(charge) || 0);
      }, 0);
    }
    
    const tagsArray = Array.isArray(cf.procedureTags) && cf.procedureTags.length > 0 
      ? cf.procedureTags 
      : (Array.isArray(appt.tags) && appt.tags.length > 0 ? appt.tags : []);
      
    const priceStr = computedPrice > 0 ? `$${computedPrice.toFixed(2)}` : '$0.00';

    return {
      id:              appt._id || appt.id,
      patientName,
      time:            displayTime,
      status:          statusKey.toUpperCase(),
      startHour,
      startMinute,
      durationMinutes,
      roomId:          appt.roomId || null,
      headerColor:     STATUS_COLORS[statusKey] || '#2262ef',
      procedures:      procString,
      description:     appt.notes || appt.reason || '',
      tags:            tagsArray,
      price:           priceStr,
    };
};

// Computes the absolute CSS position for a grid item inside the time grid.
// colIndex is the zero-based position of the matching room in the rooms array.
const getGridPosition = (gridItem, colIndex) => {
  const top    = (gridItem.startHour - START_HOUR) * HOUR_HEIGHT + (gridItem.startMinute / 60) * HOUR_HEIGHT;
  const height = Math.max((gridItem.durationMinutes / 60) * HOUR_HEIGHT - 4, 24); // floor at 24 px
  const left   = TIME_LABEL_WIDTH + colIndex * COLUMN_MIN_WIDTH + 3;
  const width  = COLUMN_MIN_WIDTH - 6;
  return { top: top + 2, height, left, width };
};

// ─── Component ────────────────────────────────────────────────────────────────

const ScheduleTimeGrid = ({ onSlotClick }) => {
  const { calendarView, selectedDate } = useScheduleState();
  const { rooms }                      = useDropdownData({ rooms: true });

  // Convert the ISO date string to a dayjs object for date arithmetic.
  const dayjsDate = dayjs(selectedDate);

  // Derive the API query date range from the current view and selected date.
  // Day view: a single day. Week/month views bracket the full period.
  const viewUnit  = calendarView === 'day' ? 'day' : calendarView;
  const startDate = dayjsDate.startOf(viewUnit).format('YYYY-MM-DD');
  const endDate   = dayjsDate.endOf(viewUnit).format('YYYY-MM-DD');

  // Auto-fetches on mount using the current date range as initialFilters.
  // The thunk condition prevents concurrent requests so the double-fire from
  // the re-fetch effect below is harmless on mount.
  const {
    appointments: rawAppointments,
    fetch: fetchAppts,
    loading,
  } = useAppointmentList({ startDate, endDate, limit: 200 });

  // Re-fetch when the user navigates to a different date or switches view.
  useEffect(() => {
    fetchAppts({ startDate, endDate, limit: 200 });
  }, [startDate, endDate]); // fetchAppts is a stable useCallback; startDate/endDate are strings

  // Build a roomId → column-index lookup for fast position calculation.
  const roomIndexMap = useMemo(() => {
    const map = {};
    rooms.forEach((room, idx) => {
      const id = room._id || room.id;
      if (id) map[id] = idx;
    });
    return map;
  }, [rooms]);

  // Filter to the selected date (guards against stale list state during navigation)
  // then convert each API record to the AppointmentCard shape.
  const visibleAppointments = useMemo(() => {
    const targetDate = dayjsDate.format('YYYY-MM-DD');
    return rawAppointments
      .filter((appt) => {
        const apptDate = appt.appointmentDate
          ? String(appt.appointmentDate).slice(0, 10)
          : null;
        return apptDate === targetDate;
      })
      .map(mapApiAppointmentToGridItem)
      .filter(Boolean); // remove nulls from appointments outside the hour range
  }, [rawAppointments, selectedDate]);

  // Total grid width grows with the number of rooms.
  const totalWidth = TIME_LABEL_WIDTH + (rooms.length || 1) * COLUMN_MIN_WIDTH;

  return (
    <Box sx={{ position: 'relative', height: TOTAL_HEIGHT, width: totalWidth }}>

      {/* ── Hour rows — grid background ─────────────────────────────────────── */}
      {HOURS.map((hour) => (
        <Box
          key={hour}
          sx={{
            position: 'absolute',
            top: (hour - START_HOUR) * HOUR_HEIGHT,
            left: 0,
            width: totalWidth,
            height: HOUR_HEIGHT,
            display: 'flex',
            borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          {/* Time gutter label */}
          <Box
            sx={{
              width: TIME_LABEL_WIDTH,
              flexShrink: 0,
              pt: '6px',
              pr: '10px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_MUTED }}>
              {formatHour(hour)}
            </Typography>
          </Box>

          {/* One cell per operatory column */}
          {rooms.map((room, idx) => (
            <Box
              key={room._id || room.id || idx}
              onClick={(e) => {
                if (!onSlotClick) return;
                // Get click Y relative to the box
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const isBottomHalf = y > (HOUR_HEIGHT / 2);
                const mins = isBottomHalf ? 30 : 0;
                onSlotClick(hour, mins, room._id || room.id || room.roomCode || room.title || room.name);
              }}
              sx={{
                width: COLUMN_MIN_WIDTH,
                flexShrink: 0,
                borderLeft: `1px solid ${COLORS.BORDER}`,
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(34, 98, 239, 0.04)',
                },
                // Half-hour dashed divider drawn via CSS pseudo-element.
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  borderTop: '1px dashed #e8ecf0',
                  pointerEvents: 'none',
                },
              }}
            />
          ))}
        </Box>
      ))}

      {/* ── Loading overlay — shown while fetching ───────────────────────────── */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pt: '60px',
            backgroundColor: 'rgba(255,255,255,0.6)',
            zIndex: 10,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      {/* ── Appointment cards — absolutely positioned in the grid ──────────── */}
      {visibleAppointments.map((gridItem) => {
        // Resolve column index from the roomId; unmatched rooms fall to column 0.
        const colIndex = roomIndexMap[gridItem.roomId] ?? 0;
        const pos = getGridPosition(gridItem, colIndex);

        return (
          <Box
            key={gridItem.id}
            sx={{
              position: 'absolute',
              top: pos.top,
              height: pos.height,
              left: pos.left,
              width: pos.width,
              zIndex: 2,
            }}
          >
            <AppointmentCard appointment={gridItem} />
          </Box>
        );
      })}
    </Box>
  );
};

export default ScheduleTimeGrid;
