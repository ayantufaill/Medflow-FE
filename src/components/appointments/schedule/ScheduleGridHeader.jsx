import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import ViewToggle from './ViewToggle';
import DateNavigation from './DateNavigation';
import ActionIconsBar from './ActionIconsBar';
import NewAppointmentButton from './NewAppointmentButton';
import VerticalDivider from '../../common/VerticalDivider';
import { useScheduleState, useBranch } from '../../../hooks/redux';
import {
  clinicNow,
  resolveClinicTimeZone,
  getTimeZoneAbbr,
  isDifferentFromUserTz,
  getUserLocalTimeZone,
  clinicCivilDate,
  clinicCivilDayjs,
  clinicStartOfDayInstant,
} from '../../../utils/dateUtils';
import { COLORS } from '../../../constants/colors';
import { radius, fontSize, fontWeight } from '../../../constants/styles';

// ScheduleGridHeader owns the top toolbar: view-toggle, date navigation, and
// the new-appointment button. Calendar view and selected date are lifted into
// Redux (useScheduleState) so ScheduleTimeGrid responds to the same state
// without prop-drilling through the page component.

const ScheduleGridHeader = ({ onNewAppointment, onPrintClick, onMoreClick, privacyMode, setPrivacyMode, hideBlocks, setHideBlocks, showGhosted, setShowGhosted }) => {
  const { calendarView, selectedDate, setCalendarView, setSelectedDate } = useScheduleState();
  const { currentBranch } = useBranch();
  const clinicTz = resolveClinicTimeZone(currentBranch);
  const tzAbbr = getTimeZoneAbbr(clinicTz);
  const isDiff = isDifferentFromUserTz(clinicTz);
  const userTz = getUserLocalTimeZone();

  const [currentTime, setCurrentTime] = useState(() => clinicNow(clinicTz).format('h:mm A'));

  useEffect(() => {
    const updateTime = () => setCurrentTime(clinicNow(clinicTz).format('h:mm A'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [clinicTz]);

  // Redux stores selectedDate as an ISO string (a real instant); it has to be
  // read in the clinic's zone, otherwise the header shows the host's day.
  const dayjsDate = clinicCivilDayjs(selectedDate, clinicTz);

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
      const dateStr = clinicCivilDate(selectedDate, clinicTz);
      if (prev.length > 0 && prev[0] === dateStr) return prev;
      const updated = [dateStr, ...prev.filter(d => d !== dateStr)].slice(0, 10);
      return updated;
    });
  }, [selectedDate, clinicTz]);

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

        {/* Live Current Time Display - with clinic timezone badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            px: '6px',
            py: '4px',
            flexShrink: 0,
            userSelect: 'none',
          }}
          title={isDiff ? `Clinic time (${clinicTz}). Your local device time is ${userTz}.` : `Clinic time (${clinicTz})`}
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
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: fontWeight.semibold,
              color: COLORS.PRIMARY,
              backgroundColor: 'rgba(34, 98, 239, 0.08)',
              border: '1px solid rgba(34, 98, 239, 0.2)',
              px: '5px',
              py: '1px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
            }}
          >
            {tzAbbr}
          </Typography>
        </Box>
        <DateNavigation
          date={dayjsDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onDateSelect={(newDate) =>
            setSelectedDate(
              clinicStartOfDayInstant(newDate.format('YYYY-MM-DD'), clinicTz).toISOString()
            )
          }
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
          onDateSelect={(dateStr) =>
            setSelectedDate(clinicStartOfDayInstant(dateStr, clinicTz).toISOString())
          }
        />
        <VerticalDivider height="36px" />
        <NewAppointmentButton onClick={onNewAppointment} />
      </Box>
    </Box>
  );
};

export default ScheduleGridHeader;
