import React, { useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Popover,
  InputAdornment
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

const BackdateTransactionPopup = ({ open, anchorEl, onClose, onDone }) => {
  const [date, setDate] = React.useState('');
  const dateInputRef = useRef(null);

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const handleClear = () => {
    setDate('');
  };

  const handleDone = () => {
    onDone(date);
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
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid #ccc',
          mt: 1
        }
      }}
    >
      <Box>
        {/* Blue Header Bar */}
        <Box sx={{ bgcolor: '#7788bb', color: '#fff', p: 1, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
            Backdate Transaction
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ mb: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#5c6bc0', 
                  fontWeight: 'bold',
                  pb: 0.5
                }}
              >
                Backdate To:
              </Typography>
              <Box sx={{ flexGrow: 1, borderBottom: '1.5px solid #7788bb', cursor: 'pointer' }} onClick={() => dateInputRef.current?.showPicker()}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  variant="standard"
                  inputRef={dateInputRef}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                      </InputAdornment>
                    ),
                    sx: { 
                      fontSize: '13px',
                      py: 0.5,
                      '& input::-webkit-calendar-picker-indicator': {
                        cursor: 'pointer'
                      }
                    }
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button 
              size="small" 
              onClick={handleToday}
              sx={{ 
                textTransform: 'none', 
                color: '#5c6bc0',
                fontSize: '11px',
                minWidth: 'auto',
                px: 1
              }}
            >
              Today
            </Button>
            <Button 
              size="small" 
              onClick={handleClear}
              sx={{ 
                textTransform: 'none', 
                color: '#d32f2f',
                fontSize: '11px',
                minWidth: 'auto',
                px: 1
              }}
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleDone}
              sx={{ 
                textTransform: 'none', 
                bgcolor: '#d4c4a8',
                fontSize: '11px',
                borderRadius: '4px',
                px: 2,
                '&:hover': {
                  bgcolor: '#c5b396'
                }
              }}
            >
              Done
            </Button>
          </Stack>
        </Box>
      </Box>
    </Popover>
  );
};

export default BackdateTransactionPopup;
