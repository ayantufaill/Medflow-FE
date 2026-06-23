import { Box } from '@mui/material';
import { useState } from 'react';
import dayjs from 'dayjs';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';

const ScheduleGridHeader = () => {
  const [view, setView] = useState('Day');
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '60px',
        padding: '0px',
        borderBottom: '1px solid #e0e5eb',
        flexShrink: 0,
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: '72px',
          px: '12px',
          gap: '8px',
        }}
      >
        <ViewToggle value={view} onChange={setView} />
        <DateNavigation
          date={currentDate}
          onPrev={() => setCurrentDate((d) => d.subtract(1, 'day'))}
          onNext={() => setCurrentDate((d) => d.add(1, 'day'))}
        />
        <Box sx={{ flexGrow: 1 }} />
        <ActionIconsBar />
        <VerticalDivider height="36px" />
        <NewAppointmentButton />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
