import { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Phone, OpenInNew, Add, Description, AttachMoney,
  FiberManualRecord, MedicalServices, Tune, AcUnit,
  AssignmentOutlined, AltRoute, PhoneOutlined
} from '@mui/icons-material';
import AppointmentHoverCard from './AppointmentHoverCard';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import ToothSvg from '../../../assets/operatory icons/Vector (2).svg';

const STATUS_CONFIG = {
  PRECONFIRMED: { bg: COLORS.STATUS_PRECONFIRMED },
  UNCONFIRMED:  { bg: COLORS.STATUS_UNCONFIRMED },
  CONFIRMED:    { bg: COLORS.STATUS_CONFIRMED },
};

const TAG_STYLE = (tag) => {
  if (tag === 'EXM')  return { bg: '#8b5cf6', color: COLORS.WHITE, border: 'none' };
  if (tag === 'Xray') return { bg: '#1f2937', color: COLORS.WHITE, border: 'none' };
  return                     { bg: COLORS.WHITE, color: '#374151', border: `1px solid #d1d5db` };
};

const TagCircle = ({ icon, bg }) => (
  <Box sx={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {icon}
  </Box>
);

const BlockCard = ({ title }) => (
  <Box
    sx={{
      height: '70%',
      border: '1.5px dashed #90caf9',
      borderRadius: radius.sm,
      backgroundColor: '#eef4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: '8px',
    }}
  >
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: COLORS.ACCENT }}>
      {title}
    </Typography>
  </Box>
);

const AppointmentCard = ({ appointment }) => {
  const cardRef = useRef(null);
  const leaveTimer = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    if (cardRef.current) setAnchorRect(cardRef.current.getBoundingClientRect());
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setAnchorRect(null), 200);
  };

  if (appointment.type === 'block') return <BlockCard title={appointment.title} />;

  const statusCfg = STATUS_CONFIG[appointment.status] ?? STATUS_CONFIG.CONFIRMED;

  return (
    <>
      <Box
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          height: '100%',
          borderRadius: radius.md,
          overflow: 'hidden',
          boxShadow: '0px 2px 10px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'row',
          cursor: 'pointer',
        }}
      >
        {/* ── Main content column ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Header */}
          <Box
            sx={{
              backgroundColor: appointment.headerColor,
              px: '8px',
              py: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xs, color: COLORS.WHITE, letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {appointment.patientName}
            </Typography>
            <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.xs, color: COLORS.WHITE }}>
              {appointment.time}
            </Typography>
          </Box>

          {/* Status stripe */}
          <Box
            sx={{
              backgroundColor: statusCfg.bg,
              py: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.WHITE, letterSpacing: '0.7px' }}>
              {appointment.status}
            </Typography>
          </Box>

          {/* Body */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: COLORS.WHITE,
              px: '8px',
              py: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden',
            }}
          >
            {/* Procedures + inline action icons */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '4px' }}>
              <Typography 
                sx={{ 
                  fontSize: fontSize.base, 
                  fontWeight: fontWeight.medium, 
                  color: '#111827',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.2
                }}
              >
                {appointment.procedures}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, mt: '2px' }}>
                <FiberManualRecord sx={{ fontSize: '11px', color: COLORS.ACCENT }} />
                <Add sx={{ fontSize: fontSize.xs, color: COLORS.STATUS_ERROR }} />
                <Description sx={{ fontSize: fontSize.xs, color: COLORS.ACCENT }} />
                <AttachMoney sx={{ fontSize: fontSize.xs, color: COLORS.ACCENT }} />
                <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.ACCENT }}>Tx</Typography>
                <Typography sx={{ fontSize: '12px', lineHeight: 1 }}>🦷</Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography 
              sx={{ 
                fontSize: fontSize.xs, 
                color: COLORS.TEXT_BODY, 
                lineHeight: 1.4,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {appointment.description}
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', mt: 1 }}>
              {appointment.tags.map((tag, i) => {
                const { bg, color, border } = TAG_STYLE(tag);
                return (
                  <Box key={i} sx={{ px: '8px', py: '2px', borderRadius: '4px', backgroundColor: bg, border }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.3px' }}>
                      {tag}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
              {/* Price pill */}
              <Box sx={{ backgroundColor: '#dcfce7', borderRadius: '20px', px: '8px', py: '3px' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>
                  {appointment.price}
                </Typography>
              </Box>

              {/* Footer icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#0d9488', fontSize: '18px', fontWeight: 800, lineHeight: 1, pt: '5px' }}>*</Typography>
                </Box>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AltRoute sx={{ color: '#f97316', fontSize: '14px', transform: 'rotate(90deg)' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Right icon strip ── */}
        <Box
          sx={{
            width: '28px',
            backgroundColor: '#dbeafe',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: '8px',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <PhoneOutlined sx={{ fontSize: '14px', color: '#2563eb' }} />
          <OpenInNew sx={{ fontSize: '14px', color: '#2563eb' }} />
          
          {/* SS moved to bottom */}
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', mt: 'auto', mb: '8px' }}>
            SS
          </Typography>
        </Box>
      </Box>

      {anchorRect && (
        <AppointmentHoverCard
          appointment={appointment}
          anchorRect={anchorRect}
          onMouseEnter={() => clearTimeout(leaveTimer.current)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default AppointmentCard;