import { Box, Typography } from '@mui/material';
import {
  OPERATORIES, HOURS, HOUR_HEIGHT, TIME_LABEL_WIDTH,
  START_HOUR, MOCK_APPOINTMENTS, formatHour,
} from './scheduleConstants';
import AppointmentCard from './AppointmentCard';

const N = OPERATORIES.length;
const TOTAL_HEIGHT = HOURS.length * HOUR_HEIGHT;

const getAppointmentPosition = (apt) => {
  const opIndex = OPERATORIES.findIndex((op) => op.id === apt.operatoryId);
  const top = (apt.startHour - START_HOUR) * HOUR_HEIGHT + (apt.startMinute / 60) * HOUR_HEIGHT;
  const height = (apt.durationMinutes / 60) * HOUR_HEIGHT - 4;

  return {
    top: top + 2,
    height,
    left: `calc(${TIME_LABEL_WIDTH}px + ${opIndex} * (100% - ${TIME_LABEL_WIDTH}px) / ${N} + 3px)`,
    width: `calc((100% - ${TIME_LABEL_WIDTH}px) / ${N} - 6px)`,
  };
};

const ScheduleTimeGrid = () => (
  <Box sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
    {/* Grid background — hour rows */}
    <Box sx={{ position: 'relative', height: TOTAL_HEIGHT }}>
      {HOURS.map((hour) => (
        <Box
          key={hour}
          sx={{
            position: 'absolute',
            top: (hour - START_HOUR) * HOUR_HEIGHT,
            left: 0,
            right: 0,
            height: HOUR_HEIGHT,
            display: 'flex',
            borderBottom: '1px solid #f0f2f5',
          }}
        >
          {/* Time label */}
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
            <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#9aa3ae' }}>
              {formatHour(hour)}
            </Typography>
          </Box>

          {/* Operatory cells */}
          {OPERATORIES.map((op) => (
            <Box
              key={op.id}
              sx={{
                flex: 1,
                borderLeft: '1px solid #e0e5eb',
                position: 'relative',
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

      {/* Appointments layer */}
      {MOCK_APPOINTMENTS.map((apt) => {
        const pos = getAppointmentPosition(apt);
        return (
          <Box
            key={apt.id}
            sx={{
              position: 'absolute',
              top: pos.top,
              height: pos.height,
              left: pos.left,
              width: pos.width,
              zIndex: 2,
            }}
          >
            <AppointmentCard appointment={apt} />
          </Box>
        );
      })}
    </Box>
  </Box>
);

export default ScheduleTimeGrid;
