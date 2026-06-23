import { Box } from '@mui/material';
import OperatoryHeaders from './OperatoryHeaders';
import ScheduleTimeGrid from './ScheduleTimeGrid';

const ScheduleCalendar = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
    <OperatoryHeaders />
    <ScheduleTimeGrid />
  </Box>
);

export default ScheduleCalendar;
