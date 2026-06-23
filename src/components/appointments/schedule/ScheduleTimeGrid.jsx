import { Box, Typography } from '@mui/material';
import { OPERATORIES, HOURS, HOUR_HEIGHT, TIME_LABEL_WIDTH, formatHour } from './scheduleConstants';

const ScheduleTimeGrid = () => (
  <Box sx={{ flex: 1, overflowY: 'auto' }}>
    {HOURS.map((hour) => (
      <Box
        key={hour}
        sx={{
          display: 'flex',
          height: `${HOUR_HEIGHT}px`,
          borderBottom: '1px solid #f0f2f5',
          position: 'relative',
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
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '11px',
              fontWeight: 500,
              color: '#9aa3ae',
              whiteSpace: 'nowrap',
            }}
          >
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
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(34, 98, 239, 0.02)' },
              // 30-min dashed line at midpoint
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
  </Box>
);

export default ScheduleTimeGrid;
