import { Box, Typography, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const DateNavigation = ({ date, onPrev, onNext }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
    <IconButton size="small" onClick={onPrev} sx={{ color: '#5c646f' }}>
      <KeyboardArrowLeft sx={{ fontSize: '18px' }} />
    </IconButton>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: '12px',
        color: '#09121f',
        whiteSpace: 'nowrap',
        textAlign: 'left'
      }}
    >
      {date.format('dddd, MMMM D, YYYY')}
    </Typography>
    <IconButton size="small" onClick={onNext} sx={{ color: '#5c646f' }}>
      <KeyboardArrowRight sx={{ fontSize: '18px' }} />
    </IconButton>
  </Box>
);

export default DateNavigation;
