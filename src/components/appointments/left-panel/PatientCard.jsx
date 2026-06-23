import { Box, Typography, Divider } from '@mui/material';
import {
  Phone, Email, AccessTime, ContentCopy,
  CalendarMonth, Forum, Autorenew,
} from '@mui/icons-material';

const TAGS = [
  { label: 'H', color: '#6b7280' },
  { label: 'P', color: '#16a34a' },
  { label: 'B', color: '#ea580c' },
  { label: 'F', color: '#22c55e' },
  { label: 'D', color: '#d97706' },
];

const ACTION_BUTTONS = [
  { label: 'Call',    icon: <Phone sx={{ fontSize: '18px', color: '#2262ef' }} />,         dot: false },
  { label: 'Email',   icon: <Email sx={{ fontSize: '18px', color: '#2262ef' }} />,          dot: true  },
  { label: 'Book',    icon: <CalendarMonth sx={{ fontSize: '18px', color: '#2262ef' }} />,  dot: false },
  { label: 'Jump to', icon: <Forum sx={{ fontSize: '18px', color: '#2262ef' }} />,          dot: false },
];

const ContactRow = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <Box sx={{ color: '#9aa3ae', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#374151' }}>{text}</Typography>
    <ContentCopy sx={{ fontSize: '13px', color: '#2262ef', cursor: 'pointer', flexShrink: 0 }} />
  </Box>
);

const PatientCard = () => (
  <Box
    sx={{
      backgroundColor: '#ffffff',
      border: '1px solid #e0e5eb',
      borderRadius: '10px',
      p: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}
  >
    {/* Header — avatar + name + menu */}
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <Box
        sx={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          backgroundColor: '#2262ef',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', color: '#fff' }}>AT</Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', color: '#09121f' }}>
          Ali Tariq
        </Typography>
        <Box sx={{ display: 'flex', gap: '4px' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#5c646f' }}>43 ·</Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#09121f' }}>#PAT007</Typography>
        </Box>
      </Box>

      {/* 6-dot menu */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 4px)', gap: '3px', cursor: 'pointer', mt: '2px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#9aa3ae' }} />
        ))}
      </Box>
    </Box>

    {/* Contact info + Hx badge */}
    <Box sx={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <ContactRow icon={<Phone sx={{ fontSize: '14px' }} />} text="+1 (855) 849-5255" />
        <ContactRow icon={<Email sx={{ fontSize: '14px' }} />} text="jaylen@oryxdental.com" />
        <ContactRow icon={<AccessTime sx={{ fontSize: '14px' }} />} text="DOB: 10/12/1982" />
      </Box>

      {/* Hx badge — Autorenew arrows with "Hx" overlaid */}
      <Box
        sx={{
          position: 'relative',
          width: '38px', height: '38px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          mt: '2px',
        }}
      >
        <Autorenew sx={{ fontSize: '38px', color: '#ea580c', position: 'absolute' }} />
        <Typography sx={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, color: '#ea580c', position: 'relative', zIndex: 1 }}>
          Hx
        </Typography>
      </Box>
    </Box>

    {/* Medical alert badge */}
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: '22px', height: '22px',
          backgroundColor: '#fef08a',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #fde047',
        }}
      >
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>+</Typography>
      </Box>
    </Box>

    {/* Tags row */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: '5px' }}>
        {TAGS.map(({ label, color }) => (
          <Box
            key={label}
            sx={{
              width: '26px', height: '26px',
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* MH avatar */}
      <Box
        sx={{
          width: '26px', height: '26px',
          borderRadius: '50%',
          backgroundColor: '#9aa3ae',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 700, color: '#fff' }}>MH</Typography>
      </Box>
    </Box>

    {/* Divider separating patient card from actions */}
    <Divider sx={{ borderColor: '#e0e5eb', my: '6px' }} />

    {/* Action buttons */}
    <Box sx={{ display: 'flex', gap: '6px' }}>
      {ACTION_BUTTONS.map(({ label, icon, dot }) => (
        <Box
          key={label}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            py: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e5eb',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': { backgroundColor: '#f5f7fa' },
          }}
        >
          {dot && (
            <Box
              sx={{
                position: 'absolute', top: '6px', right: '10px',
                width: '7px', height: '7px',
                borderRadius: '50%', backgroundColor: '#ef4444',
              }}
            />
          )}
          {icon}
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 500, color: '#374151' }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default PatientCard;
