import { Box } from '@mui/material';
import OperatoryHeaders from './OperatoryHeaders';
import ScheduleTimeGrid from './ScheduleTimeGrid';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';
import { useDropdownData } from '../../../hooks/redux';

// ScheduleCalendar owns the horizontally-scrollable calendar area.
// It derives the minimum scroll-width from the live room count so both the
// sticky header row and the time grid always share the same column widths.

const ScheduleCalendar = ({ onSlotClick, onBlockClick, scheduleBlocks, privacyMode }) => {
  // rooms is cached by useDropdownData — no extra API call (OperatoryHeaders
  // and ScheduleTimeGrid also call this hook and share the same Redux state).
  const { rooms } = useDropdownData({ rooms: true });

  // At least one column wide while rooms are loading (prevents layout jump).
  const totalGridWidth = TIME_LABEL_WIDTH + (rooms.length || 1) * COLUMN_MIN_WIDTH;

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Min-width wrapper ensures header and grid scroll together horizontally */}
      <Box sx={{ minWidth: totalGridWidth }}>
        <OperatoryHeaders />
        <ScheduleTimeGrid onSlotClick={onSlotClick} onBlockClick={onBlockClick} scheduleBlocks={scheduleBlocks} privacyMode={privacyMode} />
      </Box>
    </Box>
  );
};

export default ScheduleCalendar;
