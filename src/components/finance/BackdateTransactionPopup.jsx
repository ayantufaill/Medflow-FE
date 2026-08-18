import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Popover,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const BackdateTransactionPopup = ({ open, anchorEl, onClose, onDone }) => {
  const [date, setDate] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setDate(null);
    }
  }, [open]);

  const handleToday = () => {
    setDate(dayjs());
  };

  const handleClear = () => {
    setDate(null);
  };

  const handleDone = () => {
    try {
      if (date && date.isValid && date.isValid()) {
        onDone(date.format('YYYY-MM-DD'));
      } else if (date && !date.isValid) {
        // If it's a native Date or string
        const formatted = dayjs(date).format('YYYY-MM-DD');
        onDone(formatted);
      } else {
        onDone('');
      }
    } catch (err) {
      console.error(err);
      alert('Error formatting date: ' + err.message);
      onDone('');
    }
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 320,
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          mt: 1,
          border: `1px solid ${COLORS.BORDER}`
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white' }}>
        {/* Header */}
        <Box
          sx={{
            boxSizing: 'border-box',
            px: '20px',
            py: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_TINT,
            m: 0,
            flexShrink: 0,
          }}
        >
          <HistoryOutlinedIcon sx={{ fontSize: '18px', color: COLORS.ACCENT }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
            Backdate Transaction
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY, padding: '2px' }}>
            <CloseIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>

        <Box sx={{ p: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', fontWeight: fontWeight.medium }}>
              Select Date:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 15000 }, disablePortal: true },
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    placeholder: "MM/DD/YYYY",
                    sx: { 
                      '& .MuiInputBase-root': { 
                        fontSize: '13px', 
                        borderRadius: '4px', 
                        height: '36px', 
                        bgcolor: COLORS.SURFACE_TINT, 
                        color: COLORS.TEXT_PRIMARY 
                      }, 
                      '& fieldset': { borderColor: COLORS.BORDER } 
                    } 
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1}>
              <Button 
                size="small" 
                onClick={handleToday}
                sx={{ 
                  textTransform: 'none', 
                  color: COLORS.ACCENT,
                  fontSize: '12px',
                  minWidth: 'auto',
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' }
                }}
              >
                Today
              </Button>
              <Button 
                size="small" 
                onClick={handleClear}
                sx={{ 
                  textTransform: 'none', 
                  color: '#ef4444',
                  fontSize: '12px',
                  minWidth: 'auto',
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.04)' }
                }}
              >
                Clear
              </Button>
            </Stack>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleDone}
              sx={{ 
                textTransform: 'none', 
                bgcolor: COLORS.ACCENT,
                color: COLORS.WHITE,
                fontSize: '12px',
                fontWeight: fontWeight.medium,
                borderRadius: radius.sm,
                px: 2,
                height: '30px',
                boxShadow: 'none',
                '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
};

export default BackdateTransactionPopup;
