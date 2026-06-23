import { Box } from '@mui/material';
import ScheduleGridHeader from '../../components/appointments/schedule/ScheduleGridHeader';
import ScheduleCalendar from '../../components/appointments/schedule/ScheduleCalendar';
import LeftPanel from '../../components/appointments/left-panel/LeftPanel';

const OperatorySchedulePage = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', gap: '8px', p: '8px', backgroundColor: '#f0f2f5' }}>

      {/* LEFT PANEL — 20% */}
      <Box sx={{ width: '20%', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e5eb', flexShrink: 0, overflow: 'hidden' }}>
        <LeftPanel />
      </Box>

      {/* CENTER PANEL — 60% */}
      <Box sx={{ width: '60%', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e5eb', flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScheduleGridHeader />
        <ScheduleCalendar />
      </Box>

      {/* RIGHT PANEL — 20% */}
      <Box sx={{ width: '20%', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e5eb', flexShrink: 0, overflow: 'hidden' }}>
      </Box>

    </Box>
  );
};

export default OperatorySchedulePage;
