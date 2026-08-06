import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';
import { useScheduleState } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { radius, fontSize, fontWeight } from '../../../constants/styles';

// ScheduleGridHeader owns the top toolbar: view-toggle, date navigation, and
// the new-appointment button. Calendar view and selected date are lifted into
// Redux (useScheduleState) so ScheduleTimeGrid responds to the same state
// without prop-drilling through the page component.

const ScheduleGridHeader = ({ onNewAppointment, onPrintClick, onMoreClick, privacyMode, setPrivacyMode, hideBlocks, setHideBlocks, showGhosted, setShowGhosted }) => {
  const { calendarView, selectedDate, setCalendarView, setSelectedDate } = useScheduleState();

  const [currentTime, setCurrentTime] = useState(() => dayjs().format('h:mm A'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('h:mm A'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redux stores selectedDate as an ISO string; DateNavigation expects a dayjs object.
  const dayjsDate = dayjs(selectedDate);

  // ViewToggle emits title-case ('Day'/'Week'/'Month') but Redux keeps lowercase.
  // Convert at both boundaries to avoid spreading the format discrepancy.
  const viewLabel = calendarView.charAt(0).toUpperCase() + calendarView.slice(1);

  const handleViewChange = (newLabel) => setCalendarView(newLabel.toLowerCase());

  // Step forward/back by exactly one unit of the current view.
  const handlePrev = () => setSelectedDate(dayjsDate.subtract(1, calendarView).toISOString());
  const handleNext = () => setSelectedDate(dayjsDate.add(1, calendarView).toISOString());

  const [lastViewedDates, setLastViewedDates] = useState([]);

  useEffect(() => {
    setLastViewedDates(prev => {
      const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
      if (prev.length > 0 && prev[0] === dateStr) return prev;
      const updated = [dateStr, ...prev.filter(d => d !== dateStr)].slice(0, 10);
      return updated;
    });
  }, [selectedDate]);

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
        <ViewToggle value={viewLabel} onChange={handleViewChange} />
        
        {/* Live Current Time Display - clean text on background */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            px: '6px',
            py: '4px',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: '15px', color: COLORS.TEXT_SECONDARY }} />
          <Typography
            sx={{
              fontSize: fontSize.base,
              fontWeight: fontWeight.medium,
              color: COLORS.TEXT_PRIMARY,
              whiteSpace: 'nowrap',
              fontFamily: 'Inter',
            }}
          >
            {currentTime}
          </Typography>
        </Box>
        <DateNavigation
          date={dayjsDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onDateSelect={(newDate) => setSelectedDate(newDate.toISOString())}
        />

        {/* Flexible space to push icons and button to the right side if needed, or simply let ActionIconsBar handle alignment */}
        <Box sx={{ flex: 1 }} />
        
        <ActionIconsBar 
          onPrintClick={onPrintClick} 
          onMoreClick={onMoreClick} 
          privacyMode={privacyMode} 
          onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)} 
          hideBlocks={hideBlocks} 
          onToggleHideBlocks={() => setHideBlocks(!hideBlocks)} 
          showGhosted={showGhosted} 
          onToggleShowGhosted={() => setShowGhosted(!showGhosted)}
          lastViewedDates={lastViewedDates}
          onDateSelect={(dateStr) => setSelectedDate(dayjs(dateStr).toISOString())}
        />
        <VerticalDivider height="36px" />
        <NewAppointmentButton onClick={onNewAppointment} />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
