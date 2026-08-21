import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const DueDateSelector = ({ dueDate, setDueDate }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label={<span style={{ fontFamily: 'Inter' }}>Due Date <span style={{ color: '#ef4444' }}>*</span></span>}
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
          views={['year', 'month', 'day']}
          slotProps={{ 
            textField: { 
              size: 'small', 
              sx: { width: '250px', '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter' } },
              InputLabelProps: { shrink: true, sx: { fontFamily: 'Inter' } }
            },
            popper: { sx: { zIndex: 14000 } }
          }}
        />
      </LocalizationProvider>
      <Typography sx={{ color: '#22c55e', fontSize: '12px', mt: 1, fontFamily: 'Inter' }}>
        Based on the Lab's turn around time the case should arrive on time
      </Typography>
    </Box>
  );
};

export default DueDateSelector;
