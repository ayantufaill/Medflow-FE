import { Box, Typography } from '@mui/material';
import { ChatBubbleOutline, CheckCircleOutline, Phone, MapsUgc } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';

const MESSAGE_ROWS = [
  { title: 'Recare reminders', sub: '34 delivered today', icon: <ChatBubbleOutline sx={{ fontSize: '18px', color: '#9aa3ae' }} /> },
  { title: 'Confirmations',    sub: '12 received',        icon: <CheckCircleOutline sx={{ fontSize: '18px', color: '#9aa3ae' }} /> },
  { title: 'Voicemails',       sub: '6 transcribed',      icon: <Phone sx={{ fontSize: '18px', color: '#9aa3ae' }} /> },
];

const Messages = () => (
  <RightPanelCard
    icon={<MapsUgc sx={{ fontSize: '20px', color: '#2262ef' }} />}
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
          borderBottom: '1px solid #f5f7fa',
          '&:last-child': { borderBottom: 'none' },
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            width: '36px', height: '36px',
            backgroundColor: '#f3f8fd',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#09121f' }}>
            {title}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#09121f' }}>
            {sub}
          </Typography>
        </Box>
      </Box>
    ))}
  </RightPanelCard>
);

export default Messages;
