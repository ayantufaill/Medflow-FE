import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CalendarMonthOutlined, Close } from '@mui/icons-material';

const AppointmentDetailHeader = ({ status, onClose }) => {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', px: '24px', height: '73px',
      backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0
    }}>
      <Box sx={{
        width: '370px', height: '42px', display: 'flex', alignItems: 'center'
      }}>
        <Box sx={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          mr: '16px', flexShrink: 0
        }}>
          <CalendarMonthOutlined sx={{ color: '#3b82f6', fontSize: '24px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', color: '#0f172a', lineHeight: 1 }}>
              Appointment Detail
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#fff7ed', border: '1px solid #ffedd5',
              borderRadius: '20px', px: '10px', py: '2px'
            }}>
              <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316' }} />
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '12px', color: '#ea580c', textTransform: 'capitalize' }}>
                {status?.toLowerCase() || 'Unconfirmed'}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
            See the complete detail of patient appointment
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose} size="small">
        <Close sx={{ fontSize: '20px', color: '#64748b' }} />
      </IconButton>
    </Box>
  );
};

export default AppointmentDetailHeader;
