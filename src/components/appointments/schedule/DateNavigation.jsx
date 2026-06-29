import { Box, Typography, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

const DateNavigation = ({ date, onPrev, onNext }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
    <IconButton onClick={onPrev} sx={{ color: COLORS.TEXT_SECONDARY, p: '3px' }}>
      <KeyboardArrowLeft sx={{ fontSize: '16px' }} />
    </IconButton>
    <Typography
      sx={{
        fontWeight: fontWeight.medium,
        fontSize: fontSize.base,
        color: COLORS.TEXT_PRIMARY,
        whiteSpace: 'nowrap',
      }}
    >
      {date.format('dddd, MMMM D, YYYY')}
    </Typography>
    <IconButton onClick={onNext} sx={{ color: COLORS.TEXT_SECONDARY, p: '3px' }}>
      <KeyboardArrowRight sx={{ fontSize: '16px' }} />
    </IconButton>
  </Box>
);

export default DateNavigation;
