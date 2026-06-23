import { Box } from '@mui/material';
import OperatoryHeaders from './OperatoryHeaders';
import ScheduleTimeGrid from './ScheduleTimeGrid';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH, OPERATORIES } from './scheduleConstants';

const TOTAL_WIDTH = TIME_LABEL_WIDTH + OPERATORIES.length * COLUMN_MIN_WIDTH;

const ScheduleCalendar = () => (
  <Box sx={{ flex: 1, overflow: 'auto' }}>
    {/* Min-width wrapper so both header and grid scroll together horizontally */}
    <Box sx={{ minWidth: TOTAL_WIDTH }}>
      <OperatoryHeaders />
      <ScheduleTimeGrid />
    </Box>
  </Box>
);

export default ScheduleCalendar;
