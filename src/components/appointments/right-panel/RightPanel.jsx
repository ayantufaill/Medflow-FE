import { Box } from '@mui/material';
import AppointmentShortlist from './AppointmentShortlist';
import TaskList from './TaskList';
import Messages from './Messages';

const RightPanel = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: '8px',
    }}
  >
    <AppointmentShortlist />
    <TaskList />
    <Messages />
  </Box>
);

export default RightPanel;
