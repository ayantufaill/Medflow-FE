import React from 'react';
import { Box, Typography, Select, MenuItem, Avatar, TextField } from '@mui/material';
import { AccessTimeOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { STATUS_OPTIONS } from '../../new-appointment/constants';

const AppointmentDetailStatus = ({ 
  status, setStatus, durationMinutes, provider, notes, isRescheduling 
}) => {
  return (
    <Box sx={{ width: '260px', height: '330px', border: '1px solid #e2e8f0', borderRadius: '12px', p: '20px', flexShrink: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', mb: '12px' }}>
          Appointment Status
        </Typography>
        {!isRescheduling ? (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#fff7ed', border: '1px solid #ffedd5',
            borderRadius: '20px', px: '10px', py: '6px', width: '100%', boxSizing: 'border-box', height: '36px'
          }}>
            <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316' }} />
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#ea580c', textTransform: 'capitalize' }}>
              {status?.toLowerCase() || 'Unconfirmed'}
            </Typography>
          </Box>
        ) : (
          <Select 
            MenuProps={{ 
              sx: { zIndex: 10000 },
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
              PaperProps: { style: { maxHeight: 250 } }
            }}
            fullWidth
            size="small" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            sx={{ 
              fontFamily: 'Inter', fontSize: '13px',
              height: '36px', borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': { borderWidth: '1px' },
              bgcolor: '#ffffff'
            }}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value} sx={{ fontFamily: "Inter", fontSize: "13px" }}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AccessTimeOutlined sx={{ fontSize: '16px', color: '#3b82f6' }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', mb: '2px' }}>
            Duration
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
            {durationMinutes || 30} min
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#1d4ed8', fontSize: '12px', fontWeight: 600 }}>
          {provider ? provider.substring(0, 2).toUpperCase() : 'AW'}
        </Avatar>
        <Box>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', mb: '2px' }}>
            Provider Time
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
            {provider || 'Amanda Wilson'} · {durationMinutes || 30} min
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', mb: '4px' }}>
          <InsertDriveFileOutlined sx={{ fontSize: '16px' }} /> Notes
        </Typography>
        <TextField 
          fullWidth 
          multiline 
          rows={3} 
          placeholder="No notes available" 
          value={notes}
          InputProps={{ readOnly: true }}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', fontSize: '14px', p: '12px' } }}
        />
      </Box>
    </Box>
  );
};

export default AppointmentDetailStatus;
