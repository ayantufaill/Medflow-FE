import { useState } from 'react';
import { Box, Typography, Collapse, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { COLORS } from '../../../constants/colors';
import { fontWeight, fontSize } from '../../../constants/styles';
import { useSnackbar } from '../../../contexts/SnackbarContext';

const PRE_APPT_ITEMS = [
  { label: 'Import History' },
  { label: 'Import Record' },
  { label: 'Appt Reminder' },
  { label: 'Verify Insurance Eligibility' },
  { label: 'Premedication Reminder' },
  { label: 'Lab Case Received' },
];

const CHECK_IN_ITEMS = [
  { label: 'Review Records' },
  { label: 'Review & Sign Visit Plan' },
  { label: 'Sign Consent Forms' },
  { label: 'Verify Premed Taken' },
];

const CHECK_OUT_ITEMS = [
  { label: 'Complete & Bill Procedures', link: true },
  { label: 'Purchase Products', link: true },
  { label: 'Share Clinical Reports', link: true },
  { label: 'Prescription' },
  { label: 'Schedule Next Appointment' },
  { label: 'Send Lab Case' },
];

// Single checklist item row
const ChecklistItem = ({ label, status, onSetStatus, link }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '12px',
      py: '6px',
      '&:hover': { backgroundColor: '#f8fafc' },
    }}
  >
    <Typography
      sx={{
        fontSize: '13px',
        color: link ? COLORS.ACCENT : COLORS.TEXT_PRIMARY,
        textDecoration: link ? 'underline' : 'none',
        fontWeight: link ? fontWeight.medium : fontWeight.regular,
      }}
    >
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Typography
        onClick={() => onSetStatus(status === 'na' ? null : 'na')}
        sx={{
          fontSize: '11px',
          color: status === 'na' ? '#000' : COLORS.TEXT_MUTED,
          fontWeight: status === 'na' ? fontWeight.bold : fontWeight.regular,
          cursor: 'pointer',
        }}
      >
        NA
      </Typography>
      <Box
        onClick={() => onSetStatus(status === 'checked' ? null : 'checked')}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {status === 'checked' ? (
          <CheckCircleIcon sx={{ fontSize: '18px', color: '#4ade80' }} />
        ) : (
          <CheckCircleOutlineIcon sx={{ fontSize: '18px', color: '#d1d5db' }} />
        )}
      </Box>
    </Box>
  </Box>
);

// Collapsible checklist section
const ChecklistSection = ({ title, items, state, onSetStatus, open, onToggleOpen }) => {
  const total = items.length;
  // Both 'checked' and 'na' are truthy, so they both count towards 'done'
  const done = items.filter(i => state[i.label]).length;
  const allDone = done === total;

  return (
    <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
      {/* Header row */}
      <Box
        onClick={onToggleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
          py: '8px',
          cursor: 'pointer',
          backgroundColor: '#f8fafc',
          '&:hover': { backgroundColor: '#f1f5f9' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircleIcon sx={{ fontSize: '16px', color: allDone ? '#4ade80' : '#d1d5db' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
            {done}/{total}
          </Typography>
        </Box>
        {open
          ? <KeyboardArrowDownIcon sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          : <KeyboardArrowRightIcon sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
        }
      </Box>

      {/* Collapsible items */}
      <Collapse in={open}>
        {items.map(item => (
          <ChecklistItem
            key={item.label}
            label={item.label}
            status={state[item.label]}
            link={item.link}
            onSetStatus={(val) => onSetStatus(item.label, val)}
          />
        ))}
      </Collapse>
    </Box>
  );
};

// Main AppointmentChecklist component
const AppointmentChecklist = () => {
  const [preApptOpen, setPreApptOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const [preApptState, setPreApptState] = useState({});
  const [checkInState, setCheckInState] = useState({});
  const [checkOutState, setCheckOutState] = useState({});

  const { showSnackbar } = useSnackbar();

  const setStatus = (setState) => (label, value) => {
    setState(prev => ({ ...prev, [label]: value }));
    if (value === 'checked') {
      showSnackbar(`Marked '${label}' as completed`, 'success', { vertical: 'top', horizontal: 'right' });
    } else if (value === 'na') {
      showSnackbar(`Marked '${label}' as N/A`, 'info', { vertical: 'top', horizontal: 'right' });
    }
  };

  const allItems = [
    ...PRE_APPT_ITEMS.map(i => preApptState[i.label]),
    ...CHECK_IN_ITEMS.map(i => checkInState[i.label]),
    ...CHECK_OUT_ITEMS.map(i => checkOutState[i.label]),
  ];
  // Both 'checked' and 'na' are truthy strings, so they count
  const totalDone = allItems.filter(Boolean).length;
  const totalCount = allItems.length;
  const isAllDone = totalDone === totalCount;

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.BORDER_LIGHT}`,
        borderRadius: '10px',
        overflow: 'hidden',
        mt: '8px',
        backgroundColor: COLORS.WHITE,
      }}
    >
      {/* Checklist sections */}
      <ChecklistSection
        title="Pre-appt Checklist"
        items={PRE_APPT_ITEMS}
        state={preApptState}
        onSetStatus={setStatus(setPreApptState)}
        open={preApptOpen}
        onToggleOpen={() => setPreApptOpen(v => !v)}
      />
      <ChecklistSection
        title="Check-in Checklist"
        items={CHECK_IN_ITEMS}
        state={checkInState}
        onSetStatus={setStatus(setCheckInState)}
        open={checkInOpen}
        onToggleOpen={() => setCheckInOpen(v => !v)}
      />
      <ChecklistSection
        title="Check-out Checklist"
        items={CHECK_OUT_ITEMS}
        state={checkOutState}
        onSetStatus={setStatus(setCheckOutState)}
        open={checkOutOpen}
        onToggleOpen={() => setCheckOutOpen(v => !v)}
      />

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '12px',
          py: '8px',
          backgroundColor: '#f8fafc',
        }}
      >
        <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
          {totalDone}/{totalCount} complete
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: fontWeight.semibold,
              color: isAllDone ? '#4ade80' : '#d1d5db',
              cursor: isAllDone ? 'pointer' : 'default',
              pointerEvents: isAllDone ? 'auto' : 'none'
            }}
          >
            All done
          </Typography>
          <Typography
            sx={{ fontSize: '12px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, cursor: 'pointer' }}
            onClick={() => {
              setPreApptState({});
              setCheckInState({});
              setCheckOutState({});
            }}
          >
            Reset
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentChecklist;
