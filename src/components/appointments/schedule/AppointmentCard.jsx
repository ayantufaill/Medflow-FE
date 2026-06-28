import { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Phone, OpenInNew, Add, Description, AttachMoney,
  FiberManualRecord, MedicalServices, Tune,
} from '@mui/icons-material';
import AppointmentHoverCard from './AppointmentHoverCard';

const STATUS_CONFIG = {
  PRECONFIRMED: { bg: '#7c3aed' },
  UNCONFIRMED:  { bg: '#d97706' },
  CONFIRMED:    { bg: '#059669' },
};

const TAG_STYLE = (tag) => {
  if (tag === 'EXM')  return { bg: '#7c3aed', color: '#fff',    border: 'none' };
  if (tag === 'Xray') return { bg: '#1f2937', color: '#fff',    border: 'none' };
  return                     { bg: '#ffffff',  color: '#374151', border: '1px solid #d1d5db' };
};

const BlockCard = ({ title }) => (
  <Box
    sx={{
      height: '70%',
      border: '1.5px dashed #90caf9',
      borderRadius: '6px',
      backgroundColor: '#eef4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: '8px',
    }}
  >
    <Typography sx={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 500, color: '#2262ef' }}>
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
          height: '70%',
          borderRadius: '8px',
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
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '8px', color: '#fff', letterSpacing: '0.5px' }}>
              {appointment.patientName}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '8px', color: '#fff' }}>
              {appointment.time}
            </Typography>
          </Box>

          {/* Status stripe */}
          <Box
            sx={{
              backgroundColor: statusCfg.bg,
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.18) 3px, rgba(255,255,255,0.18) 6px)',
              py: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 700, color: '#fff', letterSpacing: '0.7px' }}>
              {appointment.status}
            </Typography>
          </Box>

          {/* Body */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#ffffff',
              px: '8px',
              py: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden',
            }}
          >
            {/* Procedures + inline action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap' }}>
                {appointment.procedures}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                <FiberManualRecord sx={{ fontSize: '11px', color: '#2262ef' }} />
                <Add sx={{ fontSize: '8px', color: '#ef4444' }} />
                <Description sx={{ fontSize: '8px', color: '#2262ef' }} />
                <AttachMoney sx={{ fontSize: '8px', color: '#2262ef' }} />
                <Typography sx={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 700, color: '#2262ef' }}>Tx</Typography>
                <MedicalServices sx={{ fontSize: '11px', color: '#2262ef' }} />
              </Box>
            </Box>

            {/* Description */}
            <Typography sx={{ fontFamily: 'Inter', fontSize: '8px', color: '#374151', lineHeight: 1.4 }}>
              {appointment.description}
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {appointment.tags.map((tag, i) => {
                const { bg, color, border } = TAG_STYLE(tag);
                return (
                  <Box key={i} sx={{ px: '7px', py: '2px', borderRadius: '4px', backgroundColor: bg, border }}>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 700, color }}>
                      {tag}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
              {/* Price pill */}
              <Box sx={{ backgroundColor: '#dcfce7', borderRadius: '20px', px: '8px', py: '2px' }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>
                  {appointment.price}
                </Typography>
              </Box>

              {/* Footer icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiberManualRecord sx={{ fontSize: '12px', color: '#06b6d4' }} />
                <Tune sx={{ fontSize: '12px', color: '#d97706' }} />
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e5eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '8px', fontWeight: 700, color: '#5c646f' }}>SS</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Right icon strip ── */}
        <Box
          sx={{
            width: '28px',
            backgroundColor: '#dbeeff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: '8px',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <Phone sx={{ fontSize: '14px', color: '#2262ef' }} />
          <OpenInNew sx={{ fontSize: '13px', color: '#2262ef' }} />
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
