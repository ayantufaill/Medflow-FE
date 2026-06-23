import { Box, Typography } from '@mui/material';
import { Phone, OpenInNew } from '@mui/icons-material';

const STATUS_CONFIG = {
  PRECONFIRMED: { bg: '#7c3aed' },
  UNCONFIRMED:  { bg: '#d97706' },
  CONFIRMED:    { bg: '#059669' },
};

const TAG_STYLE = (tag) => {
  if (tag === 'EXM')  return { bg: '#7c3aed', color: '#fff' };
  if (tag === 'Xray') return { bg: '#1f2937', color: '#fff' };
  return { bg: '#e5e7eb', color: '#374151' };
};

const BlockCard = ({ title }) => (
  <Box
    sx={{
      height: '100%',
      border: '1.5px dashed #90caf9',
      borderRadius: '6px',
      backgroundColor: '#eef4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: '8px',
    }}
  >
    <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#2262ef' }}>
      {title}
    </Typography>
  </Box>
);

const AppointmentCard = ({ appointment }) => {
  if (appointment.type === 'block') return <BlockCard title={appointment.title} />;

  const statusCfg = STATUS_CONFIG[appointment.status] ?? STATUS_CONFIG.CONFIRMED;

  return (
    <Box
      sx={{
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: appointment.headerColor,
          px: '8px',
          py: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: '#fff', letterSpacing: '0.4px' }}>
          {appointment.patientName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#fff' }}>
            {appointment.time}
          </Typography>
          <Phone sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }} />
          <OpenInNew sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }} />
        </Box>
      </Box>

      {/* Status stripe */}
      <Box
        sx={{
          backgroundColor: statusCfg.bg,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.18) 3px, rgba(255,255,255,0.18) 6px)',
          px: '8px',
          py: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '0.6px' }}>
          {appointment.status}
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#dbeeff',
          px: '8px',
          py: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflow: 'hidden',
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, color: '#1a1a1a' }}>
          {appointment.procedures}
        </Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#374151' }}>
          {appointment.description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          {appointment.tags.map((tag, i) => {
            const { bg, color } = TAG_STYLE(tag);
            return (
              <Box key={i} sx={{ px: '5px', py: '1px', borderRadius: '3px', backgroundColor: bg }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 600, color }}>
                  {tag}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>
            {appointment.price}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentCard;
