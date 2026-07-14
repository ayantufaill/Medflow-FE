import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

const WeekHeaders = ({ selectedDate }) => {
  const days = [];
  const baseDate = dayjs(selectedDate).startOf('week');
  for (let i = 0; i < 7; i++) {
    days.push(baseDate.add(i, 'day'));
  }

  const today = dayjs();

  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          width: TIME_LABEL_WIDTH,
          minWidth: TIME_LABEL_WIDTH,
          borderRight: `1px solid ${COLORS.BORDER}`,
          backgroundColor: '#f9fafb',
        }}
      />
      {days.map((dateObj, idx) => {
        const isToday = dateObj.isSame(today, 'day');
        return (
          <Box
            key={idx}
            sx={{
              flex: 1,
              minWidth: COLUMN_MIN_WIDTH,
              borderRight: idx < 6 ? `1px solid ${COLORS.BORDER}` : 'none',
              py: '8px',
              textAlign: 'center',
              backgroundColor: isToday ? '#eff6ff' : '#fff',
            }}
          >
            <Typography
              sx={{
                fontSize: fontSize.sm,
                fontWeight: isToday ? fontWeight.bold : fontWeight.semibold,
                color: isToday ? '#2563eb' : COLORS.TEXT_PRIMARY,
              }}
            >
              {dateObj.format('ddd M/D')}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default WeekHeaders;
