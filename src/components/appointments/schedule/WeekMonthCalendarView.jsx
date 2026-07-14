import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';

const WeekMonthCalendarView = ({ 
  calendarView, 
  selectedDate, 
  appointments, 
  onSlotClick 
}) => {
  const isMonth = calendarView === 'month';

  // Generate grid days
  const gridDays = useMemo(() => {
    const days = [];
    const baseDate = dayjs(selectedDate);
    
    if (isMonth) {
      const startOfMonth = baseDate.startOf('month');
      const endOfMonth = baseDate.endOf('month');
      
      let current = startOfMonth.startOf('week');
      const end = endOfMonth.endOf('week');
      
      while (current.isBefore(end) || current.isSame(end, 'day')) {
        days.push(current);
        current = current.add(1, 'day');
      }
    } else {
      let current = baseDate.startOf('week');
      for (let i = 0; i < 7; i++) {
        days.push(current);
        current = current.add(1, 'day');
      }
    }
    return days;
  }, [selectedDate, isMonth]);

  // Group appointments by date string (YYYY-MM-DD)
  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    appointments.forEach(apt => {
      const startObj = dayjs(apt.start || apt.appointmentDate);
      if (startObj.isValid()) {
        const dateStr = startObj.format('YYYY-MM-DD');
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(apt);
      }
    });
    
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
    });
    
    return grouped;
  }, [appointments]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff', border: `1px solid ${COLORS.BORDER || '#e0e5eb'}`, overflow: 'auto' }}>
      <Box sx={{ display: 'flex', borderBottom: `1px solid ${COLORS.BORDER || '#e0e5eb'}`, backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 2 }}>
        {daysOfWeek.map(day => (
          <Box key={day} sx={{ flex: 1, py: 1, textAlign: 'center', borderRight: `1px solid ${COLORS.BORDER || '#e0e5eb'}`, '&:last-child': { borderRight: 'none' } }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1, alignContent: 'flex-start' }}>
        {gridDays.map((dateObj, idx) => {
          const dateStr = dateObj.format('YYYY-MM-DD');
          const dayAppointments = appointmentsByDate[dateStr] || [];
          const isCurrentMonth = dateObj.month() === dayjs(selectedDate).month();
          const isToday = dateObj.isSame(dayjs(), 'day');

          return (
            <Box 
              key={dateStr}
              sx={{ 
                width: '14.285%',
                minHeight: isMonth ? '120px' : 'calc(100vh - 200px)',
                borderRight: (idx + 1) % 7 !== 0 ? `1px solid ${COLORS.BORDER || '#e0e5eb'}` : 'none',
                borderBottom: `1px solid ${COLORS.BORDER || '#e0e5eb'}`,
                p: 1,
                backgroundColor: !isMonth || isCurrentMonth ? '#ffffff' : '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <Typography 
                sx={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? '#2563eb' : (isCurrentMonth || !isMonth ? '#1f2937' : '#9ca3af'),
                  mb: 1
                }}
              >
                {dateObj.format('D')}
              </Typography>
              
              {dayAppointments.map(apt => (
                <Box 
                  key={apt.id}
                  onClick={() => onSlotClick && onSlotClick({ detail: apt })}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '6px', 
                      height: '6px', 
                      backgroundColor: apt.color || '#3b82f6', 
                      flexShrink: 0 
                    }} 
                  />
                  <Typography 
                    noWrap
                    sx={{ 
                      fontFamily: 'Inter', 
                      fontSize: '11px', 
                      color: '#4b5563',
                      lineHeight: 1.2
                    }}
                  >
                    {dayjs(apt.start || apt.appointmentDate + 'T' + apt.startTime).format('h:mma').replace(':00', '')} {apt.patientName}
                  </Typography>
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekMonthCalendarView;
