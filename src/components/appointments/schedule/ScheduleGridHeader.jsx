import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Person } from '@mui/icons-material';
import dayjs from 'dayjs';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';

const ScheduleGridHeader = ({ onNewAppointment, onOpenPatientSlider }) => {
  const [view, setView] = useState('Day');
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #e0e5eb',
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

        {/* Patient slider trigger */}
        <Box
          onClick={onOpenPatientSlider}
          sx={{
            display: "flex", alignItems: "center", gap: "5px",
            border: "1px solid #e0e5eb", borderRadius: "8px",
            px: "10px", py: "5px", cursor: "pointer",
            backgroundColor: "#f8fafc",
            "&:hover": { backgroundColor: "#f1f5f9", borderColor: "#c8d0d9" },
            flexShrink: 0,
          }}
        >
          <Person sx={{ fontSize: "14px", color: "#5c646f" }} />
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151" }}>
            Open Patient slider
          </Typography>
        </Box>

        <VerticalDivider height="36px" />
        <NewAppointmentButton onClick={onNewAppointment} />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
