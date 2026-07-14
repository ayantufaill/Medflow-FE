import { useState } from 'react';
import { Box, Typography, IconButton, Popover } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import dayjs from 'dayjs';

const DateNavigation = ({ date, onPrev, onNext, onDateSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    if (onDateSelect) {
      onDateSelect(newDate);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      <IconButton onClick={onPrev} sx={{ color: COLORS.TEXT_SECONDARY, p: '3px' }}>
        <KeyboardArrowLeft sx={{ fontSize: '16px' }} />
      </IconButton>
      
      <Typography
        onClick={handleClick}
        sx={{
          fontWeight: fontWeight.medium,
          fontSize: fontSize.base,
          color: COLORS.TEXT_PRIMARY,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          px: '8px',
          py: '4px',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        {date.format('dddd, MMMM D, YYYY')}
      </Typography>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ mt: 1 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar 
            value={date} 
            onChange={handleDateChange}
            views={['year', 'month', 'day']}
            sx={{
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: COLORS.ACCENT,
                '&:hover': {
                  backgroundColor: COLORS.ACCENT,
                }
              },
              '& .MuiPickersDay-root.Mui-selected:focus': {
                backgroundColor: COLORS.ACCENT,
              }
            }}
          />
        </LocalizationProvider>
      </Popover>

      <IconButton onClick={onNext} sx={{ color: COLORS.TEXT_SECONDARY, p: '3px' }}>
        <KeyboardArrowRight sx={{ fontSize: '16px' }} />
      </IconButton>
    </Box>
  );
};

export default DateNavigation;
