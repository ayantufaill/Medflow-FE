import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Switch,
  Paper,
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

const SECTION_HEADER_BG = '#eef4ff';
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const MERIDIEMS = ['AM', 'PM'];

const parseTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((value || '').trim());
  if (!match) return { hour: '09', minute: '00', meridiem: 'AM' };
  return {
    hour: match[1].padStart(2, '0'),
    minute: match[2],
    meridiem: (match[3] || 'AM').toUpperCase(),
  };
};

const formatTime = ({ hour, minute, meridiem }) => `${hour}:${minute} ${meridiem}`;

const timeSelectSx = {
  fontSize: '0.78rem',
  height: 32,
  backgroundColor: '#fff',
  '& .MuiSelect-select': { py: 0.5, px: 1 },
};

const TimeSelector = ({ value, onChange, disabled }) => {
  const parsed = parseTime(value);

  const update = (field, val) => {
    onChange(formatTime({ ...parsed, [field]: val }));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: disabled ? 0.5 : 1 }}>
      <Select
        size="small"
        value={parsed.hour}
        disabled={disabled}
        onChange={(e) => update('hour', e.target.value)}
        sx={{ ...timeSelectSx, minWidth: 52 }}
      >
        {HOURS.map((h) => <MenuItem key={h} value={h} sx={{ fontSize: '0.78rem' }}>{h}</MenuItem>)}
      </Select>
      <Typography variant="caption">:</Typography>
      <Select
        size="small"
        value={parsed.minute}
        disabled={disabled}
        onChange={(e) => update('minute', e.target.value)}
        sx={{ ...timeSelectSx, minWidth: 52 }}
      >
        {MINUTES.map((m) => <MenuItem key={m} value={m} sx={{ fontSize: '0.78rem' }}>{m}</MenuItem>)}
      </Select>
      <Select
        size="small"
        value={parsed.meridiem}
        disabled={disabled}
        onChange={(e) => update('meridiem', e.target.value)}
        sx={{ ...timeSelectSx, minWidth: 58, backgroundColor: disabled ? '#fff' : '#2563eb', color: disabled ? 'inherit' : '#fff' }}
      >
        {MERIDIEMS.map((m) => <MenuItem key={m} value={m} sx={{ fontSize: '0.78rem' }}>{m}</MenuItem>)}
      </Select>
    </Box>
  );
};

const DayRow = ({ day, rowData, section, onTimingChange }) => {
  const closed = !!rowData.closed;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ width: 100 }}>
        <Typography fontWeight={700} fontSize="0.85rem">{day}</Typography>
        <Typography variant="caption" color={closed ? 'text.disabled' : 'success.main'}>
          {closed ? 'Closed' : 'Open'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">From</Typography>
        <TimeSelector
          value={rowData.from}
          disabled={closed}
          onChange={(val) => onTimingChange(section, day, 'from', val)}
        />
        <Typography variant="caption" color="text.secondary">To</Typography>
        <TimeSelector
          value={rowData.to}
          disabled={closed}
          onChange={(val) => onTimingChange(section, day, 'to', val)}
        />
      </Box>

      <Switch
        checked={!closed}
        onChange={(e) => onTimingChange(section, day, 'closed', !e.target.checked)}
        color="success"
      />
    </Box>
  );
};

const OfficeTimingScheduleEditor = ({ days, timings, onTimingChange }) => (
  <Paper
    elevation={0}
    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: '#fff', overflow: 'hidden' }}
  >
    {/* Header strip */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, backgroundColor: SECTION_HEADER_BG }}>
      <ScheduleIcon sx={{ color: '#1d4ed8', fontSize: '1.1rem' }} />
      <Typography fontWeight={700} fontSize="0.9rem">
        Schedule
      </Typography>
    </Box>

    <Box sx={{ px: 2, py: 2 }}>
      <Typography fontWeight={700} fontSize="0.95rem" sx={{ mb: 1 }}>
        Weekday
      </Typography>
      {days.map((day) => (
        <DayRow
          key={day}
          day={day}
          rowData={timings.openingHours[day] || {}}
          section="openingHours"
          onTimingChange={onTimingChange}
        />
      ))}

      <Typography fontWeight={700} fontSize="0.95rem" sx={{ mt: 4, mb: 1 }}>
        Schedule Appointment
      </Typography>
      {days.map((day) => (
        <DayRow
          key={`appt-${day}`}
          day={day}
          rowData={timings.schedulingAppt[day] || {}}
          section="schedulingAppt"
          onTimingChange={onTimingChange}
        />
      ))}
    </Box>
  </Paper>
);

export default OfficeTimingScheduleEditor;