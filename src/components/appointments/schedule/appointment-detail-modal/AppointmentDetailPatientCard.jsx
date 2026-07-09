import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { PhoneOutlined, EmailOutlined, VerifiedUserOutlined, Timeline, LocationOnOutlined, PersonOutline } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const AppointmentDetailPatientCard = ({ 
  initials, patientName, patientCode, phone, email, insurance, visitType,
  editDate, setEditDate, editTime, setEditTime, editAmPm, setEditAmPm,
  roomId, scheduledBy
}) => {
  return (
    <Box sx={{ width: '835px', height: '188px', border: '1px solid #e2e8f0', borderRadius: '12px', p: '20px', flexShrink: 0, boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Patient Detail Info */}
      <Box sx={{ display: 'flex', gap: '5.5px', width: '451.33px', height: '66px' }}>
        <Avatar sx={{ width: 56, height: 56, backgroundColor: '#1d4ed8', fontSize: '20px', fontWeight: 600, mr: '10.5px' }}>
          {initials}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', mb: '4px', lineHeight: 1 }}>
            Patient
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '6px' }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
              {patientName}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', color: '#64748b', lineHeight: 1 }}>
              {patientCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '395.83px', height: '18px', color: '#64748b' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <PhoneOutlined sx={{ fontSize: '16px', color: '#10b981' }} /> {phone}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <EmailOutlined sx={{ fontSize: '16px', color: '#3b82f6' }} /> {email}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <VerifiedUserOutlined sx={{ fontSize: '16px', color: '#0ea5e9' }} /> {insurance}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Visit Type */}
      <Box sx={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', mb: '6px', whiteSpace: 'nowrap', textAlign: 'center' }}>
          Type of Visit
        </Typography>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
          backgroundColor: '#eff6ff', borderRadius: '33554400px', width: '110px', height: '25px'
        }}>
          <Timeline sx={{ fontSize: '14px', color: '#3b82f6' }} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
            {visitType}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: '12px', mb: '20px', width: '100%' }} />

      {/* Details Row */}
      <Box sx={{ display: 'flex' }}>
        {/* Date and Time Group */}
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {/* Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2.8px', pt: '5.2px', width: '160px', boxSizing: 'border-box' }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1 }}>Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                value={editDate}
                onChange={(newValue) => setEditDate(newValue)}
                views={['year', 'month', 'day']}
                slotProps={{
                  popper: { sx: { zIndex: 10000 } },
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px' },
                      '& .MuiInputBase-input': { fontSize: '14px', fontFamily: 'Inter', color: '#0f172a' }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2.8px', pt: '5.2px', width: '160px', boxSizing: 'border-box' }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1 }}>Time</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={(() => {
                  const [hStr, mStr] = editTime.split(':');
                  let hr = parseInt(hStr || '9', 10);
                  const min = parseInt(mStr || '0', 10);
                  if (editAmPm === 'PM' && hr < 12) hr += 12;
                  if (editAmPm === 'AM' && hr === 12) hr = 0;
                  return dayjs().hour(hr).minute(min).second(0);
                })()}
                onChange={(v) => {
                  if (!v) return;
                  setEditTime(v.format('hh:mm'));
                  setEditAmPm(v.format('A'));
                }}
                slotProps={{
                  popper: { sx: { zIndex: 10000 } },
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px' },
                      '& .MuiInputBase-input': { fontSize: '14px', fontFamily: 'Inter', color: '#0f172a' }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Operatory */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2.8px', pt: '5.2px', width: '80px', ml: '32px', mr: '48px', boxSizing: 'border-box' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', lineHeight: 1 }}>
            Operatory
          </Typography>
          <Box sx={{ height: '36px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>
              <LocationOnOutlined sx={{ fontSize: '16px', color: '#64748b' }} />
              {roomId ? `Op ${roomId}` : 'None'}
            </Typography>
          </Box>
        </Box>

        {/* Scheduled By */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2.8px', pt: '5.2px', width: '180px', boxSizing: 'border-box' }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', lineHeight: 1 }}>
            Scheduled By
          </Typography>
          <Box sx={{ height: '36px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap' }}>
              <PersonOutline sx={{ fontSize: '16px', color: '#64748b' }} />
              {scheduledBy || 'Front Desk'} · {dayjs().format('MM/DD/YYYY')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentDetailPatientCard;
