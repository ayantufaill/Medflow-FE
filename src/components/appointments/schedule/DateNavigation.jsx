import { Box, Typography, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const DateNavigation = ({ date, onPrev, onNext }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
    <IconButton onClick={onPrev} sx={{ color: '#5c646f', p: '3px' }}>
      <KeyboardArrowLeft sx={{ fontSize: '16px' }} />
    </IconButton>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: '12px',
        color: '#09121f',
        whiteSpace: 'nowrap',
      }}
    >
      {date.format('dddd, MMMM D, YYYY')}
    </Typography>
    <IconButton onClick={onNext} sx={{ color: '#5c646f', p: '3px' }}>
      <KeyboardArrowRight sx={{ fontSize: '16px' }} />
    </IconButton>
  </Box>
);

export default DateNavigation;
