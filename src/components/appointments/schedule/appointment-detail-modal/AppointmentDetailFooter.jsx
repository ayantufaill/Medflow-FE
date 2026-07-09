import React from 'react';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';

const AppointmentDetailFooter = ({ 
  onClose, onSave, status, notes, editDate, editTime, editAmPm 
}) => {
  return (
    <Box sx={{ height: '57px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', px: '24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      <Button 
        variant="outlined" 
        onClick={onClose}
        sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }, fontWeight: 600, borderRadius: '6px', px: '16px' }}
      >
        Cancel
      </Button>
      <Button 
        variant="contained" 
        disableElevation
        onClick={() => {
          // Convert to 24-hr time for backend
          let hoursStr = editTime.split(':')[0] || '09';
          let minsStr = editTime.split(':')[1] || '00';
          let hr = parseInt(hoursStr, 10);
          if (editAmPm === 'PM' && hr < 12) hr += 12;
          if (editAmPm === 'AM' && hr === 12) hr = 0;
          const startTime24 = `${hr.toString().padStart(2, '0')}:${minsStr}`;
          
          onSave({ 
            status, 
            notes,
            appointmentDate: editDate ? editDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
            startTime: startTime24
          });
        }}
        sx={{ textTransform: 'none', bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af' }, fontWeight: 600, borderRadius: '6px', px: '24px' }}
      >
        Save Reschedules
      </Button>
    </Box>
  );
};

export default AppointmentDetailFooter;
