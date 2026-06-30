import { Box, Typography, Divider } from '@mui/material';
import {
  PhoneOutlined, EmailOutlined, AccessTimeOutlined, ContentCopyOutlined,
  CalendarMonthOutlined, PendingOutlined, Autorenew,
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, avatarSize } from '../../../constants/styles';

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

const ContactRow = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <Box sx={{ color: COLORS.TEXT_MUTED, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{text}</Typography>
    <ContentCopyOutlined sx={{ fontSize: '13px', color: COLORS.ACCENT, cursor: 'pointer', flexShrink: 0 }} />
  </Box>
);

const PatientCard = () => (
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
    {/* Header — avatar + name + menu */}
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
        <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xl, color: COLORS.WHITE }}>AT</Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xl, color: COLORS.TEXT_PRIMARY }}>
          Ali Tariq
        </Typography>
        <Box sx={{ display: 'flex', gap: '4px' }}>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>43 ·</Typography>
          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>#PAT007</Typography>
        </Box>
      </Box>

      {/* 6-dot menu */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 4px)', gap: '3px', cursor: 'pointer', mt: '2px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: COLORS.TEXT_MUTED }} />
        ))}
      </Box>
    </Box>

    {/* Contact info + Hx badge */}
    <Box sx={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <ContactRow icon={<PhoneOutlined sx={{ fontSize: '14px' }} />} text="+1 (855) 849-5255" />
        <ContactRow icon={<EmailOutlined sx={{ fontSize: '14px' }} />} text="jaylen@oryxdental.com" />
        <ContactRow icon={<AccessTimeOutlined sx={{ fontSize: '14px' }} />} text="DOB: 10/12/1982" />
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
        <Autorenew sx={{ fontSize: '38px', color: COLORS.STATUS_WARNING, position: 'absolute' }} />
        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.STATUS_WARNING, position: 'relative', zIndex: 1 }}>
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
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#854d0e' }}>+</Typography>
      </Box>
    </Box>

    {/* Tags row */}
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

      {/* MH avatar */}
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

    {/* Divider separating patient card from actions */}
    <Divider sx={{ borderColor: COLORS.BORDER, my: '6px' }} />

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
            backgroundColor: COLORS.SURFACE_CARD,
            border: `1px solid ${COLORS.BORDER}`,
            borderRadius: radius.md,
            cursor: 'pointer',
            position: 'relative',
            '&:hover': { backgroundColor: COLORS.SURFACE_INPUT },
          }}
        >
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

export default PatientCard;
