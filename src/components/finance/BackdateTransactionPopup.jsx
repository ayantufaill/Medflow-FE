import React from 'react';
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
          p: 2,
          width: 280,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          mt: 1
        }
      }}
    >
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#333', 
            mb: 2,
            fontSize: '14px'
          }}
        >
          Backdate Transaction
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              color: '#666', 
              mb: 0.5,
              fontWeight: 500
            }}
          >
            Backdate To:
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonth sx={{ fontSize: 18, color: '#90a4ae' }} />
                </InputAdornment>
              ),
              sx: { 
                fontSize: '13px',
                '& input::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer'
                }
              }
            }}
          />
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button 
            size="small" 
            onClick={handleToday}
            sx={{ 
              textTransform: 'none', 
              color: '#5c6bc0',
              fontSize: '12px',
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
              fontSize: '12px',
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
              bgcolor: '#5c6bc0',
              fontSize: '12px',
              borderRadius: '4px',
              px: 2,
              '&:hover': {
                bgcolor: '#3f51b5'
              }
            }}
          >
            Done
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
};

export default BackdateTransactionPopup;
