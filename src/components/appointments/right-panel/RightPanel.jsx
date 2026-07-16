import { Box } from '@mui/material';
import AppointmentShortlist from './AppointmentShortlist';
import TaskList from './TaskList';
import Messages from './Messages';

const RightPanel = ({ hideAppointmentShortlist = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: '8px',
    }}
  >
    {!hideAppointmentShortlist && <AppointmentShortlist />}
    <TaskList />
    <Messages />
  </Box>
);

export default RightPanel;
