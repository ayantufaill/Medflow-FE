import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { NotificationsActiveOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { appointmentService } from '../../../../services/appointment.service';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const AppointmentDetailFooter = ({
  onClose, onSave, status, notes, editDate, editTime, editAmPm,
  isRescheduling, onCancelReschedule, onStartReschedule, onClinicalExam,
  appointmentId
}) => {
  const { showSnackbar } = useSnackbar();
  const [sendingConfirmation, setSendingConfirmation] = useState(false);

  const handleSendConfirmation = async () => {
    if (!appointmentId || sendingConfirmation) return;
    setSendingConfirmation(true);
    try {
      const result = await appointmentService.sendConfirmationNotification(appointmentId);
      const sentVia = [
        result?.email?.sent && 'email',
        result?.sms?.sent && 'SMS',
      ].filter(Boolean);
      if (sentVia.length > 0) {
        showSnackbar(`Confirmation sent via ${sentVia.join(' and ')}`, 'success', { vertical: 'top', horizontal: 'right' });
      } else {
        const reason = result?.email?.reason || result?.sms?.reason || 'No contact info available for this patient';
        showSnackbar(reason, 'warning', { vertical: 'top', horizontal: 'right' });
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to send confirmation', 'error', { vertical: 'top', horizontal: 'right' });
    } finally {
      setSendingConfirmation(false);
    }
  };

  return (
    <Box sx={{ height: '57px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', px: '24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
      {!isRescheduling ? (
        <>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }, fontWeight: 600, borderRadius: '6px', px: '16px' }}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            onClick={onClinicalExam}
            sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#0f172a', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }, fontWeight: 600, borderRadius: '6px', px: '16px' }}
          >
            Clinical Exam
          </Button>
          {status === 'confirmed' && (
            <Button
              variant="outlined"
              onClick={handleSendConfirmation}
              disabled={sendingConfirmation}
              startIcon={<NotificationsActiveOutlined sx={{ fontSize: '18px' }} />}
              sx={{ textTransform: 'none', borderColor: '#1d4ed8', color: '#1d4ed8', '&:hover': { bgcolor: '#eff6ff', borderColor: '#1d4ed8' }, fontWeight: 600, borderRadius: '6px', px: '16px' }}
            >
              {sendingConfirmation ? 'Sending...' : 'Send Confirmation'}
            </Button>
          )}
          <Button
            variant="contained"
            disableElevation
            onClick={onStartReschedule}
            sx={{ textTransform: 'none', bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af' }, fontWeight: 600, borderRadius: '6px', px: '24px' }}
          >
            Reschedule
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outlined" 
            onClick={onCancelReschedule}
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
        </>
      )}
    </Box>
  );
};

export default AppointmentDetailFooter;
