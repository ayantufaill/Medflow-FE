import { Box } from '@mui/material';
import { useState } from 'react';
import dayjs from 'dayjs';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';
import { COLORS } from '../../../constants/colors';

const ScheduleGridHeader = ({ onNewAppointment }) => {
  const [view, setView] = useState('Day');
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: `1px solid ${COLORS.BORDER}`,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          px: '10px',
          py: '10px',
          gap: '6px',
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
        <NewAppointmentButton onClick={onNewAppointment} />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
