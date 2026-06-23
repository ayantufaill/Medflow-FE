import { Box } from '@mui/material';
import Header from './Header';

const ScheduleLayout = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
    <Header />
    <Box sx={{ flex: 1 }}>
      {children}
    </Box>
  </Box>
);

export default ScheduleLayout;
