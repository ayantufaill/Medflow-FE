import { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  PhoneOutlined, EmailOutlined, AccessTimeOutlined, ContentCopyOutlined,
  CalendarMonthOutlined, PendingOutlined, Autorenew,
} from '@mui/icons-material';
import { usePatient } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { Tooltip } from '@mui/material';
import { fontSize, fontWeight, radius, avatarSize } from '../../../constants/styles';

// Patient flag tags shown in the footer row of the card.
// These will eventually be driven by patient.tags or patient.flags from the API.
const TAGS = [
  { label: 'H', color: '#6b7280' },
  { label: 'P', color: COLORS.STATUS_SUCCESS },
  { label: 'B', color: COLORS.STATUS_WARNING },
  { label: 'F', color: '#22c55e' },
  { label: 'D', color: COLORS.STATUS_UNCONFIRMED },
];

const ACTION_BUTTONS = [
  { label: 'Call',    icon: <PhoneOutlined sx={{ fontSize: '18px', color: COLORS.ACCENT }} />,         dot: false },
  { label: 'Email',   icon: <EmailOutlined sx={{ fontSize: '18px', color: COLORS.ACCENT }} />,          dot: true  },
  { label: 'Book',    icon: <CalendarMonthOutlined sx={{ fontSize: '18px', color: COLORS.ACCENT }} />,  dot: false },
  { label: 'Jump to', icon: <PendingOutlined sx={{ fontSize: '18px', color: COLORS.ACCENT }} />,          dot: false },
];

// Renders one contact-info row with an icon, text, and copy button.
const ContactRow = ({ icon, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    const textToCopy = text.replace('DOB: ', '');
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Open tooltip message toast popup on success
      setShowTooltip(true);
      
      // Clear popup context bubble visibility after 1.5 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 1500);
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
      <Box sx={{ color: COLORS.TEXT_MUTED, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {text}
      </Typography>
      
      {/* Wrap copy icon in standard floating tooltip overlay container */}
      <Tooltip 
        title="Copied!" 
        open={showTooltip} 
        placement="top"
        arrow
        slotProps={{
          popper: {
            sx: {
              '& .MuiTooltip-tooltip': {
                fontFamily: 'Inter',
                fontSize: '10px',
                backgroundColor: '#1e293b', // Muted slate look matching app design constants
                px: '8px',
                py: '4px'
              },
              '& .MuiTooltip-arrow': {
                color: '#1e293b'
              }
            }
          }
        }}
      >
        <ContentCopyOutlined 
          onClick={handleCopy} 
          sx={{ fontSize: '13px', color: COLORS.ACCENT, cursor: 'pointer', flexShrink: 0 }} 
        />
      </Tooltip>
    </Box>
  );
};

// PatientCard reads currentPatient from Redux (set by PatientSearch).
// When no patient is selected, it renders nothing — LeftPanel conditionally
// mounts this component only after a patient is selected.

const PatientCard = () => {
  const { currentPatient } = usePatient();
  const navigate = useNavigate();

  // Guard — should not render when no patient is selected (LeftPanel gates it),
  // but defensive early return prevents blank-card flash during Redux hydration.
  if (!currentPatient) return null;

  // Compute derived display values from the patient object.
  const initials = [
    currentPatient.firstName?.[0],
    currentPatient.lastName?.[0],
  ].filter(Boolean).join('').toUpperCase() || '?';

  const fullName   = `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim();
  const age        = currentPatient.dateOfBirth
    ? dayjs().diff(dayjs(currentPatient.dateOfBirth), 'year')
    : null;
  const dobDisplay = currentPatient.dateOfBirth
    ? dayjs(currentPatient.dateOfBirth).format('MM/DD/YYYY')
    : '--';
  const phone      = currentPatient.mobilePhone || currentPatient.phonePrimary || '--';
  const email      = currentPatient.email || '--';
  // Patient number shown as "#PAT007" — use patientNumber field or last 6 chars of ID.
  const patientNo  = currentPatient.patientNumber
    ? `#${currentPatient.patientNumber}`
    : currentPatient._id ? `#${currentPatient._id.slice(-6).toUpperCase()}` : '';

  return (
    <Box
      sx={{
        backgroundColor: COLORS.SURFACE_CARD,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.lg,
        p: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* ── Header: avatar + name + drag handle ─────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Box
          sx={{
            width: avatarSize.lg, height: avatarSize.lg,
            borderRadius: '50%',
            backgroundColor: COLORS.ACCENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xl, color: COLORS.WHITE }}>
            {initials}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xl, color: COLORS.TEXT_PRIMARY }}>
            {fullName}
          </Typography>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            {age !== null && (
              <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                {age} ·
              </Typography>
            )}
            <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              {patientNo}
            </Typography>
          </Box>
        </Box>

        {/* Six-dot drag handle / context menu trigger */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 4px)', gap: '3px', cursor: 'pointer', mt: '2px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: COLORS.TEXT_MUTED }} />
          ))}
        </Box>
      </Box>

      {/* ── Contact info + Hx history indicator ─────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: '6px', alignItems: 'flex-start', minWidth: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
          <ContactRow icon={<PhoneOutlined sx={{ fontSize: '14px' }} />} text={phone} />
          <ContactRow icon={<EmailOutlined sx={{ fontSize: '14px' }} />} text={email} />
          <ContactRow icon={<AccessTimeOutlined sx={{ fontSize: '14px' }} />} text={`DOB: ${dobDisplay}`} />
        </Box>

        {/* Hx badge — "Autorenew" icon overlaid with "Hx" label. Indicates
            that appointment history records exist for this patient. */}
        <Box
          sx={{
            position: 'relative',
            width: '38px', height: '38px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            mt: '2px',
          }}
        >
          <Autorenew sx={{ fontSize: '38px', color: COLORS.STATUS_WARNING, position: 'absolute' }} />
          <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.STATUS_WARNING, position: 'relative', zIndex: 1 }}>
            Hx
          </Typography>
        </Box>
      </Box>

      {/* ── Medical alert badge ──────────────────────────────────────────────── */}
      {/* Shown when the patient has medical alerts — currently a static indicator;
          wire to currentPatient.medicalAlerts when that field is available. */}
      <Box sx={{ display: 'flex' }}>
        <Box
          onClick={() => navigate(`/patients/${currentPatient._id || currentPatient.id}/medical-history`)}
          sx={{
            width: '22px', height: '22px',
            backgroundColor: '#fef08a',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #fde047',
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#854d0e' }}>+</Typography>
        </Box>
      </Box>

      {/* ── Patient flag tags ────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '5px' }}>
          {TAGS.map(({ label, color }) => (
            <Box
              key={label}
              sx={{
                width: avatarSize.sm, height: avatarSize.sm,
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.WHITE }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Provider initials avatar (assigned hygienist/dentist — static for now) */}
        <Box
          sx={{
            width: avatarSize.sm, height: avatarSize.sm,
            borderRadius: '50%',
            backgroundColor: COLORS.TEXT_MUTED,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '9px', fontWeight: fontWeight.bold, color: COLORS.WHITE }}>MH</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: COLORS.BORDER, my: '6px' }} />

      {/* ── Quick-action buttons ─────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: '6px' }}>
        {ACTION_BUTTONS.map(({ label, icon, dot }) => (
          <Box
            key={label}
            onClick={() => {
              if (label === 'Book') {
                window.dispatchEvent(new CustomEvent('open-new-appointment-modal', { detail: { isFromPatientCard: true } }));
              }
            }}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              py: '8px',
              backgroundColor: COLORS.SURFACE_CARD,
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: radius.md,
              cursor: 'pointer',
              position: 'relative',
              '&:hover': { backgroundColor: COLORS.SURFACE_INPUT },
            }}
          >
            {/* Notification dot for Email button */}
            {dot && (
              <Box
                sx={{
                  position: 'absolute', top: '6px', right: '10px',
                  width: '7px', height: '7px',
                  borderRadius: '50%', backgroundColor: COLORS.STATUS_ERROR,
                }}
              />
            )}
            {icon}
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_BODY }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PatientCard;
