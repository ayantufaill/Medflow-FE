import { Box, Typography } from '@mui/material';
import { ChatBubbleOutline, CheckCircleOutline, Phone, MapsUgc } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, avatarSize } from '../../../constants/styles';

const MESSAGE_ROWS = [
  { title: 'Recare reminders', sub: '34 delivered today', icon: <ChatBubbleOutline sx={{ fontSize: '18px', color: COLORS.TEXT_MUTED }} /> },
  { title: 'Confirmations',    sub: '12 received',        icon: <CheckCircleOutline sx={{ fontSize: '18px', color: COLORS.TEXT_MUTED }} /> },
  { title: 'Voicemails',       sub: '6 transcribed',      icon: <Phone sx={{ fontSize: '18px', color: COLORS.TEXT_MUTED }} /> },
];

const Messages = () => (
  <RightPanelCard
    icon={<MapsUgc sx={{ fontSize: '20px', color: COLORS.ACCENT }} />}
    title="Messages"
    count={4}
    headerAction="plus"
  >
    {MESSAGE_ROWS.map(({ title, sub, icon }) => (
      <Box
        key={title}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          py: '9px',
          borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
          '&:last-child': { borderBottom: 'none' },
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            width: avatarSize.md, height: avatarSize.md,
            backgroundColor: COLORS.SURFACE_TINT,
            borderRadius: radius.md,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>
            {sub}
          </Typography>
        </Box>
      </Box>
    ))}
  </RightPanelCard>
);

export default Messages;
