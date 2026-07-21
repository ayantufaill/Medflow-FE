import { Box, Typography } from '@mui/material';

const ScheduleConfigCard = ({ title, subtitle, icon, action, children, sx }) => {
  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', bgcolor: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px 24px', bgcolor: '#F2F6FC', borderBottom: '0.67px solid #e0e0e0', minHeight: '68px' }}>
        {icon && <img src={icon} alt={title} style={{ width: 24, height: 24, marginRight: 16 }} />}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" fontWeight={700} color="#11223F" sx={{ textTransform: 'uppercase', fontSize: '13px', lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Box sx={{ ml: 2 }}>
            {action}
          </Box>
        )}
      </Box>
      {/* Body */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
};

export default ScheduleConfigCard;
