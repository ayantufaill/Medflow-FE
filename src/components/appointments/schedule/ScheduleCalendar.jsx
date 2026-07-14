import { Box } from '@mui/material';
import OperatoryHeaders from './OperatoryHeaders';
import WeekHeaders from './WeekHeaders';
import ScheduleTimeGrid from './ScheduleTimeGrid';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';
import { useDropdownData, useScheduleState } from '../../../hooks/redux';

const ScheduleCalendar = ({ onSlotClick, onBlockClick, scheduleBlocks, privacyMode }) => {
  const { rooms } = useDropdownData({ rooms: true });
  const { calendarView, selectedDate } = useScheduleState();

  const isWeek = calendarView === 'week';
  const columnCount = isWeek ? 7 : (rooms.length || 1);
  const totalGridWidth = TIME_LABEL_WIDTH + columnCount * COLUMN_MIN_WIDTH;

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      <Box sx={{ minWidth: totalGridWidth }}>
        {isWeek ? <WeekHeaders selectedDate={selectedDate} /> : <OperatoryHeaders />}
        <ScheduleTimeGrid 
          onSlotClick={onSlotClick} 
          onBlockClick={onBlockClick} 
          scheduleBlocks={scheduleBlocks} 
          privacyMode={privacyMode} 
          calendarView={calendarView}
          selectedDate={selectedDate}
        />
      </Box>
    </Box>
  );
};

export default ScheduleCalendar;
