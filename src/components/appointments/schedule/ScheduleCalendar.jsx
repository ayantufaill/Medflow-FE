import { Box } from '@mui/material';
import OperatoryHeaders from './OperatoryHeaders';
import WeekHeaders from './WeekHeaders';
import ScheduleTimeGrid from './ScheduleTimeGrid';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';
import { useDropdownData, useScheduleState } from '../../../hooks/redux';

const ScheduleCalendar = ({ onSlotClick, onBlockClick, scheduleBlocks, privacyMode, isCloseOpenDayMode, closedOperatories, onToggleOperatoryStatus, viewMyColumn }) => {
  const { rooms: allRooms } = useDropdownData({ rooms: true });
  const { calendarView, selectedDate } = useScheduleState();

  // Currently "View my column" is set to show all columns until backend association is established
  const rooms = allRooms;

  const isWeek = calendarView === 'week';
  const columnCount = isWeek ? 7 : (rooms.length || 1);
  const totalGridWidth = TIME_LABEL_WIDTH + columnCount * COLUMN_MIN_WIDTH;

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      <Box sx={{ minWidth: totalGridWidth }}>
        {isWeek ? <WeekHeaders selectedDate={selectedDate} /> : (
          <OperatoryHeaders 
            rooms={rooms}
            isCloseOpenDayMode={isCloseOpenDayMode}
            closedOperatories={closedOperatories}
            onToggleOperatoryStatus={onToggleOperatoryStatus}
            selectedDate={selectedDate}
          />
        )}
        <ScheduleTimeGrid 
          rooms={rooms}
          onSlotClick={onSlotClick} 
          onBlockClick={onBlockClick} 
          scheduleBlocks={scheduleBlocks} 
          privacyMode={privacyMode} 
          calendarView={calendarView}
          selectedDate={selectedDate}
          isCloseOpenDayMode={isCloseOpenDayMode}
          closedOperatories={closedOperatories}
        />
      </Box>
    </Box>
  );
};

export default ScheduleCalendar;
