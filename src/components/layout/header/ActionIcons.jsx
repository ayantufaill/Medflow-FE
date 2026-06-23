import { Box } from '@mui/material';
import { NotificationsNone, Settings } from '@mui/icons-material';

const iconStyle = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
};

const ActionIcons = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Box sx={{ ...iconStyle, position: 'relative' }}>
      <NotificationsNone sx={{ fontSize: '18px', color: '#4a5568' }} />
      <Box
        sx={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '7px',
          height: '7px',
          backgroundColor: '#ef4444',
          borderRadius: '50%',
        }}
      />
    </Box>

    <Box sx={iconStyle}>
      <Settings sx={{ fontSize: '18px', color: '#4a5568' }} />
    </Box>
  </Box>
);

export default ActionIcons;
