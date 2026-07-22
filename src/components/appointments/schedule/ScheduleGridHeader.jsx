import { Box } from '@mui/material';
import dayjs from 'dayjs';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';
import { useScheduleState } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';

// ScheduleGridHeader owns the top toolbar: view-toggle, date navigation, and
// the new-appointment button. Calendar view and selected date are lifted into
// Redux (useScheduleState) so ScheduleTimeGrid responds to the same state
// without prop-drilling through the page component.

const ScheduleGridHeader = ({ onNewAppointment, onPrintClick, onMoreClick, privacyMode, setPrivacyMode, hideBlocks, setHideBlocks }) => {
  const { calendarView, selectedDate, setCalendarView, setSelectedDate } = useScheduleState();

  // Redux stores selectedDate as an ISO string; DateNavigation expects a dayjs object.
  const dayjsDate = dayjs(selectedDate);

  // ViewToggle emits title-case ('Day'/'Week'/'Month') but Redux keeps lowercase.
  // Convert at both boundaries to avoid spreading the format discrepancy.
  const viewLabel = calendarView.charAt(0).toUpperCase() + calendarView.slice(1);

  const handleViewChange = (newLabel) => setCalendarView(newLabel.toLowerCase());

  // Step forward/back by exactly one unit of the current view.
  const handlePrev = () => setSelectedDate(dayjsDate.subtract(1, calendarView).toISOString());
  const handleNext = () => setSelectedDate(dayjsDate.add(1, calendarView).toISOString());

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
        <DateNavigation
          date={dayjsDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onDateSelect={(newDate) => setSelectedDate(newDate.toISOString())}
        />

        {/* Flexible space to push icons and button to the right side if needed, or simply let ActionIconsBar handle alignment */}
        <Box sx={{ flex: 1 }} />
        
        <ActionIconsBar onPrintClick={onPrintClick} onMoreClick={onMoreClick} privacyMode={privacyMode} onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)} hideBlocks={hideBlocks} onToggleHideBlocks={() => setHideBlocks(!hideBlocks)} />
        <VerticalDivider height="36px" />
        <NewAppointmentButton onClick={onNewAppointment} />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
