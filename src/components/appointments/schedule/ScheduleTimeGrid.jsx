import { Box, Typography } from '@mui/material';
import {
  OPERATORIES, HOURS, HOUR_HEIGHT, TIME_LABEL_WIDTH,
  COLUMN_MIN_WIDTH, START_HOUR, MOCK_APPOINTMENTS, formatHour,
} from './scheduleConstants';
import AppointmentCard from './AppointmentCard';

const TOTAL_HEIGHT = HOURS.length * HOUR_HEIGHT;
const TOTAL_WIDTH = TIME_LABEL_WIDTH + OPERATORIES.length * COLUMN_MIN_WIDTH;

const getAppointmentPosition = (apt) => {
  const opIndex = OPERATORIES.findIndex((op) => op.id === apt.operatoryId);
  const top = (apt.startHour - START_HOUR) * HOUR_HEIGHT + (apt.startMinute / 60) * HOUR_HEIGHT;
  const height = (apt.durationMinutes / 60) * HOUR_HEIGHT - 4;
  const left = TIME_LABEL_WIDTH + opIndex * COLUMN_MIN_WIDTH + 3;
  const width = COLUMN_MIN_WIDTH - 6;
  return { top: top + 2, height, left, width };
};

const ScheduleTimeGrid = () => (
  <Box sx={{ position: 'relative', height: TOTAL_HEIGHT, width: TOTAL_WIDTH }}>

    {/* Hour rows — grid background */}
    {HOURS.map((hour) => (
      <Box
        key={hour}
        sx={{
          position: 'absolute',
          top: (hour - START_HOUR) * HOUR_HEIGHT,
          left: 0,
          width: TOTAL_WIDTH,
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

        {/* Cells */}
        {OPERATORIES.map((op) => (
          <Box
            key={op.id}
            sx={{
              width: COLUMN_MIN_WIDTH,
              flexShrink: 0,
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

    {/* Appointments */}
    {MOCK_APPOINTMENTS.map((apt) => {
      const pos = getAppointmentPosition(apt);
      return (
        <Box
          key={apt.id}
          sx={{ position: 'absolute', top: pos.top, height: pos.height, left: pos.left, width: pos.width, zIndex: 2 }}
        >
          <AppointmentCard appointment={apt} />
        </Box>
      );
    })}
  </Box>
);

export default ScheduleTimeGrid;
